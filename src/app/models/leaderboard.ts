import { HighScore } from './highScore';

export interface Leaderboard {
    flappy: HighScore[];
    matching: HighScore[];
}