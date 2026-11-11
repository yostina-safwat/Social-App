type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'milliseconds';

export function toMs(time: number, unit: TimeUnit): number {
    switch (unit) {
        case 'seconds':
            return time * 1000;
        case 'minutes':
            return time * 60 * 1000;
        case 'hours':
            return time * 60 * 60 * 1000;
        case 'days':
            return time * 24 * 60 * 60 * 1000;
        default:
            return time;
    }
}

export function toSeconds(time: number, unit: TimeUnit): number {
    switch (unit) {
        case 'milliseconds':
            return time / 1000;
        case 'minutes':
            return time * 60;
        case 'hours':
            return time * 60 * 60;
        case 'days':
            return time * 24 * 60 * 60;
        default:
            return time;
    }
}
