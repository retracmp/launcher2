import { useLayoutEffect } from "react";
import * as app from "@tauri-apps/api/app";
import { useApplicationInformation } from "src/wrapper/tauri";

const Boostrap = () => {
  const application = useApplicationInformation();

  const boostrap = async () => {
    application.load(await app.getName(), await app.getVersion());
  };

  const nil = (e: MouseEvent) => e.preventDefault();

  useLayoutEffect(() => {
    boostrap();

    document.addEventListener("contextmenu", nil);
    return () => {
      document.removeEventListener("contextmenu", nil);
    };
  }, []);

  return null;
};

export default Boostrap;
