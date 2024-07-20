import { ProductType, VALIDATION_EMAIL_ERROR, VALIDATION_NOT_NULL_ERROR } from "common-types";
import { AllowNull, AutoIncrement, Column, DataType, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IModel } from "../utils/IModels";
import { OrderDetail } from "./OrderDetail";
import { SalesAggregates } from "./SalesAggregates";

@Table
export class Product extends Model implements IModel<ProductType> {
  public static TABLE_VAR: string = "products";
  public static ID_VAR: string = "id";
  public static NAME_VAR: string = "name";
  public static DESCRIPTION_VAR: string = "description";
  public static PRICE_VAR: string = "price";

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(200),
    validate: { 
      notEmpty: {
        msg: VALIDATION_EMAIL_ERROR.key
      },
      notNull: {
        msg: VALIDATION_NOT_NULL_ERROR.key
      }
    }
  })
  name!: string;
  
  @Column(DataType.TEXT)
  description!: string | null;

  @AllowNull(false)
  @Column({
    type: DataType.DOUBLE(10, 2),
    validate: {
      notNull: {
        msg: VALIDATION_NOT_NULL_ERROR.key
      }
    }
  })
  price!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(2048),
    validate: {
      notNull: {
        msg: VALIDATION_NOT_NULL_ERROR.key
      }
    }
  })
  imageUrl!: string;

  @HasMany(() => OrderDetail)
  orderDetails!: OrderDetail[]

  @HasOne(() => SalesAggregates)
  salesAggregates!: SalesAggregates;

  ToType(): ProductType {
    {
      return {
        id: this.id,
        name: this.name,
        description: this.description,
        price: this.price,
        imageUrl: this.imageUrl,
        orderDetails: this.orderDetails?.map(oe => oe.ToType()),
        salesAggregates: this.salesAggregates?.ToType()
      }
    }
  }
}