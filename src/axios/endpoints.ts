import axios, { AxiosRequestConfig } from "axios";
import { ApplicationInformation } from "src/wrapper/tauri";

type HostnameConfig = {
  websocket_protocol: string;
  http_protocol: string;

  launcher_hostname: string;
  oauth_hostname: string;
  fiscal_hostname: string;
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
      ? "localhost:50055/proxy/internal"
      : `oauth-service-${enviroment}.retrac.site`,

    fiscal_hostname: app.dev
      ? // TODO: actually make the service and add a port
        "localhost:99999"
      : `fiscal-service-${enviroment}.retrac.site`,
  };
};

type EndpointsConfig = {
  launcher_websocket_endpoint: [string, null];
  oauth_authorise_endpoint: [string, null];
  oauth_token_endpoint: [
    string,
    { access_token: string; expires_in: number; refresh_token: string }
  ];
  fiscal_advert_endpoint: [string, string];
};

type TupleNth<T extends any[], N extends number> = T[N];
type ExtractNth<T extends Record<string, any>, N extends number> = {
  [K in keyof T]: T[K] extends any[] ? TupleNth<T[K], N> : never;
};

type EndpointsEndpointType = ExtractNth<EndpointsConfig, 0>;
type EndpointsResponseType = ExtractNth<EndpointsConfig, 1>;

export const endpoints_config = (
  app: ApplicationInformation
): EndpointsEndpointType => {
  const hostname = hostname_config(app);

  return {
    launcher_websocket_endpoint: `${hostname.websocket_protocol}://${hostname.launcher_hostname}/websocket/launcher`,
    oauth_authorise_endpoint: `${hostname.http_protocol}://${hostname.oauth_hostname}/oauth/authorise?client_id=01K5FQWCFHYHK3PNW357RE9YRZ&response_type=code&redirect_uri=retrac%3A%2F%2Fcallback`,
    oauth_token_endpoint: `${hostname.http_protocol}://${hostname.oauth_hostname}/oauth/token`,
    fiscal_advert_endpoint: `${hostname.http_protocol}://${hostname.fiscal_hostname}/labs/flow`,
  };
};

type MakeRequestResult<T> = { success: true; result: T } | { success: false };

type MakeRequestOptions = {
  method: "POST" | "GET";
  body: Object | null;
};
const DefaultMakeRequestOptions: MakeRequestOptions = {
  method: "GET",
  body: null,
};

const make_request_internal = async <T extends keyof EndpointsConfig>(
  endpoint: string,
  ...options: Partial<MakeRequestOptions>[]
): Promise<EndpointsResponseType[T] | null> => {
  const option = {
    ...DefaultMakeRequestOptions,
    ...[...options, DefaultMakeRequestOptions][0],
  };

  const config: AxiosRequestConfig = {
    url: endpoint,
    method: option.method,
    ...(option.method === "POST"
      ? {
          headers: {
            "Content-Type": "application/json",
          },
          data: option.body,
        }
      : {}),
  };

  const response = await axios
    .request<EndpointsResponseType[T]>(config)
    .catch(() => null);
  if (response === null || response === undefined) return null;

  return response.data;
};

export const make_request = async <T extends keyof EndpointsConfig>(
  app: ApplicationInformation,
  endpoint: T,
  request_method: MakeRequestOptions["method"] = "GET",
  request_body: MakeRequestOptions["body"] = {}
): Promise<MakeRequestResult<EndpointsResponseType[T]>> => {
  const final_endpoint = endpoints_config(app)[endpoint];

  const response: EndpointsResponseType[T] | null = await make_request_internal(
    final_endpoint,
    {
      method: request_method,
      body: request_body,
    }
  );
  if (response === null) return { success: false };

  return { success: true, result: response };
};
