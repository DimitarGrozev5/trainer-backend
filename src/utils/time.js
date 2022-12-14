import { lz } from "./date";
// Function to format duration to hours:minutes:seconds
export const formatDurationClock = (duration) => {
    const hours = Math.floor(duration / 60 / 60);
    const minutes = Math.floor((duration - hours * 60) / 60);
    const seconds = Math.round(duration - minutes * 60 - hours * 3600);
    const result = [minutes, seconds].map((t) => lz(t));
    if (hours > 0) {
        result.unshift(hours.toString());
    }
    return result.join(":");
};
// Format duration to h or m or s
export const formatDurationText = (duration) => {
    if (duration <= 60) {
        return `${Math.floor(duration)}s`;
    }
    if (duration <= 60 * 60) {
        return `${Math.floor(duration / 60)}m`;
    }
    return `${Math.floor(duration / 60 / 60)}h`;
};
