import { AfterCreate, AfterUpdate, AllowNull, AutoIncrement, BeforeCreate, BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { OrderDetail } from "./OrderDetail";
import { User } from "./User";
import { OrderStatus, OrderType, VALIDATION_NOT_NULL_ERROR } from "common-types";
import { IModel } from "../utils/IModels";
import {Payment} from "./Payment";
import { SalesAggregates } from "./SalesAggregates";

@Table
export class Order extends Model implements IModel<OrderType>{
    public static TABLE_VAR: string = "orders";
    public static ID_VAR: string = "id";
    public static USER_ID_VAR: string = "userId";
    public static STATUS_VAR: string = "status";
    public static TOTAL_PRICE_VAR: string = "totalPrice"
    public static CREATED_AT: string = "createdAt"
    public static UPDATE_STATUS_AT: string = "updatedStatusAt"

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({
        type : DataType.UUID,
        validate : {
            notNull: {
                msg: VALIDATION_NOT_NULL_ERROR.key
            }
        }
    })
    userId!: string;

    @AllowNull(false)
    @Column({
        type: DataType.ENUM(...Object.values(OrderStatus)),
        validate : {
            notNull: {
                msg: VALIDATION_NOT_NULL_ERROR.key
            }
        },
        defaultValue: OrderStatus.WaitingForPaiement
    })
    status!: OrderStatus;

    @AllowNull(false)
    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
        validate : {
            notNull: {
                msg: VALIDATION_NOT_NULL_ERROR.key
            }
        }
    })
    createdAt!: Date;

    @AllowNull(false)
    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
        validate : {
            notNull: {
                msg: VALIDATION_NOT_NULL_ERROR.key
            }
        }
    })
    updatedStatusAt!: Date;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(10, 2),
        validate : {
            notNull: {
                msg: VALIDATION_NOT_NULL_ERROR.key
            }
        },
        get(): number {
            const value = this.getDataValue(Order.TOTAL_PRICE_VAR);
            return value ? parseFloat(value) : 0;
        }
    })
    totalPrice!: number;
  
    @BelongsTo(() => User)
    user!: User;
    
    @HasMany(() => OrderDetail)
    orderDetails!: OrderDetail[]

    @HasMany(() => Payment)
    payments!: Payment[]
    
    @AfterUpdate
    static async UpdateStatusDate(order: Order, options: any) {
        if(order.previous(Order.STATUS_VAR) !== order.status) {
            order.updatedStatusAt = new Date(Date.now())
            await order.save({hooks: false, transaction: options.transaction })
        }
    }

    ToType(): OrderType {
        return {
            id: this.id,
            userId: this.userId,
            status: this.status,
            createdAt: this.createdAt,
            updatedStatusAt : this.updatedStatusAt,
            totalPrice: this.totalPrice,
            user: this.user?.ToType(),
            orderDetails: this.orderDetails?.map(od => od.ToType())
        }
    }
}