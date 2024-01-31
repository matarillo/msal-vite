import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AUTH_CLIENTID,
    authority: import.meta.env.VITE_AUTH_AUTHORITY,
    knownAuthorities: [import.meta.env.VITE_AUTH_TENANT_DOMAIN],
    redirectUri: import.meta.env.VITE_AUTH_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 1:
            console.error(message);
            return;
          case 2:
            console.info(message);
            return;
          case 3:
            console.debug(message);
            return;
          case 4:
            console.warn(message);
            return;
        }
      },
    },
  },
};

const msalScopes = (import.meta.env.VITE_AUTH_API_SCOPES ?? "").split(",");

/**
 * @type PublicClientApplication
 */
let msalApp;
/**
 * @type import("@azure/msal-browser").AuthenticationResult
 */
let msalResult;

export const auth = {
  async init() {
    msalApp = new PublicClientApplication(msalConfig);
    await msalApp.initialize();
    const result = await msalApp.handleRedirectPromise();
    msalResult = result ?? {};
  },
  async login() {
    if (msalApp.getAllAccounts().length > 0) {
      msalApp.setActiveAccount(msalApp.getAllAccounts()[0]);
      const result = await msalApp.acquireTokenSilent({
        scopes: msalScopes,
        redirectUri: msalConfig.auth.redirectUri,
      });
      msalResult = result ?? {};
    } else {
      await msalApp.acquireTokenRedirect({
        redirectStartPage: location.href,
        scopes: msalScopes,
        redirectUri: msalConfig.auth.redirectUri,
      });
    }
  },
  async logout() {
    await msalApp.logoutRedirect();
    msalResult = {};
  },
  idToken() {
    return msalResult.idToken;
  },
};
