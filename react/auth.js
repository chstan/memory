class Auth {
    isAuthenticated() {
        return (typeof sessionStorage.token) === 'string';
    }

    get headers() {
        if (!this.isAuthenticated()) {
            throw new Exception('Client is not authenticated');
        }

        return {
            'Authorization': `Token ${sessionStorage.token}`,
        };
    }
}

export default new Auth();
