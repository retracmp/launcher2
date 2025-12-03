import axios, { AxiosError } from "axios";
import { useRetrac } from "src/wrapper/retrac";
import { useApplicationInformation } from "src/wrapper/tauri";

export const protocol = ((): string => {
  if (useRetrac.getState().override_client_url != "") {
    return useRetrac.getState().override_client_url.split("://")[0];
  }
  return useApplicationInformation.getState().dev ? "http" : "https";
})();

export const hostname = ((): string => {
  if (useRetrac.getState().override_client_url != "") {
    return useRetrac.getState().override_client_url.split("://")[1];
  }
  return useApplicationInformation.getState().dev
    ? "localhost:3000"
    : "retrac.site";
})();

export const axiosClient = axios.create({
  baseURL: `${protocol}://${hostname}`,
});

const get_discord_login_url = async (): Promise<RResponse<string>> => {
  const response = await axiosClient
    .get<string>("/retrac/discord?v=2")
    .catch((e: AxiosError<any>) => {
      return e;
    });

  if (response instanceof AxiosError) {
    return {
      ok: false,
      error: response.message,
    };
  }

  return {
    ok: true,
    data: response.data,
  };
};

const get_lootlabs_offer_url = async (
  access_token: string
): Promise<RResponse<string>> => {
  const response = await axiosClient
    .get<string>("/adverts", {
      headers: {
        Authorization: access_token,
      },
    })
    .catch((e: AxiosError<any>) => {
      return e;
    });

  if (response instanceof AxiosError) {
    return {
      ok: false,
      error: response.message,
    };
  }

  return {
    ok: true,
    data: response.data,
  };
};

export default { get_discord_login_url, get_lootlabs_offer_url };
