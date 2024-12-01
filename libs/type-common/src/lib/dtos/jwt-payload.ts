export interface JwtPayload {
  sub: string;
  authorities: Array<string>;
  iss: string;
  exp: number;
  id: number;
}
