import { AfterCreate, AfterUpdate, AllowNull, AutoIncrement, BeforeUpdate, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Order } from "./Order";
import { IModel } from "../utils/IModels";
import { OrderDetailType, VALIDATION_NOT_NULL_ERROR } from "common-types";
import { Product } from "./Product";
import { SalesAggregates } from "./SalesAggregates";

@Table
export class OrderDetail extends Model implements IModel<OrderDetailType> {
    public static TABLE_VAR: string = "orderDetail";
    public static ID_VAR: string = "id";
    public static QUANTITY_VAR: string = "quantity";

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @ForeignKey(() => Order)
    @Column({
        type: DataType.INTEGER,
        validate : {
            notNull: {
                msg: VALIDATION_NOT_NULL_ERROR.key
            }
        }
    })
    orderId!: number;

    @AllowNull(false)
    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        validate : {
            notNull: {
                msg: VALIDATION_NOT_NULL_ERROR.key
            }
        }
    })
    productId!: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        validate : {
            notNull: {
                msg: VALIDATION_NOT_NULL_ERROR.key
            }
        }
    })
    quantity!: number;

    @BelongsTo(() => Order)
    order!: Order;

    @BelongsTo(() => Product)
    product!: Product;

    //Hooks
    @AfterCreate
    static async UpdateTotalSales(orderDetail: OrderDetail, options: any) {
        const [sale, created] = await SalesAggregates.findOrCreate({
            where: { [SalesAggregates.PRODUCT_ID_VAR]: orderDetail.productId }
          });
        
        sale.totalSales += orderDetail.quantity;
        await sale.save({transaction: options.transaction});
    }

    @AfterUpdate
    static async UpdateTotalSalesAfterUpdate(orderDetail: OrderDetail, options: any) {
        const oldQuantite = orderDetail.previous('quantite') as number;
        const newQuantite = orderDetail.quantity;
        
        if (oldQuantite !== newQuantite) {
            const sale = await SalesAggregates.findOne({
                where: { [SalesAggregates.PRODUCT_ID_VAR]: orderDetail.productId },
            });
        
            if (sale) {
                sale.totalSales = sale.totalSales - oldQuantite + newQuantite;
                await sale.save({transaction: options.transaction});
            }
        }
    }


    ToType(): OrderDetailType {
        return {
            id: this.id,
            orderId: this.orderId,
            quantity: this.quantity,
            order: this.order?.ToType(),
            product: this.product?.ToType()
        }
    }
}