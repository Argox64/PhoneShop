import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull, Unique, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Order } from './Order';
import { IModel } from '@app/utils/IModels';
import { PaymentType } from 'common-types';

@Table({
  timestamps: true,
})
export class Payment extends Model implements IModel<PaymentType> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  paymentIntentId!: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  amount!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  currency!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  status!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  description!: string;

  @ForeignKey(() => Order)
  @Column(DataType.INTEGER)
  orderId!: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  paymentMethodId!: string;

  @BelongsTo(() => Order)
  order!: Order;

  ToType(): PaymentType {
    return {
      id: this.id,
      paymentIntentId: this.paymentIntentId,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      description: this.description,
      orderId: this.orderId,
      paymentMethodId: this.paymentMethodId,
      order: this.order?.ToType()
    };
  }
}

export default Payment;