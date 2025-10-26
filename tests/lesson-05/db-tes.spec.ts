import { expect, test } from '@playwright/test';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

test('API testing - Create/update category and product and verify in database', async ({ request }) => {

    // Create new category via API
    const categoryName = "My category name LA 7"
    const categoryDescription = "My category description"
    const createCategoryResponse = await request.post('https://betterbytesvn.com/pwa101/category/create.php', {
        data: JSON.stringify({
            name: categoryName,
            description: categoryDescription
        })
    });
    const createCategoryJsonBody = await createCategoryResponse.json();
    const createdCategoryId = createCategoryJsonBody.category.id;
    console.log(`Category created with ID: ${createdCategoryId}`);
    expect(createdCategoryId).toBeTruthy(); // Make sure that the created category ID exists

    // Create new product via API
    const productName = "LA product name"
    const productDescription = "My product description"
    const productPrice = "1000"
    const productQuantity = "50"
    // const productCategoryId = createdCategoryId

    const createProductResponse = await request.post('https://betterbytesvn.com/pwa101/product/create.php', {
        data: JSON.stringify({
            name: productName,
            description: productDescription,
            price: productPrice,
            quantity: productQuantity,
            category_id: createdCategoryId,
            is_active: true
        })
    });
    const createProductJsonBody = await createProductResponse.json();
    const createdProductId = createProductJsonBody.product.id;
    console.log(`Category created with ID: ${createdProductId}`);
    expect(createdProductId).toBeTruthy(); // Make sure that the created product ID exists

    // Update the product via API
    const updatedProductName = "PWA102 product"
    const updatedProductPrice = "3000"

    const updateProductResponse = await request.put('https://betterbytesvn.com/pwa101/product/update.php', {
        data: JSON.stringify({
            id: createdProductId,
            name: updatedProductName,
            description: productDescription,
            price: updatedProductPrice,
            quantity: productQuantity,
            category_id: createdCategoryId,
            is_active: true
        })
    });
    const updateProductJsonBody = await updateProductResponse.json();
    expect(updateProductJsonBody.product.name).toEqual(updatedProductName);
    expect(Number(updateProductJsonBody.product.price)).toBe(Number(updatedProductPrice));


    // Connect and verify in database
    const db = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });

    await db.initialize(); // Open database connection
    console.log('Connected to database successfully!');

    const result = await db.query('SELECT * FROM product WHERE id = ?', [createdProductId]);
    const updatedProductFromDB = result[0];

    console.log('Data from DB:', updatedProductFromDB);
    expect(updatedProductFromDB.name).toEqual(updatedProductName); // Verify the updated name
    expect(Number(updatedProductFromDB.price)).toBe(Number(updatedProductPrice)); // Verify the updated price


    // Teardown: Delete the created category and product via API

    // Delete product 
    const deleteProductResponse = await request.delete(`https://betterbytesvn.com/pwa101/product/delete.php?id=${createdProductId}`);
    expect(deleteProductResponse.status()).toBe(200);
    console.log(`Category with ID: ${createdProductId} deleted.`);

    // Delete category 
    const deleteCategoryResponse = await request.delete(`https://betterbytesvn.com/pwa101/category/delete.php?id=${createdCategoryId}`);
    expect(deleteCategoryResponse.status()).toBe(200);
    console.log(`Category with ID: ${createdCategoryId} deleted.`);

    // Database connection teardown
    await db.destroy();
    console.log('Database connection closed.');
});