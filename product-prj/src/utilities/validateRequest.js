"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAllProduct = exports.validateProduct = void 0;
// Only validates one product
const validateProduct = (product) => {
    try {
        if (product.length === 0)
            throw { code: "404" };
    }
    catch (error) {
        throw error;
    }
};
exports.validateProduct = validateProduct;
// Validate all product
const validateAllProduct = (products) => {
    try {
        if (products.length === 0)
            throw { code: "500" };
    }
    catch (error) {
        throw error;
    }
};
exports.validateAllProduct = validateAllProduct;
