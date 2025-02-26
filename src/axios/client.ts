import axios, { AxiosError } from "axios";

export const axiosClient =
  import.meta.env.MODE === "development"
    ? axios.create({
        baseURL: "http://127.0.0.1:3000",
      })
    : axios.create({
        baseURL: "https://retrac.site/",
      });

const get_discord_login_url = async (): Promise<RResponse<string>> => {
  const response = await axiosClient
    .get<string>("/retrac/discord")
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

export default { get_discord_login_url };
