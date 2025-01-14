import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from './Product';
import { IModel } from '@app/utils/IModels';
import { SalesAggregatesType } from 'common-types';

@Table
export class SalesAggregates extends Model implements IModel<SalesAggregatesType> {
  public static TABLE_VAR: string = "salesaggregates";
  public static PRODUCT_ID_VAR: string = "productId";
  public static TOTAL_SALES_VAR: string = "totalSales";

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  productId!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  totalSales!: number;

  @BelongsTo(() => Product)
  product!: Product;

  ToType(): SalesAggregatesType {
    return {
      productId: this.productId,
      totalSales: this.totalSales,
      product: this.product?.ToType(),
    }
  }
}