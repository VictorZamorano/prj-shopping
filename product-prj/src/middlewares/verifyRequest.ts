import {NextFunction, Request, Response} from 'express';
import { handleErrors } from '../utilities/handleErrors';
// import { getValidatorError } from '../utilities/get-validation-error';
// import { isEmpty, isBoolean } from 'validator';


// LOS MW deben validar una petición no la nada, ===> valida token de verificación de adm
export const verifyRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { product } = req.body;
        console.log(product.length);
        if(req.body == 0){
            throw new Error();
        }
        next();
    } catch (error) {
        const {status, message } = handleErrors(error.code);
        res.status(status).json({ result: message });
    }
};