import { AxiosError } from "axios";
import { ErrorType } from "./errorsCodes";

type Slots = Record<string, string>

export abstract class HttpError extends Error {
    declare status: number;
    declare errorId: string
    declare slots: Slots;

    constructor(errorType:ErrorType, status: number, slots: Slots);
    constructor(errorID: string, m: string, status: number, slots: Slots);

    constructor(...params: any[]) {
        if(params.length === 3) { // first constructor
            super(params[0].key);
            this.errorId = params[0].code;
            this.status = params[1];
            this.slots = params[2];
        } else { // second constructor
            super(params[1]);
            this.errorId = params[0];
            this.status = params[2];
            this.slots = params[3];
        }
    }
}

export class BadRequestError extends HttpError {
    constructor(errorType:ErrorType, slots: Slots);
    constructor(errorID: string, m: string, slots: Slots);

    constructor(...params: any[]) {
        if(params.length === 2) { // first constructor
            super(params[0], 400, params[1]);
        } else { // second constructor
            super(params[0], params[1], 400, params[2]);
        }
        this.name = "Bad Request";
    }
}

export class UnauthorizedError extends HttpError {
    constructor(errorType:ErrorType, slots: Slots);
    constructor(errorID: string, m: string, slots: Slots);

    constructor(...params: any[]) {
        if(params.length === 2) { // first constructor
            super(params[0], 401, params[1]);
        } else { // second constructor
            super(params[0], params[1], 401, params[2]);
        }
        this.name = "Unauthorized";
    }
}

export class ForbiddenError extends HttpError {
    constructor(errorType:ErrorType, slots: Slots);
    constructor(errorID: string, m: string, slots: Slots);

    constructor(...params: any[]) {
        if(params.length === 2) { // first constructor
            super(params[0], 403, params[1]);
        } else { // second constructor
            super(params[0], params[1], 403, params[2]);
        }
        this.name = "Forbidden";
    }
}

export class NotFoundError extends HttpError {
    constructor(errorType:ErrorType, slots: Slots);
    constructor(errorID: string, m: string, slots: Slots);

    constructor(...params: any[]) {
        if(params.length === 2) { // first constructor
            super(params[0], 404, params[1]);
        } else { // second constructor
            super(params[0], params[1], 404, params[2]);
        }
        this.name = "Not Found";
    }
}

export class InternalError extends HttpError {
    constructor(errorType:ErrorType, slots: Slots);
    constructor(errorID: string, m: string, slots: Slots);

    constructor(...params: any[]) {
        if(params.length === 2) { // first constructor
            super(params[0], 500, params[1]);
        } else { // second constructor
            super(params[0], params[1], 500, params[2]);
        }
        this.name = "Not Found";
    }
}


export class ConflictError extends HttpError {
    constructor(errorType:ErrorType, slots: Slots);
    constructor(errorID: string, m: string, slots: Slots);

    constructor(...params: any[]) {
        if(params.length === 2) { // first constructor
            super(params[0], 409, params[1]);
        } else { // second constructor
            super(params[0], params[1], 409, params[2]);
        }
        this.name = "Conflict";
    }
}

export function convertAxiosErrorToHttpError(err: AxiosError<any, any>): HttpError {
    switch(err.response?.status) {
        case 400:
            return new BadRequestError(err.response.data.errors[0].id, err.response.data.errors[0].message, {});
        case 401: 
            return new UnauthorizedError(err.response.data.errors[0].id, err.response.data.errors[0].message, {});
        case 404:
            return new NotFoundError(err.response.data.errors[0].id, err.response.data.errors[0].message, {});
        case 409:
            return new ConflictError(err.response.data.errors[0].id, err.response.data.errors[0].message, {});
        case 500:
            return new InternalError(err.response.data.errors[0].id, err.response.data.errors[0].message, {});
        default:
            throw err;
    }
}