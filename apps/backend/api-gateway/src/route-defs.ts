import configs from "../src/config";

export interface RouteConfig {
  path: string;
  target?: string;
  methods?: {
    [method: string]: {
      authRequired: boolean;
      roles?: string[]; // Optional: Roles that are allowed
    };
  };
  nestedRoutes?: RouteConfig[];
}

export interface RoutesConfig {
  [route: string]: RouteConfig;
}

const ROUTE_PATHS: RoutesConfig = {
  AUTH_SERVICE: {
    path: "/auth",
    target: configs.AUTH_SERVICE_URL,
    nestedRoutes: [
      {
        path: "/register",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/signin",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/verify",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/google/login",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/google/callback",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/refresh-token",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/user/:email/attributes",
        methods: {
          GET: {
            authRequired: true,
          },
        },
      },
      {
        path: "/user/:email",
        methods: {
          GET: {
            authRequired: true,
          },
        },
      },
      {
        path: "/users",
        methods: {
          GET: {
            authRequired: true,
            roles: ["admin"],
          },
        },
      },
    ],
  },
  PRODUCT_SERVICE: {
    path: "/v2/product",
    target: configs.PRODUCT_SERVICE_URL,
    nestedRoutes: [
      {
        path: "/",
        methods: {
          GET: {
            authRequired: false,
          },
          POST: {
            authRequired: true,
            roles: ["admin"],
          },
        },
      },
      {
        path: "/:id",
        methods: {
          GET: {
            authRequired: false,
          },
          PUT: {
            authRequired: true,
            roles: ["admin"],
          },
          DELETE: {
            authRequired: true,
            roles: ["admin"],
          },
        },
      },
    ],
  },
  USER_SERVICE: {
    path: "/v1/users",
    target: configs.USER_SERVICE_URL,
    methods: {
      GET: {
        authRequired: true,
        roles: ["user", "admin"],
      },
      POST: {
        authRequired: true,
        roles: ["user", "admin"],
      },
    },
    nestedRoutes: [
      {
        path: "/health",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/me",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "admin"],
          },
        },
      },
    ],
  },
  JOB_SERVICE: {
    path: "/v1/jobs",
    target: configs.JOB_SERVICE_URL,
    methods: {
      GET: {
        authRequired: false,
      },
    },
    nestedRoutes: [
      {
        path: "/health",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/:id",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
    ],
  },
  NOTIFICATION_SERVICE: {
    path: "/v1/notifications",
    target: configs.NOTIFICATION_SERVICE_URL,
    nestedRoutes: [
      {
        path: "/health",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/subscribe",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
    ],
  },
};

export default ROUTE_PATHS;
