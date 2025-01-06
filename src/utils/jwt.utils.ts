import { UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as jwtkToPem from 'jwk-to-pem';

export interface IJwtKey {
  alg: string;
  e: string;
  kid: string;
  kty: 'RSA';
  n: string;
  use: string;
}

export interface IJwksResponse {
  data: {
    keys: IJwtKey[];
  };
}

export const getJwtKeys = async () => {
  const jwksEndpoint = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
  const { data } = (await axios.get(jwksEndpoint)) as IJwksResponse;
  const keys = new Map();
  data.keys.map((key) => {
    keys.set(key.kid, key);
  });

  return keys;
};

export const decodeJwt = (accessToken: string) => {
  const jwtPayload = jwt.decode(accessToken, { complete: true });

  if (!jwtPayload) {
    throw new UnauthorizedException();
  }

  return jwtPayload;
};

export const convertJwkToPem = (key: IJwtKey) => {
  const pem = jwtkToPem(key);
  return pem;
};

export const verifyJwtToken = (accessToken: string, pem: string) => {
  const result = jwt.verify(accessToken, pem) as jwt.JwtPayload;

  return result.sub;
};
