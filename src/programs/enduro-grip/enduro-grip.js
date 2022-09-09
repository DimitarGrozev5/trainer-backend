const CircularArray = require('../../utils/circular-array');

module.exports = {
  getInitData: ({ schedule }) => {
    return {
      sessionIndex: 0,
      lastHeavySessionAchieved: 9,
      schedule,
      currentScheduleIndex: 0,
    };
  },

  getNextState: (prevState, achieved) => {
    const {
      sessionIndex,
      lastHeavySessionAchieved,
      schedule,
      currentScheduleIndex,
    } = prevState;

    const trainingPlan = new CircularArray(trainingRotation, sessionIndex);

    const schedulePlan =
      new CircularArray() < number > (schedule, currentScheduleIndex);

    const nextScheduleIndex = schedulePlan.getIndex(+1);

    let nextSessionIndex = sessionIndex;
    let heavySessionAchieved = achieved.sets;

    // If the session was heavy always move to the next session and record the achieved result
    if (sessionIndex % 2 === 0) {
      nextSessionIndex = trainingPlan.getIndex(+1);
      heavySessionAchieved = achieved.sets;
    }

    // If the session was light decide wheter to move to the next session or the previous and don't record the achieved result
    else {
      heavySessionAchieved = lastHeavySessionAchieved;

      // If the last heavy session the user achieved the required number of sets, progress
      if (lastHeavySessionAchieved === trainingPlan.i(-1)) {
        nextSessionIndex = trainingPlan.getIndex(+1);
      } else {
        nextSessionIndex = trainingPlan.getIndex(-1);
      }
    }

    return {
      sessionIndex: nextSessionIndex,
      lastHeavySessionAchieved: heavySessionAchieved,
      schedule,
      currentScheduleIndex: nextScheduleIndex,
    };
  },
};
