export interface User {
    id: string;
    username: string;
    created: TimeStamp;
    color: string;
}

interface TimeStamp {
    _nanoseconds: number;
    _seconds: number;
}