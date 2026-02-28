import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const validate = (schema: z.ZodTypeAny) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            next(error);
        }
    };

export default validate;
