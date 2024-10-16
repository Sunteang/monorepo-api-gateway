import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

type Config = {
  NODE_ENV: string;
  PORT: number;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT: string;
  COGNITO_DOMAIN: string;
};

function loadConfig(): Config {
  const NODE_ENV = process.env.NODE_ENV || "development";
  const envPath = path.resolve(__dirname, `./configs/.env.${NODE_ENV}`);
  dotenv.config({ path: envPath });

  const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().required(),
    PORT: Joi.number().required(),
    CLIENT_ID: Joi.string().required(),
    CLIENT_SECRET: Joi.string().required(),
    REDIRECT: Joi.string().required(),
    COGNITO_DOMAIN: Joi.string().required(),
  })
    .unknown()
    .required();
  const { value: envVars, error } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    NODE_ENV: envVars.NODE_ENV,
    PORT: envVars.PORT,
    CLIENT_ID: envVars.CLIENT_ID,
    CLIENT_SECRET: envVars.CLIENT_SECRET,
    REDIRECT: envVars.REDIRECT,
    COGNITO_DOMAIN: envVars.COGNITO_DOMAIN,
  };
}
const config = loadConfig();
export default config;
