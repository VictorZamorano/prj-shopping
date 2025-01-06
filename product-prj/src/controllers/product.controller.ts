import {Request, Response} from 'express';
import { ProductModel } from "../models/product.model";
import { validateProduct } from '../utilities/validateRequest';
import { handleErrors } from '../utilities/handleErrors';

export class ProductController {

    static async generateProduct  (req: Request, res: Response) {
        const { product_name, price, img_url, quantity } = req.body;
        try {
            if (!product_name || !price || !img_url || !quantity!) {
                throw {code: '400'};
            }
            // FALTA IF PARA ROL ADMIN PARA GENERAR PRODUCTOS

           const newProduct = await ProductModel.createProduct(product_name, price, img_url, quantity);
           res.status(200).json({ message: 'Product created' , product: newProduct });
        } catch (error) {
            const {status, message } = handleErrors(error.code);
            res.status(status).json({ result: message });
        };
    };
    
    static async getAllProduct (req: Request, res: Response) {
        const { limit = 10, /* sort, */ page = 1 } = req.query;

        try {
            const products = await ProductModel.readAllProduct(limit, /* sort, */ page);
            // const result = orderedProduct.map(p => ({
            //     name: p.product_name,
            //     href: `http://localhost:3000/${p.id}`
            // }));
            res.status(200).json({products});
        } catch (error) {
            console.log("this is the: ", error)
            console.log("this is type: ", typeof error)
            // throw error
            const {status, message } = handleErrors(error.code);
            res.status(status).json({ result: message });
        };
    };
    
    static async getProduct (req: Request, res: Response) {
        const { id } = req.params;
        
        try {
            const product = await ProductModel.readProduct(id);
            //Validate the product exist
            validateProduct(product);
            res.json(product);
        } catch (error) {
            const {status, message } = handleErrors(error.code);
            res.status(status).json({ result: message });
        };
    };

    static async getCategory (req: Request, res: Response) {
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
                    throw { code: "400: This category does not exist"}
            };
            // const sortString = typeof sort === 'string' ? sort : 'sortDefaultValue';
            const orderedProduct = await ProductModel.readCategory(category, limit, sort, page);
            // const result = orderedProduct.map(p => ({
            //     name: p.product_name,
            //     href: `http://localhost:3000/${p.id}`
            // }));
            res.json(orderedProduct);
        } catch (error) {
            const {status, message } = handleErrors(error.code);
            res.status(status).json({ result: message }); 
        }
    };

    static async deleteProduct (req: Request, res: Response) {
        const { id } = req.params;
        try {
            const deletedProduct = await ProductModel.removeProduct(id);
            res.status(200).json({message: 'Product deleted', deletedProduct});
        } catch (error) {
            const {status, message } = handleErrors(error.code);
            res.status(status).json({ result: message });
        };
    };
    
    
    static async editProduct (req: Request, res: Response) {
        const { id } = req.params;
        const { param, newParam } = req.body;
        
        try {
            // Img validator extension
            const imageExtensions = /\.(jpeg|jpg|png|gif)$/i;

            if(!param){
                res.status(404).json({ error: '400: Field not select' });
            }

            if(typeof newParam === 'string' &&!newParam.trim()){
                throw {code: "400: New parameter is empty or invalid"};
            }

            if(param === 'img_url' && imageExtensions.test(newParam)){
                // UPDATE PRODUCT 
                const updateProduct = await ProductModel.updateProduct('product', param, newParam, id);
                res.status(200).json({message: 'The product image has been updated', updateProduct});
            } else if (param === 'quantity') {
                // UPDATE INVENTORY
                const updateProduct = await ProductModel.updateProduct('inventory', param, newParam, id);
                res.status(200).json({ message: `The product quantity has been updated`, updateProduct });
            } else {
                // UPDATE PRODUCT 
                const validParams = ['product_name', 'price'];
                if(!validParams.includes(param)){
                    throw {code: '400: New parameter is empty or invalid'};
                }
                const updateProduct = await ProductModel.updateProduct('product', param, newParam, id);
                res.status(200).json({ message: `The product ${param.replace('_', '')} has been updated`, updateProduct });
            }

        } catch (error) {
            const {status, message } = handleErrors(error.code);
            res.status(status).json({ result: message });
        };
    };
};

export default ProductController;
// module.exports = ProductController;

// export const productController = {
//     generateProduct,
//     getAllProduct,
//     getProduct,
//     deleteProduct,
//     editProduct
// };