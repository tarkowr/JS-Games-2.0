import { HighScore } from './high-score';

export interface Leaderboard {
    flappy: HighScore[];
    matching: HighScore[];
}