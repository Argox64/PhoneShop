import jwt from 'jsonwebtoken'; // Assurez-vous d'importer la bibliothèque jsonwebtoken
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { User } from '../models/User';
import Authentication from '../utils/Authentication';
import { convertStrToEnumRoles, rolePermissions, Roles, SessionUser, INVALID_FIELD_ERROR, UNAUTHORIZED_RESSOURCE_ERROR, FORBIDDEN_ERROR, UserType, UnauthorizedError, BadRequestError, ConflictError, ForbiddenError, TokenSessionUser, USER_ALREADY_EXISTS_ERROR } from 'common-types';

export class AuthenticationService {
    public static MIN_PASSWORD_LENGTH: number = 8;
    public static MAX_PASSWORD_LENGTH: number = 64;

    public login = async(email:string, password: string): Promise<TokenSessionUser> => {
        const user = await this._findByMail(email);

        if(!user) {
            throw new UnauthorizedError(UNAUTHORIZED_RESSOURCE_ERROR, {}); // invalid email
        }

        let compare = await Authentication.passwordCompare(password, user.password);

        const token = Authentication.generateToken(user.uuid, user.email, user.role)

        if(compare) {
            return {
                tokenType: {
                    type: "Bearer",
                    token: token,
                    expiresDate: await Authentication.getTokenExpiration(token)
                },
                userData: {
                    userUID: user.uuid,
                    email: user.email,
                    role: user.role
                }
            }
        }
        else {
            throw new UnauthorizedError(UNAUTHORIZED_RESSOURCE_ERROR, {}); // invalid password
        }
    }

    public register = async(
        email:string, 
        password:string, 
        firstName: string,
        lastName: string,
        address: string,
        creatingRole: Roles, 
        sessionRole: Roles | undefined
    ): Promise<Partial<UserType>> => {  

        if(password.length < AuthenticationService.MIN_PASSWORD_LENGTH)
            throw new BadRequestError(INVALID_FIELD_ERROR, { fieldName : "passsword" })
        if(password.length > AuthenticationService.MAX_PASSWORD_LENGTH)
            throw new BadRequestError(INVALID_FIELD_ERROR, { fieldName : "passsword" })
        
        if(!convertStrToEnumRoles(creatingRole))
            throw new BadRequestError(INVALID_FIELD_ERROR, { fieldName: "role"});
        if(sessionRole && !convertStrToEnumRoles(sessionRole))
            throw new Error("Session user role invalid.")
        
        if(await this.emailAlreadyRegister(email))
            throw new ConflictError(USER_ALREADY_EXISTS_ERROR, {value: email});
        
        if(!sessionRole && creatingRole !== Roles.Customer) 
            throw new ForbiddenError(FORBIDDEN_ERROR, {}); //Anonymous can only create Customer user
        else if(sessionRole && !rolePermissions[sessionRole].includes(creatingRole)) 
            throw new ForbiddenError(FORBIDDEN_ERROR, {}); // Not authorize to create use with this role

        const hashedPassword: string = await Authentication.passwordHash(password);

        const new_user = (await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            address,
            role: creatingRole
        })).ToType();

        const new_user_no_password = { hashedPassword, ...new_user}
        return new_user_no_password;
    }

    private _findByMail = async (email: string): Promise<UserType | undefined> => {
        let options : FindOptions = { }
        let whereOptions : WhereOptions = { }
        
        whereOptions.email = { [Op.eq] : email }
        options.where = whereOptions;
        return (await User.findOne(options))?.ToType();
    }

    public emailAlreadyRegister = async(email: string): Promise<boolean> => {
        let options : FindOptions = { }
        let whereOptions : WhereOptions = { }
        
        whereOptions.email = { [Op.eq] : email }
        options.where = whereOptions;
        return await User.count(options) > 0;
    }

    public countUserWithRole = async(role: Roles): Promise<number> => {
        let options : FindOptions = { }
        let whereOptions : WhereOptions = { }
        
        whereOptions.role = { [Op.eq] : role }
        options.where = whereOptions;
        return await User.count(options);
    }

    public verifyToken = async (token: string): Promise<SessionUser> => {
        try {
            const decodedToken = await Authentication.validateToken(token);
            if (!decodedToken) throw new UnauthorizedError(UNAUTHORIZED_RESSOURCE_ERROR, {}); //Error: Role missing
            return decodedToken as SessionUser;
        } catch(err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError(UNAUTHORIZED_RESSOURCE_ERROR, {}); // Error: Expired Token
            }
            throw new UnauthorizedError(UNAUTHORIZED_RESSOURCE_ERROR, {}); // Error: Broken Token
        }
    }
}