import { Request, Response } from 'express';
import { handleErrors } from '../utilities/handleErrors';
import { UserModel } from '../models/user.model';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {

    static async getAllUser (_req: Request, res: Response) {
        try {
             const result = await UserModel.readAlluser();
             res.status(200).json({ message: 'Users existing' , result: result });
        } catch (error) {
            const {status, message } = handleErrors(error.code);
            res.status(status).json({ result: message });
        };
    };

    static async getUser (req: Request, res: Response) {
        const { user_acc } = req.params;

        try {
             const result = await UserModel.readUser(user_acc);
             res.status(200).json({ message: 'User exist' , result: result });
        } catch (error) {
            const {status, message } = handleErrors(error.code);
            res.status(status).json({ result: message });
        };
    };

    static async generateUser (req: Request, res: Response) {
        const {user_acc, password, name, first_name, second_name } = req.body;

        try {
            if(!user_acc || !password || !name || !first_name || !second_name){
                throw { code: '400' };
            };
            if(password.length < 8){
                throw { code: '400: Error pass length'}
            };
            const hashPass = await bcrypt.hash(password, 10);
            const newAccountData = {
                user_acc,
                hashPass,
                name,
                first_name,
                second_name
            };
            const newUserAcc = await UserModel.createUser(newAccountData);
            res.status(200).json({ message: 'User created successfully' , user_acc: newUserAcc });
        } catch (error) {
            const {status, message } = handleErrors(error.code);
            res.status(status).json({ result: message });
        };

    };

    static async loginTokenGen (req: Request, res: Response) {
        const { user_acc, password } = req.body;
        try {
            if(!user_acc || !password){
                throw {code: '401: Account or password empty'}
            };
            const loginUser = await UserModel.readUser(user_acc);
            const verifyPass = await bcrypt.compare(password, loginUser.password);
            if(!verifyPass) {
                throw { code: '401: Account or password incorrect'}
            };
            const token = jwt.sign(
                {id: loginUser.id, user_acc,password},
                process.env.JWT_PRIVATE_KEY!,
                // this two opt work in TS
                // process.env.JWT_PRIVATE_KEY, as string,
                {expiresIn: "1h"},
            );
            res.status(200).json({ message: 'Login successfully' , user_acc: token });
        } catch (error) {
            const {status, message } = handleErrors(error.code);
            res.status(status).json({ result: message });
        }
    };

    static async updateUser (req: Request, res: Response) {
        const { id } = req.params;
        const { param, newParam } = req.body;
        try {
            if(!param){
                throw {code: "400: Field not select"};
            }
            if(!newParam.trim()){
                throw {code: "400: New parameter is empty or invalid"};
            }
            
            if(param === 'password'){
                if(newParam.length < 8){
                    throw { code: '400: Error pass length'}
                };
                const hashPass = await bcrypt.hash(newParam, 10);
                const editUserAccount = await UserModel.modifyUserAccount(param, hashPass, id);
                res.status(200).json({ message: 'Your password has been updated' , editUserAccount });
            } else {
                const validParams = ['name', 'first_name', 'second_name', 'address', 'region', 'city', 'commune', 'zip_code'];
                if(!validParams.includes(param)){
                    throw {code: '400: New parameter is empty or invalid'};
                }
                const editUserData = await UserModel.modifyUserData(param, newParam, id);
                res.status(200).json({ message: `Your ${param.replace('_', '')} has been updated`, editUserData });
            }

        } catch (error) {
            const {status, message } = handleErrors(error.code);
            res.status(status).json({ result: message });            
        }
    }
};