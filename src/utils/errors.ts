import HttpStatusCode from "../constants/http-status-code";

export const formatErrorLog = (message: string, e: unknown): string => {
    if (e instanceof CustomError) {
        return `${message} ${e.errorCode}: ${e.message}${e.details ? `\n${JSON.stringify(e.details)}` : ""}\n${e.stack}`
    } else if (e instanceof Error) {
        return `${message} ${e.name}: ${e.message}\n${e.stack}`
    } else {
        return `${message} ${e}`
    }
}

export class CustomError extends Error {
    public statusCode: HttpStatusCode
    public errorCode: string
    public details?: Record<string, any>
    public clientMessage?: string
    
    constructor(message: string, statusCode: HttpStatusCode, clientMessage: string, details?: any) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain

        this.name = this.constructor.name
        this.errorCode = this.constructor.name.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase()
        this.statusCode = statusCode        
        this.details = details
        this.clientMessage = clientMessage

        Error.captureStackTrace(this, this.constructor)
    }
}

export class BadRequestError extends CustomError {
    readonly _tag = "BadRequestError"

    constructor(message: string, clientMessage?: string, details?: any) {
        super(message, HttpStatusCode.BAD_REQUEST, clientMessage ?? message, details)
    }
}

export class UnauthorizedError extends CustomError {
    readonly _tag = "UnauthorizedError"

    constructor(message: string, details?: any) {
        super(message, HttpStatusCode.UNAUTHORIZED, "Unauthorized.", details)
    }
}

export class ForbiddenError extends CustomError {
    readonly _tag = "ForbiddenError"

    constructor(message: string, details?: any) {
        super(message, HttpStatusCode.FORBIDDEN, "Forbidden." , details)
    }
}

export class NotFoundError extends CustomError {
    readonly _tag = "NotFoundError"

    constructor(message: string, clientMessage?: string, details?: any) {
        super(message, HttpStatusCode.NOT_FOUND, clientMessage ?? message, details)
    }
}

export class InputError extends CustomError {
    readonly _tag = "InputError"

    constructor(message: string, details?: any) {
        super(message, HttpStatusCode.BAD_REQUEST, message, details)
    }
}

export class AuthError extends CustomError {
    readonly _tag = "AuthError"

    constructor(message: string, clientMessage?: string, details?: any) {
        super(message, HttpStatusCode.BAD_REQUEST, clientMessage ?? message, details)
    }
}

export class DatabaseError extends CustomError {
    readonly _tag = "DatabaseError"

    constructor(message: string, details?: any) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, "An unexpected error occured. Please try again later.", details)
    }
}

export class InternalError extends CustomError {
    readonly _tag = "InternalError"

    constructor(message: string, details?: any) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, "An unexpected error occured. Please try again later.", details)
    }
}