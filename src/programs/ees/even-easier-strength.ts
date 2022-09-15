import { add } from 'date-fns';
import { roundDate, now } from '../../utils/date';
import { eesAchieved, eesState } from './ees-types';

module.exports = {
  valiateInitData: () => true,
  getInitData: (): eesState => {
    const now = roundDate(new Date());
    return {
      sessionDate: now.getTime(),
      setsDone: {
        push: 0,
        pull: 0,
        squat: 0,
        ab: 0,
        accessory: 0,
      },
    };
  },

  validateAchievedData: (achieved: eesAchieved | 'skip'): boolean => {
    if (achieved === 'skip') {
      return true;
    }

    let isValid = true;

    // Has props
    isValid = isValid && 'push' in achieved;
    isValid = isValid && 'pull' in achieved;
    isValid = isValid && 'squat' in achieved;
    isValid = isValid && 'ab' in achieved;
    isValid = isValid && 'accessory' in achieved;
    if (!isValid) {
      return false;
    }

    // Props are numbers
    isValid = isValid && !Number.isNaN(Number(achieved.push));
    isValid = isValid && !Number.isNaN(Number(achieved.pull));
    isValid = isValid && !Number.isNaN(Number(achieved.squat));
    isValid = isValid && !Number.isNaN(Number(achieved.ab));
    isValid = isValid && !Number.isNaN(Number(achieved.accessory));
    if (!isValid) {
      return false;
    }

    // Props are less than or equal to two
    isValid = isValid && achieved.push <= 2 && achieved.push >= 0;
    isValid = isValid && achieved.pull <= 2 && achieved.pull >= 0;
    isValid = isValid && achieved.squat <= 2 && achieved.squat >= 0;
    isValid = isValid && achieved.ab <= 2 && achieved.ab >= 0;
    isValid = isValid && achieved.accessory <= 2 && achieved.accessory >= 0;

    return isValid;
  },
  getNextState: (state: eesState, achieved: eesAchieved | 'skip'): eesState => {
    const skip = achieved === 'skip';

    // If achieved is null, set it to no sets
    let achievedSets = skip
      ? {
          push: 0,
          pull: 0,
          squat: 0,
          ab: 0,
          accessory: 0,
        }
      : { ...achieved };

    const allSets = Object.values(achievedSets).reduce(
      (sum: number, sets: number) => sum + sets,
      0
    );

    // Destructure session data
    const { sessionDate: UTCDate } = state;

    // Convert sessionDate to Date object
    const sessionDate = new Date(UTCDate);

    // If *skip* calcualte next date based on last session date
    const cDate = skip ? sessionDate : now();

    // Set nextSessionDate to current session date
    let nextSessionDate = sessionDate;

    // If the required sets are achieved or *skip*, move to the next date
    if (allSets === 10 || skip) {
      nextSessionDate = add(cDate, { days: 1 });
    }

    // Set the sets
    let setsDone = {
      push: achievedSets.push,
      pull: achievedSets.pull,
      squat: achievedSets.squat,
      ab: achievedSets.ab,
      accessory: achievedSets.accessory,
    };

    // If *skip* set sets to zero
    if (skip) {
      setsDone = {
        push: 0,
        pull: 0,
        squat: 0,
        ab: 0,
        accessory: 0,
      };
    }

    // If the required sets are achived the next state will be zero, else it will be plus one
    if (allSets === 10) {
      setsDone = {
        push: achievedSets.push % 2,
        pull: achievedSets.pull % 2,
        squat: achievedSets.squat % 2,
        ab: achievedSets.ab % 2,
        accessory: achievedSets.accessory % 2,
      };
    }

    return {
      sessionDate: nextSessionDate.getTime(),
      setsDone,
    };
  },
};
