import { useEffect } from "react";

import { useUserManager } from "src/wrapper/user";
import { useNavigate } from "@tanstack/react-router";
import { useApplicationInformation } from "src/wrapper/tauri";
import { openUrl } from "@tauri-apps/plugin-opener";

import { endpoints_config } from "src/axios/endpoints";

import UI from "src/components/core/default";
import { OptionGroup } from "../../core/option";

const LoginPage = () => {
  const userManager = useUserManager();
  const application = useApplicationInformation();
  const navigate = useNavigate();

  const handleAuthenticate = async () => {
    const endpoint_configuration = await endpoints_config(application);
    await openUrl(endpoint_configuration.oauth_authorise_endpoint);
  };

  useEffect(() => {
    if (userManager.access()) {
      navigate({
        to: "/app/home",
      });
    }
  }, [userManager._token]);

  return (
    <>
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <div
            className="w-full h-36 rounded-md bg-cover bg-center bg-no-repeat mb-1 brightness-[0.8]"
            style={{
              backgroundImage: `url(/retrac_banner.png)`,
            }}
          ></div>
          <UI.P className="text-neutral-400">
            Welcome to Retrac, please connect your Discord account to use our
            services.
          </UI.P>
        </div>
        <UI.Button
          colour="discord"
          onClick={handleAuthenticate}
          className="backdrop-blue-2xl"
          loadAfterClick={true}
          loadAfterClickText="Waiting for callback"
        >
          Authenticate with Discord
        </UI.Button>
      </OptionGroup>
    </>
  );
};

export default LoginPage;
