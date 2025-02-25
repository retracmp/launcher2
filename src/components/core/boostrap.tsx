import { useLayoutEffect } from "react";
import * as app from "@tauri-apps/api/app";
import { useApplicationInformation } from "src/wrapper/tauri";

const Boostrap = () => {
  const application = useApplicationInformation();

  const boostrap = async () => {
    application.load(await app.getName(), await app.getVersion());
  };

  useLayoutEffect(() => {
    boostrap();
  }, []);

  return null;
};

export default Boostrap;
