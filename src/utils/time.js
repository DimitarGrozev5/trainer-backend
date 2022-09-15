"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDurationText = exports.formatDurationClock = void 0;
const date_1 = require("./date");
// Function to format duration to hours:minutes:seconds
const formatDurationClock = (duration) => {
    const hours = Math.floor(duration / 60 / 60);
    const minutes = Math.floor((duration - hours * 60) / 60);
    const seconds = Math.round(duration - minutes * 60 - hours * 3600);
    const result = [minutes, seconds].map((t) => (0, date_1.lz)(t));
    if (hours > 0) {
        result.unshift(hours.toString());
    }
    return result.join(":");
};
exports.formatDurationClock = formatDurationClock;
// Format duration to h or m or s
const formatDurationText = (duration) => {
    if (duration <= 60) {
        return `${Math.floor(duration)}s`;
    }
    if (duration <= 60 * 60) {
        return `${Math.floor(duration / 60)}m`;
    }
    return `${Math.floor(duration / 60 / 60)}h`;
};
exports.formatDurationText = formatDurationText;
