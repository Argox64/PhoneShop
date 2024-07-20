import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { isNullOrEmpty } from "./extensions/stringExtensions";
import { Roles, SessionUser } from "common-types";

interface Payload {
    userUID: string,
    email: string,
    role: Roles
}

class Authentication {
    public static async passwordHash(password: string) : Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public static async passwordCompare(text: string, encryptedText: string): Promise<boolean> {
        if(isNullOrEmpty(text))
            return false;
        return await bcrypt.compare(text, encryptedText);
    } 

    public static generateToken(userUID: string, email:string, role: Roles) : string {
        const secretKey: string = process.env.JWT_SECRET_KEY || "VERY_SECRET_KEY"
        const payload: Payload = {userUID: userUID, email: email, role: role}
        const options = {expiresIn: process.env.JWT_EXPIRES_IN || "24h"}

        return jwt.sign(payload, secretKey, options)
    }

    public static async validateToken(token: string): Promise<SessionUser> {
        const secretKey: string = process.env.JWT_SECRET_KEY || "VERY_SECRET_KEY";
        return await jwt.verify(token, secretKey) as SessionUser
    }

    
    public static async getTokenExpiration(token: string): Promise<Date> {
        const decodedToken = jwt.decode(token) as { exp?: number };
        if (decodedToken && decodedToken.exp) {
            return new Date(decodedToken.exp * 1000);
        }
        else {
            throw new Error("Invalid token");
        }
    }
}

export default Authentication;