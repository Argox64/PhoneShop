import { ProductService } from '../../app/services/ProductsService';
import { Product } from '../../app/models/Product';
import { BadRequestError, INVALID_FIELD_ERROR, INVALID_PRICE_RANGE_ERROR, NOT_FOUND_RESSOURCE_ERROR, NotFoundError, ProductFilter, ProductSortEnum, ProductsSearchData } from 'common-types';
import { FindAndCountOptions, FindOptions, GroupedCountResultItem, Op } from 'sequelize';
import { init } from '../../app/db';

describe('ProductService', () => {
  let productService: ProductService;

  beforeAll(async() => {
    await init();
    //await sequelize().sync({ force : true });
});

  beforeEach(() => {
    productService = new ProductService();
  });

  describe('getAllProducts', () => {
    it('should throw a BadRequestError if the limit is negative', async () => {
      // Arrange
      const limit = -10;
      const offset = 0;
      const filter: ProductFilter = {};
      const sort = undefined;

      // Act & Assert
      await expectAsync(productService.getAllProducts(limit, offset)).toBeRejectedWith(
        new BadRequestError(INVALID_FIELD_ERROR, { fieldName: 'limit' })
      );
    });

    it('should throw a BadRequestError if the limit is greater than 100', async () => {
      // Arrange
      const limit = 200;
      const offset = 0;
      const filter: ProductFilter = {};
      const sort = undefined;

      // Act & Assert
      await expectAsync(productService.getAllProducts(limit, offset)).toBeRejectedWith(
        new BadRequestError(INVALID_FIELD_ERROR, { fieldName: 'limit' })
      );
    });

    it('should throw a BadRequestError if the offset is negative', async () => {
      // Arrange
      const limit = 100;
      const offset = -10;
      const filter: ProductFilter = {};
      const sort = undefined;

      // Act & Assert
      await expectAsync(productService.getAllProducts(limit, offset)).toBeRejectedWith(
        new BadRequestError(INVALID_FIELD_ERROR, { fieldName: 'offset' })
      );
    });

    it('should throw a BadRequestError if the offset is greater than 100', async () => {
      // Arrange
      const limit = 100;
      const offset = 200;
      const filter: ProductFilter = {};
      const sort = undefined;

      // Act & Assert
      await expectAsync(productService.getAllProducts(limit, offset)).toBeRejectedWith(
        new BadRequestError(INVALID_FIELD_ERROR, { fieldName: 'offset' })
      );
    });

    // Add more test cases for different scenarios
  });

  describe('getProduct', () => {
    it('should return the product with the given id if it exists', async () => {
      // Arrange
      const id = 1;
      const expectedOptions: FindOptions = {
        where: { id: { [Op.eq]: id } },
      };
      const expectedProduct = new Product();
      spyOn(Product, 'findOne').and.returnValue(Promise.resolve(expectedProduct));

      // Act
      const result = await productService.getProduct(id);

      // Assert
      expect(result).toBe(expectedProduct);
      expect(Product.findOne).toHaveBeenCalledWith(expectedOptions);
    });

    it('should throw a NotFoundError if the product with the given id does not exist', async () => {
      // Arrange
      const id = 1;
      const expectedOptions: FindOptions = {
        where: { id: { [Op.eq]: id } },
      };
      spyOn(Product, 'findOne').and.returnValue(Promise.resolve(null));

      // Act & Assert
      await expectAsync(productService.getProduct(id)).toBeRejectedWith(
        new NotFoundError(NOT_FOUND_RESSOURCE_ERROR, {})
      );
      expect(Product.findOne).toHaveBeenCalledWith(expectedOptions);
    });

    // Add more test cases for different scenarios
  });

  describe('addOrUpdateProduct', () => {
    it('should create a new product if the product with the given id does not exist', async () => {
      // Arrange
      const id = 1;
      const name = 'Test Product';
      const description = 'Test Description';
      const price = 10.99;
      const imageUrl = 'test.jpg';
      const expectedOptions: FindOptions = {
        where: { id: { [Op.eq]: id } },
      };
      const expectedProduct = new Product();
      spyOn(Product, 'findOne').and.returnValue(Promise.resolve(null));
      spyOn(Product, 'create').and.returnValue(Promise.resolve(expectedProduct));

      // Act
      const result = await productService.addOrUpdateProduct(id, name, description, price, imageUrl);

      // Assert
      expect(result).toBe(expectedProduct);
      expect(Product.findOne).toHaveBeenCalledWith(expectedOptions);
      expect(Product.create).toHaveBeenCalledWith({
        name,
        description,
        price,
        imageUrl,
      });
    });

    it('should update the existing product if the product with the given id exists', async () => {
      // Arrange
      const id = 1;
      const name = 'Test Product';
      const description = 'Test Description';
      const price = 10.99;
      const imageUrl = 'test.jpg';
      const expectedOptions: FindOptions = {
        where: { id: { [Op.eq]: id } },
      };
      const expectedProduct = new Product();
      spyOn(Product, 'findOne').and.returnValue(Promise.resolve(expectedProduct));
      spyOn(expectedProduct, 'save').and.returnValue(Promise.resolve(expectedProduct));

      // Act
      const result = await productService.addOrUpdateProduct(id, name, description, price, imageUrl);

      // Assert
      expect(result).toBe(expectedProduct);
      expect(Product.findOne).toHaveBeenCalledWith(expectedOptions);
      expect(expectedProduct.name).toBe(name);
      expect(expectedProduct.description).toBe(description);
      expect(expectedProduct.price).toBe(price);
      expect(expectedProduct.save).toHaveBeenCalled();
    });

    // Add more test cases for different scenarios
  });

  describe('addProduct', () => {
    it('should create a new product with the given parameters', async () => {
      // Arrange
      const name = 'Test Product';
      const description = 'Test Description';
      const price = 10.99;
      const imageUrl = 'test.jpg';
      const expectedProduct = new Product();
      spyOn(Product, 'create').and.returnValue(Promise.resolve(expectedProduct));

      // Act
      const result = await productService.addProduct(name, description, price, imageUrl);

      // Assert
      expect(result).toBe(expectedProduct);
      expect(Product.create).toHaveBeenCalledWith({
        name,
        description,
        price,
        imageUrl,
      });
    });

    // Add more test cases for different scenarios
  });

  // Add more test cases for other methods
});