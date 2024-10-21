//v2
// config.ts
import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

type Config = {
  env: string;
  port: number;
  mongodbUrl: string;
  cognito: {
    userPoolId: string;
    clientId: string;
    clientSecret: string;
    region: string;
    domain: string; //new
  };
  clientUrl: string;
  redirect: string; //new
};

function loadConfig(): Config {
  const env = process.env.NODE_ENV || "development";
  const envPath = path.resolve(__dirname, `./configs/.env.${env}`);
  dotenv.config({ path: envPath });

  const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required(),
    COGNITO_USER_POOL_ID: Joi.string().required(),
    COGNITO_CLIENT_ID: Joi.string().required(),
    COGNITO_REGION: Joi.string().required(),
    COGNITO_CLIENT_SECRET: Joi.string().required(),
    COGNITO_DOMAIN: Joi.string().required(), //new
  })
    .unknown()
    .required();

  const { value: envVars, error } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  return {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongodbUrl: envVars.MONGODB_URL,
    clientUrl: "http://localhost:3000",
    redirect: "http://localhost:3000/auth/google/callback", //new
    cognito: {
      userPoolId: envVars.COGNITO_USER_POOL_ID,
      clientId: envVars.COGNITO_CLIENT_ID,
      clientSecret: envVars.COGNITO_CLIENT_SECRET,
      region: envVars.COGNITO_REGION,
      domain: envVars.COGNITO_DOMAIN, //new
    },
  };
}

const configs = loadConfig();
export default configs;
