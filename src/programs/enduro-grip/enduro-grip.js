import { add } from 'date-fns';
import { validate } from 'class-validator';
import { CircularArray } from '../../utils/array.js';
import { roundDate } from '../../utils/date.js';
import { EnduroGripAchieved, EnduroGripInit, } from './enduro-grip-types.js';
import { SessionDate } from '../extra-types.js';
const trainingRotation = [4, 1, 6, 2, 8, 3, 5, 1, 7, 2, 9, 3];
const EnduroGrip = {
    transformInitData: async ({ startDate, schedule, }) => {
        const initData = new EnduroGripInit(startDate, schedule);
        return validate(initData).then((errors) => {
            if (errors.length > 0) {
                console.log(errors);
                return false;
            }
            return initData;
        });
    },
    getInitData: ({ startDate, schedule }) => {
        return {
            sessionDate: startDate,
            sessionIndex: 0,
            lastHeavySessionAchieved: 9,
            schedule,
            currentScheduleIndex: 0,
        };
    },
    transformAchievedData: async (achievedRaw) => {
        if (achievedRaw === 'skip') {
            return 'skip';
        }
        const achieved = new EnduroGripAchieved(achievedRaw.sets);
        return validate(achieved).then((errors) => {
            if (errors.length > 0) {
                return false;
            }
            return achieved;
        });
    },
    getNextState: (prevState, achieved) => {
        const skip = achieved === 'skip';
        const { sessionDate: sessionDateUtc, sessionIndex, lastHeavySessionAchieved, schedule, currentScheduleIndex, } = prevState;
        /// Calculate next session date
        // Convert sessionDate to Date object
        const sessionDate = SessionDate.toDate(sessionDateUtc);
        // Convert schedule to CircularArray
        const schedulePlan = new CircularArray(schedule, currentScheduleIndex);
        // Select the base date
        const fromDate = skip ? sessionDate : new Date();
        // Calculate next session date
        const nextSessionDate = roundDate(add(fromDate, { days: schedulePlan.i(0) }));
        // Calculate next schedule index
        const nextScheduleIndex = schedulePlan.getIndex(+1);
        /// Calculate next session params
        // Extract achived sets and fallback to lastHeavySessionAchieved if *skip*
        const sets = skip ? lastHeavySessionAchieved : achieved.sets;
        // Convert training rotation to CircularArray
        const trainingPlan = new CircularArray(trainingRotation, sessionIndex);
        // Set variables
        let nextSessionIndex = sessionIndex;
        let heavySessionAchieved = sets;
        // If the session was heavy always move to the next session and record the achieved result
        if (sessionIndex % 2 === 0) {
            nextSessionIndex = trainingPlan.getIndex(+1);
            heavySessionAchieved = sets;
        }
        // If the session was light decide wheter to move to the next session or the previous and don't record the achieved result
        else {
            heavySessionAchieved = lastHeavySessionAchieved;
            // If the last heavy session the user achieved the required number of sets, progress
            if (lastHeavySessionAchieved === trainingPlan.i(-1)) {
                nextSessionIndex = trainingPlan.getIndex(+1);
            }
            else {
                nextSessionIndex = trainingPlan.getIndex(-1);
            }
        }
        return {
            sessionDate: SessionDate.from(nextSessionDate),
            sessionIndex: nextSessionIndex,
            lastHeavySessionAchieved: heavySessionAchieved,
            schedule,
            currentScheduleIndex: nextScheduleIndex,
        };
    },
};
export default EnduroGrip;
