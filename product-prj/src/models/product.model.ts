import { pool } from "../db/connection";
import format from "pg-format";
import { validateAllProduct } from "../utilities/validateRequest";

type Combinable = string | number;

export class ProductModel {

    static async createProduct (product_name: string, price: number, img_url: string, quantity: number) {

        const addNewProduct = "INSERT INTO product (product_name, price, img_url) VALUES ($1, $2, $3) RETURNING *";
        const stockNewProduct = "INSERT INTO inventory (product_id, quantity) VALUES ($1, $2)"; 
        const selectNewProduct = "SELECT product.id, product.product_name, product.price, product.img_url, inventory.quantity FROM product INNER JOIN inventory ON product.id = inventory.product_id WHERE inventory.product_id = $1;";
        try {
            const insertedProduct = await pool.query(addNewProduct, [product_name, price, img_url]);
            const id = insertedProduct.rows[0].id;

            // Inserting stock of product in inventory
            await pool.query(stockNewProduct, [ id,  quantity]);

            // Selecting all of data we need for identity the new product we are generating
            const { rows } = await pool.query(selectNewProduct, [ id ]);
            return rows;
        } catch (error) {
            throw error;
        }
    };
    
    static async readAllProduct(limit: unknown, /* sort: unknown, */ page: unknown): Promise<any[]> {
        let query = "SELECT id, product_name, price, img_url FROM product ORDER BY RANDOM()";
        const queryProps = [];
        try {
            // If you need sort all products you can uncomment this section and add sort to the other functions
            // if(sort){
            //     // ARREGLAR ERROR TOO FEW ARGUMENTS!
            //     query += " ORDER BY id %s";
            //     queryProps.push(sort);
            // };
            if(limit){
                query += " LIMIT %s";
                queryProps.push(limit);
            };
            if(page && limit){
                query += " OFFSET %s";
                queryProps.push((Number(page) - 1)* Number(limit));
            };

            const formattedQuery = format(query,...queryProps)
            const { rows } = await pool.query(formattedQuery);

            validateAllProduct(rows);
            return rows;
        } catch (error) {
            throw error;
        }
    
    };

    static async readCategory(category: string, limit: unknown, sort: unknown, page: unknown)  {
        let query = "SELECT product.product_name, product.price, product.img_url, product_category.product_id, product_category.category_id, category.category_name, category.id FROM product_category INNER JOIN product ON product_category.product_id = product.id INNER JOIN category ON product_category.category_id = category.id WHERE category.id = $1";
        const queryProps = [];

        try {
            if(sort){
                query += " ORDER BY %s %s";
                queryProps.push(category, sort);
            };
            if(limit){
                query += " LIMIT %s";
                queryProps.push(limit);
            };
            if(page && limit){
                query += " OFFSET %s";
                queryProps.push((Number(page) - 1)* Number(limit));
            };
            const formattedQuery = format(query, ...queryProps);
            const { rows } = await pool.query(formattedQuery, [category])
            if(rows.length === 0) throw {code: "400"};
            return rows
        }
         catch (error) {
            throw error
        };
    };
    
    static async readProduct(id: string) {
        const selectQuery = "SELECT product.id, product.product_name, product.price, product.img_url, inventory.quantity FROM product INNER JOIN inventory ON product.id = inventory.product_id WHERE inventory.product_id = $1;";
        try {
            const { rows } = await pool.query(selectQuery, [id]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
    
    static async removeProduct (id: string) {
        const deleteQuery = "DELETE FROM product WHERE id = $1 RETURNING *";
        try {
            const { rows } = await pool.query(deleteQuery, [id]);
            if(rows.length === 0) throw {code: "400: Not exist"};

            return rows;
        } catch (error) {
            throw error;
        }
    };
    
    static async updateProduct ( table: string, param: Combinable, newParam: Combinable, id: string,) { 
        try {
        const updateQuery = "UPDATE %I SET %I = $1 WHERE id = $2 RETURNING *";
        
        const formattedQuery = format(updateQuery, table, param);
            const { rows } = await pool.query(formattedQuery, [newParam, id]);
            return rows[0];
        } catch (error) {
            throw error
        }
    };
}

export default ProductModel;

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