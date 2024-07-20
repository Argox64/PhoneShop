process.env.NODE_ENV = 'test';

import { BadRequestError, INVALID_FIELD_ERROR, NotFoundError } from "common-types";
import sequelize, { init } from "../../app/db";
import { up as productUp, down as productDown } from "../../app/seeders/products";
import { ProductService } from "../../app/services/ProductsService";

describe("--- Products services [getAllProducts]---", () => {
    beforeAll(async() => {
        await init();
        await sequelize().dropAllSchemas({}); // for reset indexations
        await sequelize().sync({ force : true });
        await productUp();
    });

    it("[getAllProducts]: Get all products", async () => {
        const products = await new ProductService().getAllProducts();
        expect(products.data.length).toBe(10);
    });

    it("[getAllProducts]: Get all products (with limit parameter)", async () => {
        const products = await new ProductService().getAllProducts(1);
        expect(products.data.length).toBe(1);
    }, 3000);

    it("[getAllProducts]: Get products (where price >= 700)", async () => {
        const products = await new ProductService().getAllProducts(100, 0, { priceMin: 700 });
        expect(products.data.length).toBe(8);
    }, 3000);

    it("[getAllProducts]: Get products (where price < 700)", async () => {
        const products = await new ProductService().getAllProducts(100, 0, { priceMax: 700 });
        expect(products.data.length).toBe(2);
    }, 3000);

    it("[getAllProducts]: Get products (where 900 >= price >= 700)", async () => {
        const products = await new ProductService().getAllProducts(100, 0, { priceMin: 700, priceMax: 900 });
        expect(products.data.length).toBe(4);
    }, 3000);

    it("[getAllProducts]: Get products (where name '%IPhone%')", async () => {
        const products = await new ProductService().getAllProducts(100, 0, { nameFilter: "IPhone" });
        expect(products.data.length).toBe(1);
    }, 3000);

    it("[getAllProducts]: Get products (where offset = 2)", async () => {
        const products = await new ProductService().getAllProducts(100, 2);
        expect(products.data.length).toBe(8);
    }, 3000);

    it("[getAllProducts]: Get products (where offset = 5)", async () => {
        const products = await new ProductService().getAllProducts(100, 5, {});
        expect(products.data.length).toBe(5);
    }, 3000);

    it("[getAllProducts]: Get products (where offset = 6)", async () => {
        const products = await new ProductService().getAllProducts(100, 6, {});
        expect(products.data.length).toBe(4);
    }, 3000);

    it("[getAllProducts]: Test error offset < 0", async () => {
        try {
            const products = await new ProductService().getAllProducts(100, -1, {});
        } catch(err) {
            if(err instanceof BadRequestError) {
                expect(err.errorId).toBe(INVALID_FIELD_ERROR.code);
                return;
            }
        }

        throw new Error("Test failed.");
    }, 3000);

    it("[getAllProducts]: Test error offset > 100", async () => {
        try {
            const products = await new ProductService().getAllProducts(100, 101, {});
        } catch(err) {
            if(err instanceof BadRequestError) {
                expect(err.errorId).toBe(INVALID_FIELD_ERROR.code);
                return;
            }
        }

        throw new Error("Test failed.");
    }, 3000);

    it("[getAllProducts]: Test error limit < 0", async () => {
        try {
            const products = await new ProductService().getAllProducts(-1, 0, {});
        } catch(err) {
            if(err instanceof BadRequestError) {
                expect(err.errorId).toBe(INVALID_FIELD_ERROR.code);
                return;
            }
        }

        throw new Error("Test failed.");
    }, 3000);

    it("[getAllProducts]: Test error limit < 100", async () => {
        //await productUp();
        try {
            const products = await new ProductService().getAllProducts(101, 0, {});
        } catch(err) {
            if(err instanceof BadRequestError) {
                expect(err.errorId).toBe(INVALID_FIELD_ERROR.code);
                return;
            }
        }

        throw new Error("Test failed.");
    }, 3000);

    // Close Connection after tests
    afterAll(async () => {
        await productDown();
        await sequelize().close();
    });

});

describe("--- Products services [addOrUpdateProduct]---", () => {
    beforeAll(async() => {
        await init();
    });

    beforeEach(async() => {
        await sequelize().dropAllSchemas({});
        await sequelize().sync({ force: true });
        await productUp();
    });

    it("[addOrUpdateProduct]: update product", async () => {
        const product = await new ProductService().addOrUpdateProduct(1, "test", "some description", 5.01, "image.png");
        if(!product) throw new Error("Product not found.");
        expect(product.id).toBe(1);
        expect(product.name).toBe("test");
        expect(product.description).toBe("some description");
        expect(product.price).toBe(5.01);
    }, 3000);

    it("[addOrUpdateProduct]: update product without description", async () => {
        const product = await new ProductService().addOrUpdateProduct(1, "test", undefined, 5.01, "image.png");
        if(!product) throw new Error("Product not found.");
        expect(product.id).toBe(1);
        expect(product.name).toBe("test");
        expect(product.description).toBe(null);
        expect(product.price).toBe(5.01);
    }, 3000);

    it("[addOrUpdateProduct]: update product with inexistant id", async () => {
        const product = await new ProductService().addOrUpdateProduct(15, "test", "desc", 5.01, "image.png");
        if(!product) throw new Error("Product not found.");
        expect(product.id).toBe(11);
        expect(product.name).toBe("test");
        expect(product.description).toBe("desc");
        expect(product.price).toBe(5.01);
    }, 3000);

    // Close Connection after tests
    afterAll(async () => {
        await sequelize().close();
      }); 
});

describe("--- Products services [getProduct]---", () => {
    beforeAll(async() => {
        await init();
        await sequelize().dropAllSchemas({});
        await sequelize().sync({ force : true });
        await productUp();
    });

    it("[getProduct]: get product", async () => {
        const product = await new ProductService().getProduct(1);
        expect(product.id).toBe(1);
        expect(product.name).toBe("iPhone 13 Pro");
        expect(product.description).toBe("Latest model with A15 Bionic chip and ProMotion display.");
        expect(product.price).toBe(999.99);
    }, 3000);

    it("[getProduct]: get product throw Not Found Error", async () => {
        try {
            const product = await new ProductService().getProduct(1000);
        } catch(err) {
            if(err instanceof NotFoundError) {
                expect(err.status).toBe(404);
                return;
            }
        }

        throw new Error("Test failed.")
    }, 3000);

    // Close Connection after tests
    afterAll(async () => {
        await productDown();
        await sequelize().close();
    });
});