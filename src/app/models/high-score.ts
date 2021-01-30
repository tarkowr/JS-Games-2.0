export interface HighScore {
    userId: string;
    username: string;
    date: TimeStamp;
    score: number;
}

interface TimeStamp {
    _nanoseconds: number;
    _seconds: number;
}