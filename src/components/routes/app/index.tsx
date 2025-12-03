import { Outlet, useNavigate } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { useApplicationInformation } from "src/wrapper/tauri";
import { useUserManager } from "src/wrapper/user";

const AppContainer = () => {
  const userManager = useUserManager();
  const application = useApplicationInformation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!userManager.access()) {
      navigate({
        to: "/",
      });
    }
  }, [userManager._token, application.updateNeeded]);

  return <Outlet />;
};

export default AppContainer;
