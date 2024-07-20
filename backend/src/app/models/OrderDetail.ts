import { AfterCreate, AfterUpdate, AllowNull, AutoIncrement, BeforeUpdate, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Order } from "./Order";
import { IModel } from "../utils/IModels";
import { OrderDetailType, VALIDATION_NOT_NULL_ERROR } from "common-types";
import { Product } from "./Product";
import { SalesAggregees } from "./SalesAggregees";

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
    static async UpdateTotalSales(orderDetail: OrderDetail) {
        const [sale, created] = await SalesAggregees.findOrCreate({
            where: { product_id: orderDetail.productId }
          });
        
        sale.total_nb_sales += orderDetail.quantity;
        await sale.save();
    }

    @AfterUpdate
    static async UpdateTotalSalesAfterUpdate(orderDetail: OrderDetail) {
        const oldQuantite = orderDetail.previous('quantite') as number;
        const newQuantite = orderDetail.quantity;
        
        if (oldQuantite !== newQuantite) {
            const sale = await SalesAggregees.findOne({
            where: { product_id: orderDetail.productId },
            });
        
            if (sale) {
                sale.total_nb_sales = sale.total_nb_sales - oldQuantite + newQuantite;
                await sale.save();
            }
        }
    }


    ToType(): OrderDetailType {
        return {
            id: this.id,
            orderId: this.orderId,
            quantity: this.quantity,
            order: this.order?.ToType(),
            product: this.product.ToType()
        }
    }
}