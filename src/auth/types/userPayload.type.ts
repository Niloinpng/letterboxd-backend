export class UserPayload {
  id: string; //ID do usuário;
  username: string;
  iat?: number; //iat (issued at) = Timestamp de quando o token foi criado;
  exp?: number; //exp (expiration) = Timestamp de quando o token irá expirar;
}
