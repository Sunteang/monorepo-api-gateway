import config from "@/config";
import { randomBytes } from "crypto";
import { URLSearchParams } from "url";
export const loginWithGoogle = (): string => {
  const state = randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.cognito.clientId,
    redirect_uri: config.redirect,
    identity_provider: "Google",
    scope: "profile email openid",
    state: state,
    prompt: "select_account",
  });
  const cognitoOAuthURL = `${
    config.cognito.domain
  }/oauth2/authorize?${params.toString()}`;

  return cognitoOAuthURL;
};
