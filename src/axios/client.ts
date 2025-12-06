import axios, { AxiosError } from "axios";
import { useRetrac } from "src/wrapper/retrac";
import { useApplicationInformation } from "src/wrapper/tauri";

export const axiosClient = axios.create({
  baseURL: `asd`,
});

const get_discord_login_url = async (): Promise<RResponse<string>> => {
  const response = await axiosClient
    .get<string>("/authenicate")
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
