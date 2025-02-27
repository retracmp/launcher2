import { Outlet, useNavigate } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { useUserManager } from "src/wrapper/user";

const AppContainer = () => {
  const userManager = useUserManager();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!userManager.access()) {
      navigate({
        to: "/",
      });
    }
  }, [userManager._token]);

  return <Outlet />;
};

export default AppContainer;
