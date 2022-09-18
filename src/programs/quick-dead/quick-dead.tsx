import { validate } from 'class-validator';
import { add, isEqual } from 'date-fns';
import { CircularArray } from '../../utils/array.js';
import { roundDate } from '../../utils/date.js';
import { qdInit, qdState, qdAchieved } from './qd-types.js';

const schedule = [2, 2, 3];

const quickDead = {
  transformInitData: async (initRaw: qdInit): Promise<qdInit | false> => {
    const initData = new qdInit(initRaw.startDate);
    return validate(initData).then((errors) => {
      if (errors.length > 0) {
        console.log(errors);
        return false;
      }
      return initData;
    });
  },
  getInitData: (val: qdInit): qdState => {
    return {
      sessionDate: val.startDate,
      scheduleIndex: 0,
      lastVolume: 100,
    };
  },

  transformAchievedData: async (
    achievedRaw: qdAchieved | 'skip'
  ): Promise<qdAchieved | 'skip' | false> => {
    if (achievedRaw === 'skip') {
      return 'skip';
    }

    const achieved = new qdAchieved(achievedRaw.volume);

    return validate(achieved).then((errors) => {
      if (errors.length > 0) {
        return false;
      }
      return achieved;
    });
  },
  getNextState: (
    prevState: qdState,
    achieved: qdAchieved | 'skip'
  ): qdState => {
    const skip = achieved === 'skip';

    const {
      sessionDate: sessionDateUtc,
      scheduleIndex,
      lastVolume,
    } = prevState;

    /// Calculate next session date
    // Convert sessionDate to Date object
    const sessionDate = new Date(sessionDateUtc);

    // Convert schedule to CircularArray
    const schedulePlan = new CircularArray<number>(schedule, scheduleIndex);

    // Select the base date
    const fromDate = skip ? sessionDate : new Date();

    // Calculate next session date
    const nextSessionDate = roundDate(
      add(fromDate, { days: schedulePlan.i(0) })
    );

    // Calculate next schedule index
    const nextScheduleIndex = schedulePlan.getIndex(+1);

    return {
      sessionDate: nextSessionDate.getTime(),
      scheduleIndex: nextScheduleIndex,
      lastVolume: skip ? lastVolume : achieved.volume,
    };
  },
};
export default quickDead;
