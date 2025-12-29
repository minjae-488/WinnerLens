import { AuthUtil } from './auth';

export const verifyToken = (token: string) => {
    return AuthUtil.verifyToken(token);
};

export const generateToken = (payload: any) => {
    return AuthUtil.generateToken(payload);
};
