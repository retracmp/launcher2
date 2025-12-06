import { useEffect } from "react";
import { useUserManager } from "src/wrapper/user";
import { useApplicationInformation } from "src/wrapper/tauri";
import { useNavigate } from "@tanstack/react-router";
import { BANNER_DEFAULTS, useBannerManager } from "src/wrapper/banner";

import { getCurrentWindow, UserAttentionType } from "@tauri-apps/api/window";
import { UnlistenFn } from "@tauri-apps/api/event";
import * as deeplink from "@tauri-apps/plugin-deep-link";

import { make_request } from "src/axios/endpoints";

const AuthoriseHandler = () => {
  const application = useApplicationInformation();
  const navigate = useNavigate();
  const set_token = useUserManager((s) => s.login);
  const push_banner = useBannerManager((s) => s.push);

  const onNewToken = async (input: string[]) => {
    getCurrentWindow().setFocus();

    if (input.length == 0) return;
    const callback = input.map((s: string) => new URL(s))[0];

    const token_information = await make_request(
      application,
      "oauth_token_endpoint",
      "POST",
      {
        grant_type: "authorization_code",
        code: callback.searchParams.get("code"),
        client_id: "01K5FQWCFHYHK3PNW357RE9YRZ",
        redirect_uri: "retrac://callback",
      }
    );
    if (!token_information.success)
      return push_banner(BANNER_DEFAULTS.LOGIN_ERROR);

    // userManager.login(token);
    navigate({
      to: "/app/home",
    });
    set_token(
      token_information.result.access_token,
      new Date(token_information.result.expires_in * 1000),
      token_information.result.refresh_token
    );
    getCurrentWindow().requestUserAttention(UserAttentionType.Critical);

    console.log("[login] new token", token_information);
  };

  useEffect(() => {
    const unlisten = deeplink.onOpenUrl(onNewToken);

    return () => {
      unlisten.then((fn: UnlistenFn) => fn());
    };
  }, [application.dev]);

  return null;
};

export default AuthoriseHandler;
