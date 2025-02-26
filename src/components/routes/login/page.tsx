import { UnlistenFn } from "@tauri-apps/api/event";
import { useUserManager } from "src/wrapper/user";
import { useEffect } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import * as deeplink from "@tauri-apps/plugin-deep-link";
import client from "src/axios/client";

import UI from "src/components/core/default";

const LoginPage = () => {
  const userManager = useUserManager();

  const handleAuthenticate = async () => {
    const redirect = await client.get_discord_login_url();
    if (!redirect.ok) return;
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
      }
    }
  };

  useEffect(() => {
    const unlisten = deeplink.onOpenUrl(onNewToken);

    return () => {
      unlisten.then((fn: UnlistenFn) => fn());
    };
  }, []);

  return (
    <>
      <UI.Box className="flex flex-col p-1.5 gap-0.5">
        <UI.P>
          Welcome to Retrac, please connect your Discord account to use our
          services.
        </UI.P>
      </UI.Box>
      <UI.ColBox>
        <UI.Button colour="discord" onClick={handleAuthenticate}>
          Authenticate with Discord
        </UI.Button>
      </UI.ColBox>
    </>
  );
};

export default LoginPage;
