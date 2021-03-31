declare global {
    namespace NodeJS {
      interface ProcessEnv {
        GITHUB_AUTH_TOKEN: string;
        GITHUB_API_BASE_URL: string;
        MONGODB_URI: string;
        NODE_ENV: string;
        PORT?: string;
      }
    }
  }

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
