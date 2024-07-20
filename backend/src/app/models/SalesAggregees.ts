import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from './Product';
import { IModel } from '../utils/IModels';
import { SalesAggregeesType } from 'common-types';

@Table
export class SalesAggregees extends Model implements IModel<SalesAggregeesType> {
  public static TABLE_VAR: string = "salesaggregees";
  public static PRODUCT_ID_VAR: string = "product_id";
  public static TOTAL_NB_SALES_VAR: string = "total_nb_sales";

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  product_id!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  total_nb_sales!: number;

  @BelongsTo(() => Product)
  product!: Product;

  ToType(): SalesAggregeesType {
    return {
      product_id: this.product_id,
      total_nb_sales: this.total_nb_sales,
      product: this.product?.ToType(),
    }
  }
}