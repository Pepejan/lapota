import jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: string;
}

export const createAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};

export const createRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};

export const verifyAccessToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
    } catch (err) {
        throw new Error('Invalid access token');
    }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
    } catch (err) {
        throw new Error('Invalid refresh token');
    }
};

