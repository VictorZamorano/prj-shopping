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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const handleErrors_1 = require("../utilities/handleErrors");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    static getAllUser(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield user_model_1.UserModel.readAlluser();
                res.status(200).json({ message: 'Users existing', result: result });
            }
            catch (error) {
                const { status, message } = (0, handleErrors_1.handleErrors)(error.code);
                res.status(status).json({ result: message });
            }
            ;
        });
    }
    ;
    static getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_acc } = req.params;
            try {
                const result = yield user_model_1.UserModel.readUser(user_acc);
                res.status(200).json({ message: 'User exist', result: result });
            }
            catch (error) {
                const { status, message } = (0, handleErrors_1.handleErrors)(error.code);
                res.status(status).json({ result: message });
            }
            ;
        });
    }
    ;
    static generateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_acc, password, name, first_name, second_name } = req.body;
            try {
                if (!user_acc || !password || !name || !first_name || !second_name) {
                    throw { code: '400' };
                }
                ;
                if (password.length < 8) {
                    throw { code: '400: Error pass length' };
                }
                ;
                const hashPass = yield bcrypt_1.default.hash(password, 10);
                const newAccountData = {
                    user_acc,
                    hashPass,
                    name,
                    first_name,
                    second_name
                };
                const newUserAcc = yield user_model_1.UserModel.createUser(newAccountData);
                res.status(200).json({ message: 'User created successfully', user_acc: newUserAcc });
            }
            catch (error) {
                const { status, message } = (0, handleErrors_1.handleErrors)(error.code);
                res.status(status).json({ result: message });
            }
            ;
        });
    }
    ;
    static loginTokenGen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_acc, password } = req.body;
            try {
                if (!user_acc || !password) {
                    throw { code: '401: Account or password empty' };
                }
                ;
                const loginUser = yield user_model_1.UserModel.readUser(user_acc);
                const verifyPass = yield bcrypt_1.default.compare(password, loginUser.password);
                if (!verifyPass) {
                    throw { code: '401: Account or password incorrect' };
                }
                ;
                const token = jsonwebtoken_1.default.sign({ id: loginUser.id, user_acc, password }, process.env.JWT_PRIVATE_KEY, 
                // this two opt work in TS
                // process.env.JWT_PRIVATE_KEY, as string,
                { expiresIn: "1h" });
                res.status(200).json({ message: 'Login successfully', user_acc: token });
            }
            catch (error) {
                const { status, message } = (0, handleErrors_1.handleErrors)(error.code);
                res.status(status).json({ result: message });
            }
        });
    }
    ;
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { param, newParam } = req.body;
            try {
                if (!param) {
                    throw { code: "400: Field not select" };
                }
                if (!newParam.trim()) {
                    throw { code: "400: New parameter is empty or invalid" };
                }
                if (param === 'password') {
                    if (newParam.length < 8) {
                        throw { code: '400: Error pass length' };
                    }
                    ;
                    const hashPass = yield bcrypt_1.default.hash(newParam, 10);
                    const editUserAccount = yield user_model_1.UserModel.modifyUserAccount(param, hashPass, id);
                    res.status(200).json({ message: 'Your password has been updated', editUserAccount });
                }
                else {
                    const validParams = ['name', 'first_name', 'second_name', 'address', 'region', 'city', 'commune', 'zip_code'];
                    if (!validParams.includes(param)) {
                        throw { code: '400: New parameter is empty or invalid' };
                    }
                    const editUserData = yield user_model_1.UserModel.modifyUserData(param, newParam, id);
                    res.status(200).json({ message: `Your ${param.replace('_', '')} has been updated`, editUserData });
                }
            }
            catch (error) {
                const { status, message } = (0, handleErrors_1.handleErrors)(error.code);
                res.status(status).json({ result: message });
            }
        });
    }
}
exports.UserController = UserController;
;
