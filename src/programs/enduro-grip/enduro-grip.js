import { add } from 'date-fns';
import { CircularArray } from '../../utils/array.js';
import { roundDate } from '../../utils/date.js';
const trainingRotation = [4, 1, 6, 2, 8, 3, 5, 1, 7, 2, 9, 3];
const EnduroGrip = {
    valiateInitData: ({ startDate, schedule }) => {
        // Check if date is number and converts to date
        if (Number.isNaN(Number(startDate))) {
            return false;
        }
        if (new Date(Number(startDate)).toString() === 'Invalid Date') {
            return false;
        }
        // Check allowed schedules
        if (!Array.isArray(schedule)) {
            return false;
        }
        switch (schedule.length) {
            case 1:
                if (Number(schedule[0]) !== 4) {
                    return false;
                }
                break;
            case 2:
                if (Number(schedule[0]) !== 4 || Number(schedule[1]) !== 3) {
                    return false;
                }
                break;
            default:
                return false;
        }
        return true;
    },
    getInitData: ({ startDate, schedule }) => {
        return {
            sessionDate: startDate.getTime(),
            sessionIndex: 0,
            lastHeavySessionAchieved: 9,
            schedule,
            currentScheduleIndex: 0,
        };
    },
    validateAchievedData: (achieved) => {
        if (achieved === 'skip') {
            return true;
        }
        // Check for sets prop
        if (!('sets' in achieved)) {
            return false;
        }
        // Check that sets are a number
        if (Number.isNaN(Number(achieved.sets))) {
            return false;
        }
        return true;
    },
    getNextState: (prevState, achieved) => {
        const skip = achieved === 'skip';
        const { sessionDate: sessionDateUtc, sessionIndex, lastHeavySessionAchieved, schedule, currentScheduleIndex, } = prevState;
        /// Calculate next session date
        // Convert sessionDate to Date object
        const sessionDate = new Date(sessionDateUtc);
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
            sessionDate: nextSessionDate.getTime(),
            sessionIndex: nextSessionIndex,
            lastHeavySessionAchieved: heavySessionAchieved,
            schedule,
            currentScheduleIndex: nextScheduleIndex,
        };
    },
};
export default EnduroGrip;
