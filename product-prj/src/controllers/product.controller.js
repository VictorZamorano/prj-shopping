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
exports.ProductController = void 0;
const product_model_1 = require("../models/product.model");
const validateRequest_1 = require("../utilities/validateRequest");
const handleErrors_1 = require("../utilities/handleErrors");
class ProductController {
    static generateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { product_name, price, img_url, quantity } = req.body;
            try {
                if (!product_name || !price || !img_url || !quantity) {
                    throw { code: '400' };
                }
                // FALTA IF PARA ROL ADMIN PARA GENERAR PRODUCTOS
                const newProduct = yield product_model_1.ProductModel.createProduct(product_name, price, img_url, quantity);
                res.status(200).json({ message: 'Product created', product: newProduct });
            }
            catch (error) {
                const { status, message } = (0, handleErrors_1.handleErrors)(error.code);
                res.status(status).json({ result: message });
            }
            ;
        });
    }
    ;
    static getAllProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit = 10, /* sort, */ page = 1 } = req.query;
            try {
                const products = yield product_model_1.ProductModel.readAllProduct(limit, /* sort, */ page);
                // const result = orderedProduct.map(p => ({
                //     name: p.product_name,
                //     href: `http://localhost:3000/${p.id}`
                // }));
                res.status(200).json({ products });
            }
            catch (error) {
                console.log("this is the: ", error);
                console.log("this is type: ", typeof error);
                // throw error
                const { status, message } = (0, handleErrors_1.handleErrors)(error.code);
                res.status(status).json({ result: message });
            }
            ;
        });
    }
    ;
    static getProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const product = yield product_model_1.ProductModel.readProduct(id);
                //Validate the product exist
                (0, validateRequest_1.validateProduct)(product);
                res.json(product);
            }
            catch (error) {
                const { status, message } = (0, handleErrors_1.handleErrors)(error.code);
                res.status(status).json({ result: message });
            }
            ;
        });
    }
    ;
    static getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit = 10, sort, page = 1 } = req.query;
            let { category } = req.params;
            try {
                switch (category) {
                    case 'ropa':
                        category = "1";
                        break;
                    case 'calzado':
                        category = "2";
                        break;
                    case 'accesorios':
                        category = "3";
                        break;
                    case 'otros':
                        category = "4";
                        break;
                    default:
                        throw { code: "404" };
                }
                ;
                // const sortString = typeof sort === 'string' ? sort : 'sortDefaultValue';
                const orderedProduct = yield product_model_1.ProductModel.readCategory(category, limit, sort, page);
                // const result = orderedProduct.map(p => ({
                //     name: p.product_name,
                //     href: `http://localhost:3000/${p.id}`
                // }));
                res.json(orderedProduct);
            }
            catch (error) {
                const { status, message } = (0, handleErrors_1.handleErrors)(error.code);
                res.status(status).json({ result: message });
            }
        });
    }
    ;
    static deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const deletedProduct = yield product_model_1.ProductModel.removeProduct(id);
                res.status(200).json({ message: 'Product deleted', deletedProduct });
            }
            catch (error) {
                const { status, message } = (0, handleErrors_1.handleErrors)(error.code);
                res.status(status).json({ result: message });
            }
            ;
        });
    }
    ;
    static editProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { param, newParam } = req.body;
            try {
                // Img validator extension
                const imageExtensions = /\.(jpeg|jpg|png|gif)$/i;
                if (!param) {
                    res.status(404).json({ error: '400: Field not select' });
                }
                if (typeof newParam === 'string' && !newParam.trim()) {
                    throw { code: "400: New parameter is empty or invalid" };
                }
                if (param === 'img_url' && imageExtensions.test(newParam)) {
                    // UPDATE PRODUCT 
                    const updateProduct = yield product_model_1.ProductModel.updateProduct('product', param, newParam, id);
                    res.status(200).json({ message: 'The product image has been updated', updateProduct });
                }
                else if (param === 'quantity') {
                    // UPDATE INVENTORY
                    const updateProduct = yield product_model_1.ProductModel.updateProduct('inventory', param, newParam, id);
                    res.status(200).json({ message: `The product quantity has been updated`, updateProduct });
                }
                else {
                    // UPDATE PRODUCT 
                    const validParams = ['product_name', 'price'];
                    if (!validParams.includes(param)) {
                        throw { code: '400: New parameter is empty or invalid' };
                    }
                    const updateProduct = yield product_model_1.ProductModel.updateProduct('product', param, newParam, id);
                    res.status(200).json({ message: `The product ${param.replace('_', '')} has been updated`, updateProduct });
                }
            }
            catch (error) {
                console.log("errorerrorerrorerrorerror", error);
                throw error;
                // const {status, message } = handleErrors(error.code);
                // res.status(status).json({ result: message });
            }
            ;
        });
    }
    ;
}
exports.ProductController = ProductController;
;
exports.default = ProductController;
// module.exports = ProductController;
// export const productController = {
//     generateProduct,
//     getAllProduct,
//     getProduct,
//     deleteProduct,
//     editProduct
// };
