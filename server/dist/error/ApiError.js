"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    status;
    message;
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
    static forbiden(message) {
        return new ApiError(403, message);
    }
    static bedRequest(message) {
        return new ApiError(404, message);
    }
    static internal(message) {
        return new ApiError(500, message);
    }
}
exports.default = ApiError;
//# sourceMappingURL=ApiError.js.map