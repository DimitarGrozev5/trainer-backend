import { add } from 'date-fns';
import { validate } from 'class-validator';

import { roundDate, now } from '../../utils/date.js';
import { eesAchieved, eesState } from './ees-types.js';

export default {
  transformInitData: async () => true,
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

  transformAchievedData: async (
    achievedRaw: eesAchieved | 'skip'
  ): Promise<eesAchieved | 'skip' | false> => {
    if (achievedRaw === 'skip') {
      return 'skip';
    }

    const achived = new eesAchieved(
      achievedRaw.push,
      achievedRaw.pull,
      achievedRaw.squat,
      achievedRaw.ab,
      achievedRaw.accessory
    );

    return validate(achived).then((errors) => {
      if (errors.length > 0) {
        return false;
      }
      return achived;
    });
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
