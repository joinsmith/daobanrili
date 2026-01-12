export enum TeamName {
  JIA = '甲',
  YI = '乙',
  BING = '丙',
  DING = '丁'
}

export enum RoleType {
  OPS = '行车',
  SHUNTING = '调车'
}

export enum ShiftType {
  DAY = '白班', // 8:00 - 20:00
  EARLY_NIGHT = '前夜', // 20:00 - 02:30
  LATE_NIGHT = '后夜', // 02:30 - 08:00
  NIGHT = '夜班', // 20:00 - 08:00 (Shunting)
  REST = '休息',
  OFF = '下班'
}

export interface TeamInfo {
  name: TeamName;
  color: string;
  stationMaster: string; // 值班站长
  shuntingInstructor: string; // 调车指导
}

export interface DayInfo {
  date: Date;
  dayShiftTeam: TeamInfo; // The team working 8-20
  nightShiftTeam: TeamInfo; // The team working the night shift starting this day (20:00)
}

export interface CurrentStatus {
  ops: {
    team: TeamInfo;
    shift: ShiftType;
    personnelLabel: string;
    personnelName: string;
    isWorking: boolean;
  };
  shunting: {
    team: TeamInfo;
    shift: ShiftType;
    personnelLabel: string;
    personnelName: string;
    isWorking: boolean;
  };
}