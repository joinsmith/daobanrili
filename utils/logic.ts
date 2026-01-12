import { differenceInCalendarDays, addDays, getHours, getMinutes, startOfDay } from 'date-fns';
import { REFERENCE_DATE, DAY_SHIFT_SEQUENCE, TEAMS } from '../constants';
import { CurrentStatus, DayInfo, ShiftType, TeamInfo } from '../types';

/**
 * Calculates which team is on "Day Shift" (08:00 - 20:00) for a specific calendar date.
 * This determines the "Day 1" state for the rotation.
 */
export const getDayShiftTeam = (date: Date): TeamInfo => {
  const diff = differenceInCalendarDays(date, REFERENCE_DATE);
  // Default reference is index 0 (YI)
  const baseIndex = 0; 
  // Ensure positive modulo for negative dates
  const sequenceIndex = ((baseIndex + diff) % 4 + 4) % 4;
  const teamName = DAY_SHIFT_SEQUENCE[sequenceIndex];
  return TEAMS[teamName];
};

/**
 * Calculates which team is in "State 2" (Entering Night Shift) for a specific calendar date.
 * If Team X is Day Shift today, Team Y (who was Day Shift yesterday) is currently in State 2.
 */
export const getNightStartTeam = (date: Date): TeamInfo => {
  // The team that started their Day 1 yesterday is in Day 2 today.
  const prevDate = addDays(date, -1);
  return getDayShiftTeam(prevDate);
};

export const getDayInfo = (date: Date): DayInfo => {
  return {
    date,
    dayShiftTeam: getDayShiftTeam(date),
    nightShiftTeam: getNightStartTeam(date)
  };
};

/**
 * Determines the current real-time status.
 */
export const getCurrentStatus = (now: Date): CurrentStatus => {
  const hour = getHours(now);
  const minute = getMinutes(now);
  const currentTimeVal = hour + minute / 60;
  
  const today = startOfDay(now);
  const yesterday = addDays(today, -1);
  
  // Teams for Today and Yesterday
  const todayDayTeam = getDayShiftTeam(today);       // State 1 today
  const todayNightStartTeam = getNightStartTeam(today); // State 2 today (Did Day Shift yesterday)
  const yesterdayNightStartTeam = getNightStartTeam(yesterday); // State 2 yesterday (Did Day Shift 2 days ago)

  let opsStatus: CurrentStatus['ops'];
  let shuntStatus: CurrentStatus['shunting'];

  // --- Operations Logic ---
  // White: 08:00 - 20:00
  // Early Night: 20:00 - 02:30 (+1)
  // Late Night: 02:30 - 08:00
  
  if (currentTimeVal >= 8 && currentTimeVal < 20) {
    // Day Shift
    opsStatus = {
      team: todayDayTeam,
      shift: ShiftType.DAY,
      personnelLabel: '值班站长',
      personnelName: todayDayTeam.stationMaster,
      isWorking: true
    };
  } else if (currentTimeVal >= 20 || currentTimeVal < 2.5) {
    // Early Night (20:00 - 02:30)
    
    let activeTeam: TeamInfo;
    if (currentTimeVal >= 20) {
       // Started today at 20:00
       activeTeam = todayNightStartTeam;
    } else {
       // Started yesterday at 20:00. 
       // If it is 01:00, it is the shift that started yesterday 20:00.
       activeTeam = yesterdayNightStartTeam;
    }

    opsStatus = {
      team: activeTeam,
      shift: ShiftType.EARLY_NIGHT,
      personnelLabel: '值班站长',
      personnelName: activeTeam.stationMaster,
      isWorking: true
    };
  } else {
    // Late Night (02:30 - 08:00)
    // 02:30 - 08:00 of Today is covered by the team that started Night Shift Yesterday (20:00)
    // But logic check:
    // If today is 12th. `todayNightStartTeam` = Team that starts night shift on 12th (20:00).
    // The shift 02:30-08:00 on 12th is actually the completion of the night shift started on 11th.
    // However, in our cycle definition:
    // Day 2 (Ops): 02:30-08:00 (Late Night) THEN 20:00-02:30 (Early Night).
    // This implies `todayNightStartTeam` (Team entering State 2 today) handles BOTH parts.
    
    opsStatus = {
      team: todayNightStartTeam,
      shift: ShiftType.LATE_NIGHT,
      personnelLabel: '值班站长',
      personnelName: todayNightStartTeam.stationMaster,
      isWorking: true
    };
  }

  // --- Shunting Logic ---
  // White: 08:00 - 20:00
  // Night: 20:00 - 08:00 (+1)

  if (currentTimeVal >= 8 && currentTimeVal < 20) {
    // Day Shift
    shuntStatus = {
      team: todayDayTeam,
      shift: ShiftType.DAY,
      personnelLabel: '调车指导',
      personnelName: todayDayTeam.shuntingInstructor,
      isWorking: true
    };
  } else {
    // Night Shift (20:00 - 08:00)
    let activeTeam: TeamInfo;
    
    if (currentTimeVal >= 20) {
        // Started today 20:00
        activeTeam = todayNightStartTeam;
    } else {
        // Started yesterday 20:00 (00:00 - 08:00)
        activeTeam = yesterdayNightStartTeam;
    }

    shuntStatus = {
      team: activeTeam,
      shift: ShiftType.NIGHT,
      personnelLabel: '调车指导',
      personnelName: activeTeam.shuntingInstructor,
      isWorking: true
    };
  }

  return { ops: opsStatus, shunting: shuntStatus };
};