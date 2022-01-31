class BodyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BodyError';
    }
}

export default BodyError;
