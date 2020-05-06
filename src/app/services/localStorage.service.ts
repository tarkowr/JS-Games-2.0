export class LocalStorage {

    constructor() {}

    // Set user ID in local storage
    SetUser(id) {
        localStorage.setItem('user_id', id);
    }

    // Retrieve user ID in local storage
    GetUser() {
        return localStorage.getItem('user_id')
    }
}
