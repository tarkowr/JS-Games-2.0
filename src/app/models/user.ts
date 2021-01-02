export interface User {
    id: string;
    username: string;
    created: TimeStamp;
}

interface TimeStamp {
    _nanoseconds: number;
    _seconds: number;
}