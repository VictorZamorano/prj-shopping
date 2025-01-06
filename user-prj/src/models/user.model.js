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
exports.UserModel = void 0;
const connection_1 = require("../db/connection");
const pg_format_1 = __importDefault(require("pg-format"));
;
class UserModel {
    static readAlluser() {
        return __awaiter(this, void 0, void 0, function* () {
            const selectAllUser = "SELECT id, user_acc, password, name, first_name, second_name, created_at FROM user_account";
            try {
                const { rows } = yield connection_1.pool.query(selectAllUser);
                if (rows.length === 0) {
                    throw { code: '500' };
                }
                return rows;
            }
            catch (error) {
                throw error;
            }
            ;
        });
    }
    ;
    static readUser(user_acc /* , password?: string */) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectAllUser = "SELECT id, user_acc, password, name, first_name, second_name, created_at FROM user_account WHERE user_acc = $1";
            try {
                const { rows } = yield connection_1.pool.query(selectAllUser, [user_acc]);
                console.log(rows[0]);
                if (!rows[0]) {
                    throw { code: '404' };
                }
                ;
                return rows[0];
            }
            catch (error) {
                throw error;
            }
            ;
        });
    }
    ;
    static createUser(UserAcc) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = "INSERT INTO user_account (user_acc, password, role) VALUES ($1, $2, 'user') RETURNING *";
            const insertDataUser = "INSERT INTO user_data (user_account_id, name, first_name, second_name) VALUES ($1, $2, $3, $4) RETURNING *";
            const selectUserData = "SELECT user_account.id, user_data.user_account_id ,user_account.user_acc, user_account.password, user_account.role, user_data.name, user_data.first_name, user_data.second_name FROM user_account INNER JOIN user_data ON user_account.id = user_data.user_account_id WHERE user_account.id = $1";
            try {
                const userAccount = yield connection_1.pool.query(newUser, [UserAcc.user_acc, UserAcc.hashPass]);
                const userDataAccount = yield connection_1.pool.query(insertDataUser, [userAccount.rows[0].id, UserAcc.name, UserAcc.first_name, UserAcc.second_name]);
                const showUserData = yield connection_1.pool.query(selectUserData, [userDataAccount.rows[0].id]);
                return showUserData.rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
    static modifyUserAccount(param, newParam, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const modifyQueryUserAccount = "UPDATE user_account SET %I = $1 WHERE id = $2 RETURNING *";
            try {
                const formattedQuery = (0, pg_format_1.default)(modifyQueryUserAccount, param);
                const { rows } = yield connection_1.pool.query(formattedQuery, [newParam, id]);
                return rows[0];
            }
            catch (error) {
            }
        });
    }
    ;
    static modifyUserData(param, newParam, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const modifyQueryUserData = "UPDATE user_data SET %I = $1 WHERE user_account_id = $2 RETURNING *";
            try {
                const formattedQuery = (0, pg_format_1.default)(modifyQueryUserData, param);
                const { rows } = yield connection_1.pool.query(formattedQuery, [newParam, id]);
                return rows[0];
            }
            catch (error) {
            }
        });
    }
    ;
}
exports.UserModel = UserModel;
