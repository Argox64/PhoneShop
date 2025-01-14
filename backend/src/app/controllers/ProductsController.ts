import express, { NextFunction } from "express";
import { IController } from "./IController";
import { ProductService as ProductsService } from "@services/ProductsService";
import { auth } from "@app/middlewares/authMiddleware";
import { checkRole } from "@app/middlewares/rbac";
import { convertStrToEnumProductSort, ProductFilter, ProductSort, Roles } from "common-types";

export class ProductsController implements IController {
    public path: string = "/products";
    public router = express.Router();
    private productsService = new ProductsService();

    constructor() {
        this.initializeRoutes();
    }
    
    private initializeRoutes() {
        this.router.get(`${this.path}/`, this.getAllProducts);
        this.router.get(`${this.path}/:id`, this.getProduct);
        this.router.put(`${this.path}/:id`, auth, checkRole([Roles.Admin]), this.putProduct);
        this.router.post(`${this.path}/`, auth, checkRole([Roles.Admin]), this.postProduct)
    }

    private getAllProducts = async(req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            // Extraction des paramètres de la query plutôt que du body
            const { limit, offset, nameFilter, priceMin, priceMax, sortBy, sortDesc } = req.query;

            // Conversion des paramètres string en types appropriés
            const limitNumber = limit ? parseInt(limit as string, 10) : undefined;
            const offsetNumber = offset ? parseInt(offset as string, 10) : undefined;
            let filterObject = {} as ProductFilter;

            filterObject.nameFilter = nameFilter ? nameFilter as string : undefined;
            filterObject.priceMin = priceMin ? parseFloat(priceMin as string) : undefined;
            filterObject.priceMax = priceMax ? parseFloat(priceMax as string) : undefined;

            let sortObject = {} as ProductSort;
            
            sortObject.by = sortBy ? convertStrToEnumProductSort(sortBy as string) : undefined;
            sortObject.desc = sortDesc ? sortDesc as string === 'true' : undefined;

            const result = await this.productsService.getAllProducts(limitNumber, offsetNumber, filterObject, sortObject);
            return res.status(200).json(result);
        } catch(err) {
            next(err);
        }
    }

    private getProduct = async(req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const id = parseFloat(req.params.id);

            const result = await this.productsService.getProduct(id);

            return res.status(200).json(result);
        } catch(err) {
            next(err);
        }
    }

    private putProduct = async(req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const id = parseFloat(req.params.id);
            const { name, description, price, imageUrl } = req.body;

            const result = await this.productsService.addOrUpdateProduct(id, name, description, price, imageUrl);

            return res.status(200).json(result);
        } catch(err) {
            next(err);
        }
    }

    private postProduct = async(req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const { name, description, price, imageUrl } = req.body;
            const result = await this.productsService.addProduct(name, description, price, imageUrl);

            return res.status(201).json(result);
        } catch(err) {
            next(err);
        }
    }
}