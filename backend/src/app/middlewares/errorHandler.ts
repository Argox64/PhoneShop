import express from "express";
import { convertErrorToHttpResponse } from "@app/utils/errors";

export const errorHandler = async(err: Error, req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> => {
    return convertErrorToHttpResponse(err, req, res);
}