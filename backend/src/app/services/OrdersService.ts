import { FindOptions, Op, Transaction, WhereOptions } from "sequelize";
import { Order } from "../models/Order";
import { OrderDetail } from "../models/OrderDetail";
import { Product } from "../models/Product";
import sequelize from "../db";
import { BadRequestError, FORBIDDEN_ERROR, ForbiddenError, INVALID_FIELD_ERROR, NewOrderDetail, NOT_FOUND_RESSOURCE_ERROR, OrderStatus, OrderType } from "common-types";
import { User } from "../models/User";

export class OrdersService {
    public getOrdersByUserUUID = async(userId: string, limit:number = 100, offset: number = 0): Promise<OrderType[]> => {
        let options : FindOptions = { 
            limit: limit, 
            offset : offset, 
            include: [{
                model: OrderDetail,
                include: [Product]
            }]
        };
        let whereOptions : WhereOptions = { userId: { [Op.eq] : userId } };

        options.where = whereOptions;

        const orders = await Order.findAll(options);

        return orders.map(a => a.ToType());
    }

    public getOrder = async(userId: string, orderId: number, includeProducts: boolean = false): Promise<OrderType> => {
        let options : FindOptions = { };

        options.include = [{
            model: OrderDetail,
            include: includeProducts ? [{ model: Product }] : []
        }];

        let whereOptions : WhereOptions = { id: { [Op.eq] : orderId } };
        options.where = whereOptions;

        const order = await Order.findOne(options);
        if(!order) {
            throw new BadRequestError(NOT_FOUND_RESSOURCE_ERROR, {});
        } 
        else if(order.userId != userId) {
            throw new ForbiddenError(FORBIDDEN_ERROR, {})
        }

        return order.ToType();
    }

    public addOrder = async (userUID: string, orderDetails: NewOrderDetail[], totalPrice: number): Promise<Order> => {
        const transaction = await sequelize().transaction();
        try {
            const order = await Order.create({
                userId: userUID,
                totalPrice
            }, { transaction });

            if (orderDetails && orderDetails.length > 0) {
                var completeOrderDetails = orderDetails.map((od) => {
                    return {
                        orderId: order.id,
                        ...od
                    }
                });
                await OrderDetail.bulkCreate(completeOrderDetails, { individualHooks: true, transaction });
            }
            else {
                throw new BadRequestError(INVALID_FIELD_ERROR, { fieldName: "orderDetails" });
            }

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}