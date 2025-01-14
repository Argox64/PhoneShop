import { AllowNull, Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Order } from "./Order";
import { Roles, UserType, VALIDATION_EMAIL_ERROR, VALIDATION_NOT_EMPTY_ERROR, VALIDATION_NOT_NULL_ERROR } from "common-types";
import { IModel } from "@app/utils/IModels";

@Table
export class User extends Model implements IModel<UserType> {
    public static TABLE_VAR: string = "users";
    public static UUID_VAR: string = "uuid";
    public static EMAIL_VAR: string = "email";
    public static PASSWORD_VAR: string = "password";
    public static ROLE_VAR: string = "role";
    public static FIRST_NAME_VAR: string = "firstName";
    public static LAST_NAME_VAR: string = "lastName";
    public static ADDRESS_VAR: string = "address"; 

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    uuid !: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100),
        unique: true,
        validate: {
            isEmail: {
                msg: VALIDATION_EMAIL_ERROR.key
            }
        }
    })
    email !: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        validate: {
            notEmpty: {
                msg: VALIDATION_NOT_EMPTY_ERROR.key
            },
            notNull: {
                msg : VALIDATION_NOT_NULL_ERROR.key
            }
        }
    })
    password !: string;

    @AllowNull(false)
    @Column({
        defaultValue: Roles.Customer,
        type: DataType.ENUM(...Object.values(Roles)),
        validate : {
            notNull: {
                msg: VALIDATION_NOT_NULL_ERROR.key
            }
        }
    })
    role !: Roles;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        validate: {
            notEmpty: {
                msg: VALIDATION_NOT_EMPTY_ERROR.key
            },
            notNull: {
                msg : VALIDATION_NOT_NULL_ERROR.key
            }
        }
    })
    firstName !: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        validate: {
            notEmpty: {
                msg: VALIDATION_NOT_EMPTY_ERROR.key
            },
            notNull: {
                msg : VALIDATION_NOT_NULL_ERROR.key
            }
        }
    })
    lastName !: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
        validate: {
            notEmpty: {
                msg: VALIDATION_NOT_EMPTY_ERROR.key
            },
            notNull: {
                msg : VALIDATION_NOT_NULL_ERROR.key
            },
            isValidAddress(value: string) {
                const addressPattern = /^[a-zA-Z0-9\s,'-]*$/; 
                if (!addressPattern.test(value)) {
                    throw new Error("Invalid address format"); //TODO Replace by better verification
                }
            }
        }
    })
    address!: string;

    @HasMany(() => Order)
    orderDetails!: Order[]

    get fullname(): string {
        return `${this.firstName} ${this.lastName}`;
      }

    ToType(): UserType {
        return {
            uuid: this.uuid,
            email: this.email,
            password: this.password,
            role: this.role,
            firstName: this.firstName,
            lastName: this.lastName,
            address: this.address, 
            orderDetails: this.orderDetails?.map(order => order.ToType()),
            fullName: this.fullname
        }
    }
}