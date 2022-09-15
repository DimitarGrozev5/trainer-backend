export interface EnduroGripState {
  sessionDate: number;
  sessionIndex: number;
  lastHeavySessionAchieved: number;
  schedule: number[];
  currentScheduleIndex: number;
}

export interface EnduroGripInit {
  startDate: Date;
  schedule: number[];
}

export interface EnduroGripAchieved {
  sets: number;
}
