import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

type Config = {
  NODE_ENV: string;
  PORT: number;
  MONGO_URL: string;
};

function loadConfig(): Config {
  const NODE_ENV = process.env.NODE_ENV || "development";
  const envPath = path.resolve(__dirname, `./configs/.env.${NODE_ENV}`);
  dotenv.config({ path: envPath });

  const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().required(),
    PORT: Joi.number().required(),
    MONGO_URL: Joi.string().required(),
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
    MONGO_URL: envVars.MONGO_URL,
  };
}
const config = loadConfig();
export default config;
