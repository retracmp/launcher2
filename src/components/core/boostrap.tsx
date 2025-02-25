import { useLayoutEffect } from "react";
import * as app from "@tauri-apps/api/app";
import { useApplicationInformation } from "src/wrapper/tauri";

const ANTI_SHORTCUTS = ["ctrl+p", "ctrl+f", "ctrl+u", "ctrl+j"];

const Boostrap = () => {
  const application = useApplicationInformation();

  const boostrap = async () => {
    application.load(
      await app.getName(),
      await app.getVersion(),
      import.meta.env.MODE === "development"
    );
  };

  const nil = (e: MouseEvent) => e.preventDefault();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      (event.ctrlKey || event.metaKey) &&
      ANTI_SHORTCUTS.includes(`${event.ctrlKey ? "ctrl+" : ""}${event.key}`)
    ) {
      event.preventDefault();
    }

    if (event.key === "Tab") event.preventDefault();
  };

  useLayoutEffect(() => {
    boostrap();

    document.addEventListener("contextmenu", nil);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", nil);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
};

export default Boostrap;
