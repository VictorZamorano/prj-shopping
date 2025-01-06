"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRequest = void 0;
const handleErrors_1 = require("../utilities/handleErrors");
// import { getValidatorError } from '../utilities/get-validation-error';
// import { isEmpty, isBoolean } from 'validator';
// LOS MW deben validar una petición no la nada, ===> valida token de verificación de adm
const verifyRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product } = req.body;
        console.log(product.length);
        if (req.body == 0) {
            throw new Error();
        }
        next();
    }
    catch (error) {
        const { status, message } = (0, handleErrors_1.handleErrors)(error.code);
        res.status(status).json({ result: message });
    }
});
exports.verifyRequest = verifyRequest;
