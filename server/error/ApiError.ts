class ApiError extends Error {

    status: number;
    message: string;

    constructor(status: number, message: string) {
        super();
        this.status = status;
        this.message = message;
    }

    static forbiden(message: string) {
        return new ApiError(403, message)
    }

    static bedRequest(message: string) {
        return new ApiError(404, message)
    }

    static internal(message: string) {
        return new ApiError(500, message)
    }
}

module.exports = ApiError