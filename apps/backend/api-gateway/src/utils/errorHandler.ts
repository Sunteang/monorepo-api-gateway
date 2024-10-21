// errors.ts
export class NotFoundError extends Error {
    statusCode: number;
  
    constructor(message: string = "Resource not found") {
      super(message);
      this.statusCode = 404;
      this.name = "NotFoundError";
    }
  }
  
  export class AuthenticationError extends Error {
    statusCode: number;
  
    constructor(message: string = "Authentication failed") {
      super(message);
      this.statusCode = 401;
      this.name = "AuthenticationError";
    }
  }
  
  export class AuthorizationError extends Error {
    statusCode: number;
  
    constructor(message: string = "User not authorized") {
      super(message);
      this.statusCode = 403;
      this.name = "AuthorizationError";
    }
  }
  