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
  MONGO_URL: string;
  AUTH_SERVICE_URL: string;
  PRODUCT_SERVICE_URL: string;
  USER_SERVICE_URL: string;
  JOB_SERVICE_URL: string;
  NOTIFICATION_SERVICE_URL: string;
  AWS_CLOUDWATCH_LOGS_REGION: string;
  AWS_CLOUDWATCH_LOGS_GROUP_NAME: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
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
    MONGO_URL: Joi.string().required(),
    AUTH_SERVICE_URL: Joi.string().required(),
    PRODUCT_SERVICE_URL: Joi.string().required(),
    USER_SERVICE_URL: Joi.string().required(),
    JOB_SERVICE_URL: Joi.string().required(),
    NOTIFICATION_SERVICE_URL: Joi.string().required(),
    AWS_CLOUDWATCH_LOGS_REGION: Joi.string().required(),
    AWS_CLOUDWATCH_LOGS_GROUP_NAME: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
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
    MONGO_URL: envVars.MONGO_URL,
    AUTH_SERVICE_URL: envVars.AUTH_SERVICE_URL,
    PRODUCT_SERVICE_URL: envVars.AUTH_SERVICE_URL,
    USER_SERVICE_URL: envVars.USER_SERVICE_URL,
    JOB_SERVICE_URL: envVars.JOB_SERVICE_URL,
    NOTIFICATION_SERVICE_URL: envVars.NOTIFICATION_SERVICE_URL,
    AWS_CLOUDWATCH_LOGS_REGION: envVars.AWS_CLOUDWATCH_LOGS_REGION,
    AWS_CLOUDWATCH_LOGS_GROUP_NAME: envVars.AWS_CLOUDWATCH_LOGS_GROUP_NAME,
    AWS_ACCESS_KEY_ID: envVars.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: envVars.AWS_SECRET_ACCESS_KEY,
  };
}

const config = loadConfig();
export default config;
