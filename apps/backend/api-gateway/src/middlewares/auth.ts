// auth.ts
import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { jwtDecode } from "jwt-decode"; // Correct import for jwtDecode
import {
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
} from "../utils/errorHandler";
import ROUTE_PATHS, { RouteConfig } from "../route-defs";

// Load environment variables
const userPoolId = process.env.COGNITO_USER_POOL_ID || "";
const clientId = process.env.CLIENT_ID || "";

if (!userPoolId || !clientId) {
  throw new Error(
    "COGNITO_USER_POOL_ID and CLIENT_ID must be set in the environment variables"
  );
}

// Create a verifier instance for AWS Cognito JWTs
const verifier = CognitoJwtVerifier.create({
  userPoolId: userPoolId,
  tokenUse: "id", // or "access"
  clientId: clientId,
});

// 1. routeConfigMiddleware
export const routeConfigMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { path, method } = req;

  let routeConfig: RouteConfig | null = null;
  for (const key in ROUTE_PATHS) {
    routeConfig = findRouteConfig(path, ROUTE_PATHS[key]);
    if (routeConfig) break;
  }

  if (!routeConfig) {
    return next(new NotFoundError("Route not found"));
  }

  const methodConfig = routeConfig.methods?.[method.toUpperCase()];
  if (!methodConfig) {
    return next(new NotFoundError("Method not allowed"));
  }

  // Attach the route configuration and method config to the request object
  (req as any).routeConfig = routeConfig;
  (req as any).methodConfig = methodConfig;
  next();
};

// 2. authenticateToken
export const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const methodConfig = (req as any).methodConfig;
    if (methodConfig.authRequired) {
      const token = req.cookies?.["access_token"];
      if (!token) {
        throw new AuthenticationError("Please login to continue");
      }

      // Verify the token using aws-jwt-verify
      const payload = await verifier.verify(token);
      if (!payload) {
        throw new AuthenticationError("Invalid token");
      }

      // Decode the ID token to determine user role
      let role: string[] = [];
      const idToken = req.cookies?.["id_token"];
      if (idToken) {
        const userPayload: any = jwtDecode(idToken);
        if (userPayload["cognito:username"]?.includes("google")) {
          if (!userPayload["custom:role"]) {
            const { data } = await axios.get(
              `${process.env.USER_SERVICE_URL}/v1/users/me`,
              {
                headers: {
                  Cookie: `username=${userPayload.sub}`,
                },
              }
            );
            role.push(data.data.role);
          } else {
            role.push(userPayload["custom:role"]);
          }
        } else {
          role = payload["cognito:groups"] || [];
        }
      }

      // Attach currentUser to the request
      (req as any).currentUser = {
        username: payload["username"],
        role,
      };
    }
    next();
  } catch (error) {
    next(error);
  }
};

// 3. authorizeRole
export const authorizeRole = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const methodConfig = (req as any).methodConfig;
  const currentUser = (req as any).currentUser;

  if (methodConfig.roles) {
    // Check if the user has at least one of the required roles
    if (
      !currentUser ||
      !Array.isArray(currentUser.role) ||
      !currentUser.role.some((role: string) =>
        methodConfig.roles.includes(role)
      )
    ) {
      return next(
        new AuthorizationError("User does not have the required role")
      );
    }
  }
  next();
};

// Helper function to find the route configuration
const findRouteConfig = (
  path: string,
  routeConfigs: RouteConfig
): RouteConfig | null => {
  const trimmedPath = path.replace(/\/+$/, ""); // Remove trailing slash if any
  const requestSegments = trimmedPath.split("/").filter(Boolean);
  const routeSegments = routeConfigs.path.split("/").filter(Boolean);

  // Check if the number of segments matches
  if (routeSegments.length > requestSegments.length) {
    return null;
  }

  // Match the segments considering dynamic segments like :id
  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const requestSegment = requestSegments[i];

    // If it's a dynamic segment, continue
    if (routeSegment.startsWith(":")) {
      continue;
    }

    // If segments do not match, return null
    if (routeSegment !== requestSegment) {
      return null;
    }
  }

  // If there are no nested routes, return the current routeConfig
  if (!routeConfigs.nestedRoutes) {
    return routeConfigs;
  }

  // Find the remaining path after matching the base path
  const remainingPath = `/${requestSegments
    .slice(routeSegments.length)
    .join("/")}`;

  // Check if any nested route matches the remaining path
  for (const nestedRouteConfig of routeConfigs.nestedRoutes) {
    const nestedResult = findRouteConfig(remainingPath, nestedRouteConfig);
    if (nestedResult) {
      return nestedResult;
    }
  }

  return routeConfigs;
};
