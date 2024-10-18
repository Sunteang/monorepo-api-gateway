import {
  createAuthRequest,
  verifyAuthRequest,
  signInAuthRequest,
} from "../controllers/types/auth/auth-request.type";
import { AuthResponse } from "./types/auth/auth-response.type";
import {
  UserResponse,
  UsersResponse,
} from "../controllers/types/user/user-response.type";
import AuthService from "../services/auth.service";
import { AuthRepository } from "../database/repositories/auth.repository";
import { UserAttributesResponse } from "./types/user/user-response.type";
import { sendResponse } from "../utils/sendResponse";
import setCookie from "../utils/cookie";
import {
  Controller,
  Tags,
  Route,
  Post,
  Get,
  Body,
  Path,
  Query,
  Request,
} from "tsoa";
import express from "express";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  private authRepository: AuthRepository;

  constructor() {
    super();
    this.authRepository = new AuthRepository();
  }

  @Post("/register")
  public async register(
    @Body() createAuthRequest: createAuthRequest
  ): Promise<AuthResponse> {
    try {
      await AuthService.register(createAuthRequest);
      return {
        message: "User registered successfully!",
        data: {
          email: createAuthRequest.email,
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `AuthController - register() method error: ${error.message}`
        );
        this.setStatus(error.message === "User already exists" ? 409 : 500);
        throw new Error("User registration failed. " + error.message);
      } else {
        console.error(
          "AuthController - register() method encountered an unknown error"
        );
        this.setStatus(500);
        throw new Error("User registration failed due to an unknown error.");
      }
    }
  }

  @Post("/verify")
  public async verify(
    @Body() requestBody: verifyAuthRequest
  ): Promise<AuthResponse> {
    try {
      await AuthService.verify(requestBody);
      return {
        message: "User verified successfully!",
        data: null,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `AuthController - verify() method error: ${error.message}`
        );
        throw error;
      } else {
        console.error(
          "AuthController - verify() method encountered an unknown error"
        );
        throw new Error("Verification failed due to an unknown error.");
      }
    }
  }

  @Post("/signin")
  public async signIn(
    @Body() requestBody: signInAuthRequest
  ): Promise<AuthResponse> {
    try {
      const result = await AuthService.signIn(requestBody);
      return {
        message: "User signed in successfully!",
        data: {
          email: result.data.email,
          AccessToken: result.data.accessToken,
          RefreshToken: result.data.RefreshToken,
          IdToken: result.data.IdToken,
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `AuthController - signIn() method error: ${error.message}`
        );
        throw error;
      } else {
        console.error(
          "AuthController - signIn() method encountered an unknown error"
        );
        throw new Error("Sign-in failed due to an unknown error.");
      }
    }
  }

  @Get("/google/login")
  public loginWithGoogle() {
    const cognitoOAuthURL = AuthService.loginWithGoogle();
    return sendResponse({
      message: "Login with Google initiated.",
      data: cognitoOAuthURL,
    });
  }

  @Get("/google/callback")
  public async cognitoCallback(@Request() request: express.Request) {
    try {
      const code = request.query.code as string;
      const state = request.query.state as string;

      if (!code) {
        console.error("AuthController - cognitoCallback(): No code provided.");
        return sendResponse({
          status: 400,
          message: "No authorization code provided.",
          data: null,
        });
      }

      const response = (request as any).res as express.Response;
      const tokens = await AuthService.handleCallback(code, state);

      // Set cookies
      setCookie(response, "id_token", tokens.id_token);
      setCookie(response, "access_token", tokens.access_token);
      setCookie(response, "refresh_token", tokens.refresh_token);

      return sendResponse({
        status: 200,
        message: "Authentication successful.",
        data: null,
      });
    } catch (error: unknown) {
      console.error(
        "AuthController - cognitoCallback(): Authentication failed",
        error
      );
      return sendResponse({
        status: 500,
        message: "Authentication failed.",
        data: null,
      });
    }
  }

  @Get("/user/{email}/attributes")
  public async getUserAttributes(
    @Path() email: string
  ): Promise<UserAttributesResponse> {
    try {
      const attributes = await this.authRepository.getUserAttributes(email);
      return {
        message: "User attributes retrieved successfully!",
        data: { attributes },
      };
    } catch (error: unknown) {
      console.error(
        `AuthController - getUserAttributes() method error: ${error}`
      );
      throw error;
    }
  }

  @Get("/user/{email}")
  public async getUserByEmail(@Path() email: string): Promise<UserResponse> {
    try {
      const user = await this.authRepository.getUserByEmail(email);
      if (user) {
        return {
          message: "User retrieved successfully!",
          data: user,
        };
      } else {
        this.setStatus(404);
        return {
          message: "User not found.",
          data: null,
        };
      }
    } catch (error: unknown) {
      console.error(`AuthController - getUserByEmail() method error: ${error}`);
      throw error;
    }
  }

  @Get("/users")
  public async getAllUsers(
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<UsersResponse> {
    try {
      const result = await this.authRepository.getAllUsers(page, limit);
      return {
        message: "Users retrieved successfully!",
        data: result,
      };
    } catch (error: unknown) {
      console.error(`AuthController - getAllUsers() method error: ${error}`);
      throw error;
    }
  }
}

export default new AuthController();
