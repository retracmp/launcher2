import { useEffect } from "react";
import { getCurrentWindow, UserAttentionType } from "@tauri-apps/api/window";
import { UnlistenFn } from "@tauri-apps/api/event";
import { useBannerManager } from "src/wrapper/banner";
import { useUserManager } from "src/wrapper/user";
import { useNavigate } from "@tanstack/react-router";
import { openUrl } from "@tauri-apps/plugin-opener";

import * as deeplink from "@tauri-apps/plugin-deep-link";
import client from "src/axios/client";

import UI from "src/components/core/default";

const LoginPage = () => {
  const userManager = useUserManager();
  const bannerManager = useBannerManager();
  const navigate = useNavigate();

  const handleAuthenticate = async () => {
    const redirect = await client.get_discord_login_url();
    if (!redirect.ok) {
      bannerManager.push({
        id: "login-error",
        text: "Our servers seem to be down, please try again later.",
        closable: true,
        colour: "red",
      });
      throw new Error("Failed to get Discord login URL");
    }
    await openUrl(redirect.data);
  };

  const onNewToken = async (input: string[]) => {
    for (const scheme of input) {
      console.log("[login] new token", input);
      if (scheme.startsWith("retrac://token@")) {
        const token = scheme
          .replace("retrac://token@", "")
          .replace("/", "")
          .trim();
        userManager.login(token);
        navigate({
          to: "/app",
        });
        getCurrentWindow().requestUserAttention(UserAttentionType.Critical);
      }
    }
  };

  useEffect(() => {
    const unlisten = deeplink.onOpenUrl(onNewToken);

    return () => {
      unlisten.then((fn: UnlistenFn) => fn());
    };
  }, []);

  useEffect(() => {
    if (userManager.access()) {
      navigate({
        to: "/app",
      });
    }
  }, [userManager._token]);

  return (
    <>
      <UI.Box className="flex flex-col p-1.5 gap-0.5">
        <UI.P>
          Welcome to Retrac, please connect your Discord account to use our
          services.
        </UI.P>
      </UI.Box>
      <UI.ColBox>
        <UI.Button
          loadAfterClick={true}
          loadAfterClickText="Waiting for callback"
          colour="discord"
          onClick={handleAuthenticate}
        >
          Authenticate with Discord
        </UI.Button>
      </UI.ColBox>
    </>
  );
};

export default LoginPage;
