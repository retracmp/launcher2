import { Outlet, useNavigate } from "@tanstack/react-router";
import { useUserManager } from "src/wrapper/user";

const AppContainer = () => {
  const userManager = useUserManager();
  const navigate = useNavigate();

  if (!userManager.access()) {
    navigate({
      to: "/",
    });
  }

  return <Outlet />;
};

export default AppContainer;
