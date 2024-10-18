import {
  createAuthRequest,
  verifyAuthRequest,
  signInAuthRequest,
} from "../controllers/types/auth/auth-request.type";
import { AuthSessionResponse } from "../controllers/types/auth/auth-response.type";
import AuthRepository from "../database/repositories/auth.repository";
import axios from "axios";
import crypto from "crypto";

export class AuthService {
  private awsCognitoDomain = process.env.COGNITO_DOMAIN!;
  private awsCognitoClientId = process.env.COGNITO_CLIENT_ID!;
  private awsRedirectUri = process.env.COGNITO_REDIRECT_URI!;
  private awsCognitoClientSecret = process.env.COGNITO_CLIENT_SECRET!;

  public generateState(): string {
    return crypto.randomBytes(16).toString("hex");
  }

  public loginWithGoogle(): string {
    const stateValue = this.generateState();

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.awsCognitoClientId,
      redirect_uri: this.awsRedirectUri,
      identity_provider: "Google",
      scope: "profile email openid",
      state: stateValue,
      prompt: "select_account",
    });

    return `${this.awsCognitoDomain}/oauth2/authorize?${params.toString()}`;
  }

  public async handleCallback(code: string, state?: string): Promise<any> {
    const tokenUrl = `${this.awsCognitoDomain}/oauth2/token`;
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: this.awsCognitoClientId,
      redirect_uri: this.awsRedirectUri,
      code: code,
    });

    if (state) {
      params.append("state", state);
    }

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${this.awsCognitoClientId}:${this.awsCognitoClientSecret}`
      ).toString("base64")}`,
    };

    try {
      const response = await axios.post(tokenUrl, params.toString(), {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(
        "AuthService - handleCallback(): Failed to get tokens from Cognito",
        error
      );
      throw error;
    }
  }

  public async getAllUsers(page: number = 1, limit: number = 10) {
    try {
      return await AuthRepository.getAllUsers(page, limit);
    } catch (error: unknown) {
      console.error(`AuthService - getAllUsers() method error: ${error}`);
      throw error;
    }
  }

  public async getUserByEmail(email: string) {
    try {
      const user = await AuthRepository.getUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error: unknown) {
      console.error(`AuthService - getUserByEmail() method error: ${error}`);
      throw error;
    }
  }

  public async register(createAuthRequest: createAuthRequest): Promise<void> {
    try {
      await AuthRepository.register(createAuthRequest);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "UsernameExistsException") {
          throw new Error("User already exists");
        }
        console.error(
          `AuthService - register() method error: ${error.message}`
        );
        throw error;
      } else {
        console.error(
          "AuthService - register() method encountered an unknown error"
        );
        throw new Error("User registration failed due to an unknown error.");
      }
    }
  }

  public async verify(verifyRequest: verifyAuthRequest): Promise<void> {
    try {
      await AuthRepository.verify(verifyRequest);
    } catch (error: unknown) {
      console.error(`AuthService - verify() method error: ${error}`);
      throw error;
    }
  }

  private async storeUserInDatabase(email: string): Promise<void> {
    try {
      const userAttributes = await AuthRepository.getUserAttributes(email);
      const cognitoId = userAttributes.find(
        (attr) => attr.Name === "sub"
      )?.Value;

      if (!cognitoId) {
        throw new Error("Cognito ID not found");
      }

      await AuthRepository.storeUser(email, cognitoId);
    } catch (error) {
      console.error("AuthService - storeUserInDatabase() method error:", error);
      throw error;
    }
  }

  public async signIn(
    signInRequest: signInAuthRequest
  ): Promise<AuthSessionResponse> {
    try {
      const authResult = await AuthRepository.signIn(signInRequest);
      await this.storeUserInDatabase(signInRequest.email);

      return {
        message: "User signed in successfully!",
        data: {
          email: signInRequest.email,
          accessToken: authResult.AccessToken,
          RefreshToken: authResult.RefreshToken,
          IdToken: authResult.IdToken,
        },
      };
    } catch (error: unknown) {
      console.error(`AuthService - signIn() method error: ${error}`);
      throw error;
    }
  }
}

export default new AuthService();
