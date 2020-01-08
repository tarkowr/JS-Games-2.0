import { LocalStorage } from './local-storage';

export class UserSettingsService {
    localStorage: LocalStorage;

    constructor() {
        this.localStorage = new LocalStorage();
    }

    resetScores(blockEasy: boolean, blockHard: boolean, blockImpossible: boolean, blockFlappy: boolean, matchingOriginal: boolean) {
        if (blockEasy) {
            this.localStorage.ResetHighScore(this.localStorage.scores.BlockEasy);
        }
        if (blockHard) {
            this.localStorage.ResetHighScore(this.localStorage.scores.BlockHard);
        }
        if (blockImpossible) {
            this.localStorage.ResetHighScore(this.localStorage.scores.BlockImpossible);
        }
        if (blockFlappy) {
            this.localStorage.ResetHighScore(this.localStorage.scores.BlockFlappy);
        }
        if (matchingOriginal) {
            this.localStorage.ResetHighScore(this.localStorage.scores.Matching);
        }
    }

}