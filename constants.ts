import { TeamName, TeamInfo } from './types';

// Reference Date: 2026-01-11
// On this day: 乙 (Yi) is Day Shift (Day 1 of 4).
// Therefore, on Jan 12, 2026: 乙 (Yi) enters Night Shift (Early Night).
export const REFERENCE_DATE = new Date(2026, 0, 11); // Month is 0-indexed

export const TEAMS: Record<TeamName, TeamInfo> = {
  [TeamName.JIA]: {
    name: TeamName.JIA,
    color: 'bg-red-100 text-red-800 border-red-200',
    stationMaster: '丁照一',
    shuntingInstructor: '付宝景'
  },
  [TeamName.YI]: {
    name: TeamName.YI,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    stationMaster: '耿孝坤',
    shuntingInstructor: '冯海鑫'
  },
  [TeamName.BING]: {
    name: TeamName.BING,
    color: 'bg-green-100 text-green-800 border-green-200',
    stationMaster: '曹鲁泉',
    shuntingInstructor: '李银健'
  },
  [TeamName.DING]: {
    name: TeamName.DING,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    stationMaster: '石钢琴',
    shuntingInstructor: '马勇'
  }
};

// Sequence of teams taking the "Day Shift" (Day 1 state)
// Sequence Logic: 乙(Yi) -> 丁(Ding) -> 甲(Jia) -> 丙(Bing)
export const DAY_SHIFT_SEQUENCE = [
  TeamName.YI,
  TeamName.DING,
  TeamName.JIA,
  TeamName.BING
];