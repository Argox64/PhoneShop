import express from "express";
import { convertErrorToHttpResponse } from "../utils/errors";
import { IController } from "./IController";
import { ProductService as ProductsService } from "../services/ProductsService";
import { auth } from "../middlewares/authMiddleware";
import { checkRole } from "../middlewares/rbac";
import { BadRequestError, convertStrToEnumProductSort, INVALID_FIELD_ERROR, ProductFilter, ProductSort, REQUIRED_FIELD_ERROR, Roles } from "common-types";

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

    private getAllProducts = async(req: express.Request, res: express.Response) => {
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
            return convertErrorToHttpResponse(err as Error, req, res);
        }
    }

    private getProduct = async(req: express.Request, res: express.Response) => {
        try {
            const id = parseFloat(req.params.id);

            const result = await this.productsService.getProduct(id);

            return res.status(200).json(result);
        } catch(err) {
            return convertErrorToHttpResponse(err as Error, req, res);
        }
    }

    private putProduct = async(req: express.Request, res: express.Response) => {
        try {
            const id = parseFloat(req.params.id);
            const { name, description, price, imageUrl } = req.body;

            const result = await this.productsService.addOrUpdateProduct(id, name, description, price, imageUrl);

            return res.status(200).json(result);
        } catch(err) {
            return convertErrorToHttpResponse(err as Error, req, res);
        }
    }

    private postProduct = async(req: express.Request, res: express.Response) => {
        try {
            const { name, description, price, imageUrl } = req.body;
            const result = await this.productsService.addProduct(name, description, price, imageUrl);

            return res.status(201).json(result);
        } catch(err) {
            return convertErrorToHttpResponse(err as Error, req, res);
        }
    }
}