import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      _audience: process.env.COGNITO_APP_CLIENT_ID,
      issuer: process.env.COGNITO_APP_URL_AUTHORITY,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri:
          process.env.COGNITO_APP_URL_AUTHORITY + '/.well-known/jwks.json',
      }),
    });
  }

  async validate(payload: any): Promise<any> {
    return {
      username: payload.username,
      groups: payload['cognito:groups'] || [],
      attributes: payload,
    };
  }
}
