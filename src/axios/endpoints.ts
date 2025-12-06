import { ApplicationInformation } from "src/wrapper/tauri";

type HostnameConfig = {
  websocket_protocol: string;
  http_protocol: string;

  launcher_hostname: string;
  oauth_hostname: string;
};

export const hostname_config = (
  app: ApplicationInformation,
  enviroment: string = "staging"
): HostnameConfig => {
  return {
    websocket_protocol: app.dev ? "ws" : "wss",
    http_protocol: app.dev ? "http" : "https",

    launcher_hostname: app.dev
      ? "localhost:50053"
      : `launcher-service-${enviroment}.retrac.site`,

    oauth_hostname: app.dev
      ? "localhost:50053"
      : `oauth-service-${enviroment}.retrac.site`,
  };
};

type EndpointsConfig = {
  oauth_authorise_endpoint: string;
  oauth_token_endpoint: string;
  launcher_websocket_endpoint: string;
};

export const endpoints_config = (
  app: ApplicationInformation
): EndpointsConfig => {
  const hostname = hostname_config(app);

  return {
    oauth_authorise_endpoint: `${hostname.http_protocol}://${hostname.oauth_hostname}/oauth/authorise?client_id=01K5FQWCFHYHK3PNW357RE9YRZ&response_type=code&redirect_uri=retrac%3A%2F%2Fcallback`,
    oauth_token_endpoint: `${hostname.http_protocol}://${hostname.oauth_hostname}/oauth/token`,
    launcher_websocket_endpoint: `${hostname.websocket_protocol}://${hostname.launcher_hostname}/websocket/launcher`,
  };
};
