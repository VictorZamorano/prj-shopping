-- CREATE DATABASE shopping;
CREATE DATABASE myshop_product

-- \c shopping;

-- Drop tables
DROP TABLE IF EXISTS "product";
DROP TABLE IF EXISTS "category";
DROP TABLE IF EXISTS "product_category";
DROP TABLE IF EXISTS "inventory";

-- CREATE TABLES
CREATE TABLE "product" (
  "id" SERIAL PRIMARY KEY,
  "product_name" varchar(30),
  "price" int,
  "img_url" varchar(255),
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "category" (
  "id" SERIAL PRIMARY KEY,
  "category_name" varchar(30),
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "product_category" (
  "id" SERIAL PRIMARY KEY,
  "product_id" integer,
  "category_id" integer,
  FOREIGN KEY ("product_id") 
    REFERENCES "product" ("id") 
    ON DELETE CASCADE,
  FOREIGN KEY ("category_id") 
    REFERENCES "category" ("id") 
    ON DELETE CASCADE,
);

CREATE TABLE "inventory" (
  "id" SERIAL PRIMARY KEY,
  "product_id" integer,
  "quantity" int,
  "created_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "modify_at" timestamp DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY ("product_id") 
    REFERENCES "product" ("id") 
    ON DELETE CASCADE
);

-- INSERT CATEGORY
INSERT INTO category (category_name) VALUES
('ropa'),
('calzado'),
('accesorios'),
('otros');

-- INSERT PRODUCTS
INSERT INTO product (product_name, price, img_url) VALUES
('Camiseta blanca', 12990, 'https://example.com/camiseta_blanca.jpg'),
('Pantalón de mezclilla', 29990, 'https://example.com/pantalon_mezclilla.jpg'),
('Zapatillas deportivas', 35990, 'https://example.com/zapatillas_deportivas.jpg'),
('Gorra negra', 8990, 'https://example.com/gorra_negra.jpg'),
('Chaqueta de cuero', 54990, 'https://example.com/chaqueta_cuero.jpg'),
('Reloj de pulsera', 19990, 'https://example.com/reloj_pulsera.jpg'),
('Mochila escolar', 18990, 'https://example.com/mochila_escolar.jpg'),
('Gafas de sol', 14990, 'https://example.com/gafas_sol.jpg'),
('Bufanda de lana', 7990, 'https://example.com/bufanda_lana.jpg'),
('Botas de invierno', 44990, 'https://example.com/botas_invierno.jpg');

-- INSERT PRODUCT_CATEGORY
INSERT INTO product_category (product_id, category_id) VALUES
(1, 1),  -- Camiseta blanca - Ropa
(2, 1),  -- Pantalón de mezclilla - Ropa
(3, 2),  -- Zapatillas deportivas - Calzado
(4, 3),  -- Gorra negra - Accesorios
(5, 1),  -- Chaqueta de cuero - Ropa
(6, 3),  -- Reloj de pulsera - Accesorios
(7, 3),  -- Mochila escolar - Accesorios
(8, 3),  -- Gafas de sol - Accesorios
(9, 1),  -- Bufanda de lana - Ropa
(10, 2); -- Botas de invierno - Calzado

-- INSERT INVENTORY
INSERT INTO inventory (product_id, quantity) VALUES
(1, 40),
(2, 30),
(3, 60),
(4, 70),
(5, 10),
(6, 24),
(7, 52),
(8, 63),
(9, 73),
(10, 50);


-- SELECT * FROM product;
-- SELECT * FROM category;
-- SELECT * FROM product_category;
-- SELECT * FROM inventory;



-- FOR TESTING INSERTING INVENTORY SUB CONSULT
-- INSERT INTO inventory (product_id, quantity) VALUES
--     ((SELECT id FROM product WHERE p_name = 'Camiseta blanca'), 30),
--     ((SELECT id FROM product WHERE p_name = 'Pantalón de mezclilla'), 10),
--     ((SELECT id FROM product WHERE p_name = 'Zapatillas deportivas'), 40),
--     ((SELECT id FROM product WHERE p_name = 'Gorra negra'), 50),
--     ((SELECT id FROM product WHERE p_name = 'Chaqueta de cuero'), 23),
--     ((SELECT id FROM product WHERE p_name = 'Reloj de pulsera'), 15),
--     ((SELECT id FROM product WHERE p_name = 'Mochila escolar'), 234),
--     ((SELECT id FROM product WHERE p_name = 'Gafas de sol'), 12),
--     ((SELECT id FROM product WHERE p_name = 'Bufanda de lana'), 99),
--     ((SELECT id FROM product WHERE p_name = 'Botas de invierno'), 76);

INSERT INTO product (product_name, price, img_url) VALUES 
('Camisa gris', 15990, 'https://img.freepik.com/psd-gratis/camiseta-gris-sobre-fondo-transparente_125540-4324.jpg');

INSERT INTO inventory (product_id, quantity) VALUES 
(11, 100);

SELECT * FROM product;
SELECT * FROM inventory;