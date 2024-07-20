import { SessionUser } from './SessionUser';
import { TokenType } from './TokenType';

export type TokenSessionUser = {
    tokenType: TokenType,
    userData: SessionUser
}