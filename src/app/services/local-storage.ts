export class LocalStorage {
    scores: any;
    scoreType: any;
    scoreArraySize: number;

    constructor() {
        this.scores = {
            BlockEasy: 'BlockEasy',
            BlockHard: 'BlockHard',
            BlockImpossible: 'BlockImpossible',
            BlockFlappy: 'BlockFlappy',
            Matching: 'Matching'
        };
        this.scoreType = { HIGH: 'HIGH', LOW: 'LOW' };
        this.scoreArraySize = 5;
    }

    //
    // Return a high score by name
    //
    GetScoreByName(name) {
        let scores;

        switch (name) {
            case this.scores.BlockEasy:
                scores = localStorage.blockEasy;
                break;
            case this.scores.BlockHard:
                scores = localStorage.blockHard;
                break;
            case this.scores.BlockImpossible:
                scores = localStorage.blockImpossible;
                break;
            case this.scores.BlockFlappy:
                scores = localStorage.blockFlappy;
                break;
            case this.scores.Matching:
                scores = localStorage.Matching;
                break;
            default:
                scores = [0];
                break;
        }

        if (scores === undefined || scores === null){
            return [0];
        }

        return JSON.parse(scores);
    }

    //
    // Set a new high score by name
    //
    InsertScoreByName(name, value, type) {
        let currentScores: Array<number> = this.GetScoreByName(name);

        if (currentScores.length === 1 && currentScores[0] === 0){
            currentScores.pop();
        }

        currentScores.push(parseInt(value));
        currentScores.sort((a, b) => b - a);

        if (type === this.scoreType.LOW) {
            currentScores.reverse();
        }

        while (currentScores.length > this.scoreArraySize){
            currentScores.pop();
        }

        this.SetScoreByName(name, JSON.stringify(currentScores));
    }

    //
    // Set a new high score by name
    //
    SetScoreByName(name, value) {
        switch (name) {
            case this.scores.BlockEasy:
                localStorage.blockEasy = value;
                break;
            case this.scores.BlockHard:
                localStorage.blockHard = value;
                break;
            case this.scores.BlockImpossible:
                localStorage.blockImpossible = value;
                break;
            case this.scores.BlockFlappy:
                localStorage.blockFlappy = value;
                break;
            case this.scores.Matching:
                localStorage.Matching = value;
                break;
            default:
                break;
        }
    }

    //
    // Set all null or undefined this.scores to zero
    //
    SetNullScoresToZero() {
        for (const key in this.scores) {
            const score = this.GetScoreByName(key);
            if (score === null || score === undefined) {
                this.SetScoreByName(key, JSON.stringify([0]));
            }
        }
    }

    //
    // Reset a high score to zero
    //
    ResetHighScore(name) {
        this.SetScoreByName(name, JSON.stringify([0]));
    }

    //
    // Check if player score is a high score
    //
    IsHighScore(playerHighScore, playerScore) {
        return playerHighScore < playerScore;
    }

    //
    // Check if player score is a high score (low)
    //
    IsLowScore(playerHighScore, playerScore) {
        return playerHighScore > playerScore;
    }

    // Set user ID in local storage
    SetUser(id) {
        localStorage.setItem('user_id', id);
    }

    // Retrieve user ID in local storage
    GetUser() {
        return localStorage.getItem('user_id')
    }
}
