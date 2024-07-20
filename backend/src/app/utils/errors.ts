import express from "express";
import { DatabaseError, ValidationError } from "sequelize";

import { HttpError, INTERNAL_ERROR } from "common-types"

export function convertErrorToHttpResponse(err: Error, req: express.Request, res: express.Response) {
    if(err instanceof HttpError) {
        err.message = req.t(err.message, err.slots)
        res.status(err.status).json({
            status: `${err.name} (${err.status})`,
            errors: [
                {
                    id: err.errorId,
                    message: err.message
                }
            ]
        });
        return;
    }
    else if(err instanceof ValidationError) {
        const errors = err.errors.map((error) => {
            return {
                id: error.message,
                message: req.t(`errors.validation.` + error.validatorKey, { fieldName: error.path, value: error.value }),
            }
        });

        const json = {
            status: `Bad Request (400)`,
            errors : errors
        };      
        return res.status(400).json(json);
    }
    else if(err instanceof DatabaseError) {
        if(err.name === 'SequelizeForeignKeyConstraintError' && 'fields' in err) {
            const fields = (err as any).fields;
            return res.status(400).json({
                status: `Bad Request (400)`,
                errors: [
                    {
                        id: 'errors.foreignkey-not-exists',
                        message: req.t(`The field '{{fieldName}}' does not refer to any existing resource.`, { fieldName: fields[0] })
                    }
            ]});
        }
    }
    return res.status(500).json({
        status: 'Internal Error (500)',
        errors: [
            {
                id: INTERNAL_ERROR.code,
                message: err.message
            }
        ]
    });
}