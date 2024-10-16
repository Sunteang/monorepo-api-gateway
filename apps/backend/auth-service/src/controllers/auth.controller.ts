import { loginWithGoogle } from "@/services/login-google.service";
import { Controller, Route, Get, Tags } from "tsoa";

@Route("/auth")
export class AuthController extends Controller {
  constructor() {
    super();
  }
  @Get("/link")
  @Tags("google link")
  public async getLink(): Promise<string> {
    try {
      return loginWithGoogle();
    } catch (error) {
      throw error;
    }
  }
}
