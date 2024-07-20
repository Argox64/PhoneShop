export type ErrorType = {
    code: string;
    key: string;
}

//ERROR CODES
export const INTERNAL_ERROR : ErrorType = { code:"E500", key:"errors.internalError" };
export const INVALID_FIELD_ERROR : ErrorType = { code:"E400-1", key:"errors.invalid-field" };
export const REQUIRED_FIELD_ERROR : ErrorType = { code:"E400-2", key:"errors.required-field" };
export const INVALID_PRICE_RANGE_ERROR : ErrorType = { code:"E400-3", key:"errors.price-range-invalid" };
export const USER_ALREADY_EXISTS_ERROR : ErrorType = { code:"E400-5", key:"errors.user-already-exists" };
export const VALIDATION_EMAIL_ERROR : ErrorType = { code:"E400-4", key:"errors.validation.isEmail" };
export const VALIDATION_NOT_EMPTY_ERROR : ErrorType = { code:"E400-6", key:"errors.validation.notEmpty" };
export const VALIDATION_NOT_NULL_ERROR : ErrorType = { code:"E400-7", key:"errors.validation.notNull" };
export const UNAUTHORIZED_RESSOURCE_ERROR : ErrorType = { code:"E401-1", key:"errors.unauthorized-ressource" };
export const NOT_FOUND_RESSOURCE_ERROR : ErrorType = { code:"E404-1", key:"errors.not-found-ressource" };
export const FORBIDDEN_ERROR : ErrorType = { code:"E403-1", key:"errors.forbidden" };