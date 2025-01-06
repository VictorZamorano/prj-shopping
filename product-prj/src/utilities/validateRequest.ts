// Only validates one product
export const validateProduct = (product: Array<string>) => {
    try {
        if(product.length === 0) throw {code: "404"};     
    } catch (error) {
        throw error
    }

};

// Validate all product
export const validateAllProduct = (products: Array<string>) => {
    try {
        if(products.length === 0) throw {code: "500"};     
    } catch (error) {
        throw error
    }
};
