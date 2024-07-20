import { FindAndCountOptions, FindOptions, Op, WhereOptions } from "sequelize";
import { Product } from "../models/Product";
import { BadRequestError, INVALID_FIELD_ERROR, INVALID_PRICE_RANGE_ERROR, NOT_FOUND_RESSOURCE_ERROR, NotFoundError, ProductFilter, ProductSort, ProductSortEnum, ProductsSearchData, ProductType } from "common-types";
import { SalesAggregees } from "../models/SalesAggregees";

export class ProductService {
    public getAllProducts = async (limit: number = 100, offset: number = 0, filter?: ProductFilter, sort?: ProductSort) : Promise<ProductsSearchData> => {
        
        if(limit < 0) {
            throw new BadRequestError(INVALID_FIELD_ERROR, {fieldName: "limit"});
        } else if(limit > 100) {
            throw new BadRequestError(INVALID_FIELD_ERROR, {fieldName: "limit"});
        }

        if(offset < 0) {
            throw new BadRequestError(INVALID_FIELD_ERROR, {fieldName: "offset"});
        } else if(offset > 100) {
            throw new BadRequestError(INVALID_FIELD_ERROR, {fieldName: "offset"});
        }
    
        let options : FindAndCountOptions = { };
        let whereOptions : WhereOptions = { };
        if(filter) {
            filter.nameFilter ? whereOptions.name = { [Op.like]: `%${ filter.nameFilter }%` } : null;
    
            if(filter.priceMin && filter.priceMax) {
                if(filter.priceMin > filter.priceMax)
                    throw new BadRequestError(INVALID_PRICE_RANGE_ERROR, {fieldName1: 'priceMin', fieldName2: 'priceMax'})
                whereOptions.price = { [Op.between]: [filter.priceMin, filter.priceMax] }
            } else if(filter.priceMin) {
                whereOptions.price = { [Op.gte]: filter.priceMin }
            } else if(filter.priceMax) {
                whereOptions.price = { [Op.lte]: filter.priceMax }
            }
        }

        // Ajout de l'option de tri par nombre de ventes
        if(sort?.by === ProductSortEnum.Sales) {
            options.include = [{
                model: SalesAggregees,
                attributes: [SalesAggregees.TOTAL_NB_SALES_VAR]
            }];
            //options.order = [[SalesAggregees, SalesAggregees.TOTAL_NB_SALES_VAR, sort.desc ? 'DESC' : 'ASC']];
            options.order = [[{model : SalesAggregees, as: 'salesAggregees'}, SalesAggregees.TOTAL_NB_SALES_VAR, sort.desc ? 'DESC' : 'ASC']];
        }
    
        options.limit = limit;
        options.offset = offset;
    
        options.where = whereOptions;

        const {rows, count} = await Product.findAndCountAll(options);
        return { data: rows.map(a => a.ToType()), totalCount: count };
    }

    public getProduct = async(id: number): Promise<ProductType> => {
        let options : FindOptions = { };
        let whereOptions : WhereOptions = { id: { [Op.eq] : id } };

        options.where = whereOptions;

        const product = await Product.findOne(options);
        if(!product) 
            throw new NotFoundError(NOT_FOUND_RESSOURCE_ERROR, {});

        return product.ToType();
    }

    public addOrUpdateProduct = async(id: number, name: string, description: string | null = null, price: number, imageUrl: string): Promise<ProductType | null> => {
        let options : FindOptions = { }
        let whereOptions : WhereOptions = { id: { [Op.eq] : id} }
        options.where = whereOptions;

        let foundItem = await Product.findOne(options);
        if(!foundItem) {
            foundItem = await Product.create({
                name,
                description,
                price,
                imageUrl,
            });
        }
        else {
            foundItem.name = name;
            foundItem.description = description;
            foundItem.price = price;
            await foundItem.save();
        }

        return foundItem.ToType();
    }

    public addProduct = async(name: string, description: string | null = null, price: number, imageUrl: string): Promise<ProductType> => {
        return (await Product.create({
            name,
            description,
            price,
            imageUrl
        })).ToType();
    }
}