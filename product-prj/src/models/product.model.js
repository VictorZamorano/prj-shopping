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
exports.ProductModel = void 0;
const connection_1 = require("../db/connection");
const pg_format_1 = __importDefault(require("pg-format"));
const validateRequest_1 = require("../utilities/validateRequest");
class ProductModel {
    static createProduct(product_name, price, img_url, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const addNewProduct = "INSERT INTO product (product_name, price, img_url) VALUES ($1, $2, $3) RETURNING *";
            const stockNewProduct = "INSERT INTO inventory (product_id, quantity) VALUES ($1, $2)";
            const selectNewProduct = "SELECT product.id, product.product_name, product.price, product.img_url, inventory.quantity FROM product INNER JOIN inventory ON product.id = inventory.product_id WHERE inventory.product_id = $1;";
            try {
                const insertedProduct = yield connection_1.pool.query(addNewProduct, [product_name, price, img_url]);
                const id = insertedProduct.rows[0].id;
                // Inserting stock of product in inventory
                yield connection_1.pool.query(stockNewProduct, [id, quantity]);
                // Selecting all of data we need for identity the new product we are generating
                const { rows } = yield connection_1.pool.query(selectNewProduct, [id]);
                return rows;
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
    static readAllProduct(limit, /* sort: unknown, */ page) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "SELECT id, product_name, price, img_url FROM product ORDER BY RANDOM()";
            const queryProps = [];
            try {
                // If you need sort all products you can uncomment this section and add sort to the other functions
                // if(sort){
                //     // ARREGLAR ERROR TOO FEW ARGUMENTS!
                //     query += " ORDER BY id %s";
                //     queryProps.push(sort);
                // };
                if (limit) {
                    query += " LIMIT %s";
                    queryProps.push(limit);
                }
                ;
                if (page && limit) {
                    query += " OFFSET %s";
                    queryProps.push((Number(page) - 1) * Number(limit));
                }
                ;
                const formattedQuery = (0, pg_format_1.default)(query, ...queryProps);
                const { rows } = yield connection_1.pool.query(formattedQuery);
                (0, validateRequest_1.validateAllProduct)(rows);
                return rows;
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
    static readCategory(category, limit, sort, page) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "SELECT product.product_name, product.price, product.img_url, product_category.product_id, product_category.category_id, category.category_name, category.id FROM product_category INNER JOIN product ON product_category.product_id = product.id INNER JOIN category ON product_category.category_id = category.id WHERE category.id = $1";
            const queryProps = [];
            try {
                if (sort) {
                    query += " ORDER BY %s %s";
                    queryProps.push(category, sort);
                }
                ;
                if (limit) {
                    query += " LIMIT %s";
                    queryProps.push(limit);
                }
                ;
                if (page && limit) {
                    query += " OFFSET %s";
                    queryProps.push((Number(page) - 1) * Number(limit));
                }
                ;
                const formattedQuery = (0, pg_format_1.default)(query, ...queryProps);
                const { rows } = yield connection_1.pool.query(formattedQuery, [category]);
                if (rows.length === 0)
                    throw { code: "400" };
                return rows;
            }
            catch (error) {
                throw error;
            }
            ;
        });
    }
    ;
    static readProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectQuery = "SELECT product.id, product.product_name, product.price, product.img_url, inventory.quantity FROM product INNER JOIN inventory ON product.id = inventory.product_id WHERE inventory.product_id = $1;";
            try {
                const { rows } = yield connection_1.pool.query(selectQuery, [id]);
                return rows;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static removeProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteQuery = "DELETE FROM product WHERE id = $1 RETURNING *";
            try {
                const { rows } = yield connection_1.pool.query(deleteQuery, [id]);
                if (rows.length === 0)
                    throw { code: "400: Not exist" };
                return rows;
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
    static updateProduct(table, param, newParam, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateQuery = "UPDATE %I SET %I = $1 WHERE id = $2 RETURNING *";
                const formattedQuery = (0, pg_format_1.default)(updateQuery, table, param);
                const { rows } = yield connection_1.pool.query(formattedQuery, [newParam, id]);
                return rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
}
exports.ProductModel = ProductModel;
exports.default = ProductModel;
// export const ProductModel = {
//     createProduct,
//     readAllProduct,
//     readProduct,
//     removeProduct,
//     updateProduct    
// }
// SELECT product.product_name, product.price, product.img_url, product_category.product_id, product_category.category_id,
// category.category_name, category.id
// FROM product_category 
// INNER JOIN product
// ON product_category.product_id = product.id
// INNER JOIN category
// ON product_category.category_id = category.id
// WHERE category.id = 1
