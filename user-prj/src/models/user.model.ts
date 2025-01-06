import { pool } from "../db/connection";
import format from "pg-format";

interface UserAcc {
    user_acc: string ;
    hashPass: string;
    name: string;
    first_name: string;
    second_name: string;
};

export class UserModel {

    static async readAlluser (){
            const selectAllUser = "SELECT id, user_acc, password, name, first_name, second_name, created_at FROM user_account";
    
            try {
                const { rows } = await pool.query(selectAllUser);
                if(rows.length === 0){
                    throw {code: '500'}
                }
                return rows;
            } catch (error) {
                throw error
            };
    };

    static async readUser (user_acc: string/* , password?: string */){
            const selectAllUser = "SELECT id, user_acc, password, name, first_name, second_name, created_at FROM user_account WHERE user_acc = $1";
            try {
                const { rows } = await pool.query(selectAllUser, [user_acc]);
                console.log(rows[0]);
                if(!rows[0]){
                    throw {code: '404'}
                };
                return rows[0];
            } catch (error) {
                throw error
            };
    };

    static async createUser (UserAcc: UserAcc){
        const newUser = "INSERT INTO user_account (user_acc, password, role) VALUES ($1, $2, 'user') RETURNING *";
        const insertDataUser = "INSERT INTO user_data (user_account_id, name, first_name, second_name) VALUES ($1, $2, $3, $4) RETURNING *";
        const selectUserData = "SELECT user_account.id, user_data.user_account_id ,user_account.user_acc, user_account.password, user_account.role, user_data.name, user_data.first_name, user_data.second_name FROM user_account INNER JOIN user_data ON user_account.id = user_data.user_account_id WHERE user_account.id = $1"

        try {
            const userAccount = await pool.query(newUser, [UserAcc.user_acc, UserAcc.hashPass]);

            const userDataAccount = await pool.query(insertDataUser, [userAccount.rows[0].id, UserAcc.name, UserAcc.first_name, UserAcc.second_name]);
            
            const showUserData = await pool.query(selectUserData, [userDataAccount.rows[0].id]);

            return showUserData.rows[0];
        } catch (error) {
            throw error
        }
    };

    static async modifyUserAccount (param: string, newParam: string, id: string) {
        const modifyQueryUserAccount = "UPDATE user_account SET %I = $1 WHERE id = $2 RETURNING *";
        try {
            const formattedQuery = format(modifyQueryUserAccount, param);
            const { rows } = await pool.query(formattedQuery, [newParam, id]);
            return rows[0];
        } catch (error) {
            
        }
    };

    static async modifyUserData (param: string, newParam: string, id: string) {
        const modifyQueryUserData = "UPDATE user_data SET %I = $1 WHERE user_account_id = $2 RETURNING *";
        try {
            const formattedQuery = format(modifyQueryUserData, param);
            const { rows } = await pool.query(formattedQuery, [newParam, id]);

            return rows[0];
        } catch (error) {
            
        }
    };
}