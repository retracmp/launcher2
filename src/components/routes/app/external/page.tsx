import { useUserManager } from "src/wrapper/user";
import { useLauncherSocket } from "src/sockets";
import { useEffect } from "react";
import { useBannerManager } from "src/wrapper/banner";

import { OptionGroup } from "../../../core/option";
import { motion } from "motion/react";
import UI from "src/components/core/default";
import Account from "src/components/visual/account";
import * as Icons from "react-icons/io5";

const ExternalLoginPage = () => {
  const socket = useLauncherSocket();

  const onOtpRecieve = (data: SocketDownEventDataFromType<"otp">) => {
    console.log("[socket] otp", data.otp);

    user.set_otp(data.otp);
  };

  useEffect(() => {
    socket.bind("otp", onOtpRecieve);

    socket.send({
      id: "otp_subscribe",
    } as Omit<SocketUpEventDataFromType<"otp_subscribe">, "version">);

    return () => {
      socket.unbind("otp", onOtpRecieve);

      socket.send({
        id: "otp_unsubscribe",
      } as Omit<SocketUpEventDataFromType<"otp_unsubscribe">, "version">);
    };
  }, [socket.socket]);

  const user = useUserManager();
  return null;
  if (!user._user) return null;

  const usernameContainsSpaces = user._user.Account.DisplayName.includes(" ");
  const usingEmailPart = usernameContainsSpaces
    ? user._user.ID
    : user._user.Account.DisplayName;

  return (
    <>
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">
            External Device Auth
          </UI.H1>
          <UI.P className="text-neutral-400">
            Trying to connect to a PS4, Switch or an Android device? Connect
            your account to a two-factor authentication app to generate one time
            passwords for your device.
          </UI.P>
        </div>
      </OptionGroup>

      <OptionGroup title="Your Account">
        <Account />
      </OptionGroup>

      <OptionGroup title="Credentials" _animate>
        <Box
          title="Platform Email"
          body={`${usingEmailPart}@re.trac`}
          icon="IoAt"
          buttons={null}
        />

        <Box
          title="One Time Password"
          body={user.otp || "Waiting..."}
          icon="IoFingerPrint"
          buttons={
            // <div className="aspect-square min-w-max h-fit flex items-center justify-center p-1.5 bg-neutral-700/20 rounded-md cursor-pointer hover:bg-neutral-700/30 transition-all">
            //   <Icons.IoRefresh className="w-full h-full text-neutral-500" />
            // </div>
            null
          }
        />
      </OptionGroup>
    </>
  );
};

type BoxProps = {
  title: string;
  body: string;
  icon: keyof typeof Icons;
  buttons: React.ReactNode;
};

const Box = (props: BoxProps) => {
  const banners = useBannerManager();
  const IconComponent = Icons[props.icon];

  return (
    <motion.div
      className="group relative flex flex-row items-center w-full p-2.5 px-2 gap-2 rounded-sm border-neutral-700/40 border-[1px] border-solid overflow-hidden hover:bg-neutral-700/5 cursor-pointer transition-colors duration-75"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 19 }}
      onClick={(e) => {
        e.preventDefault();
        window.navigator.clipboard.writeText(props.body).then(
          () => {
            console.log("[external-login] copied to clipboard:", props.body);

            banners.push({
              id: `external-login-${props.body.toLowerCase()}`,
              text: `Copied ${props.title} to clipboard!`,
              closable: true,
              colour: "blue",
              expireAfter: 3,
            });
          },
          (err) => {
            console.error("[external-login] failed to copy to clipboard:", err);
          }
        );
      }}
    >
      <div className="h-full aspect-square min-w-max min-h-9 flex items-center justify-center p-1.5 bg-neutral-700/20 rounded-md">
        <IconComponent className="w-full h-full text-neutral-500" />
      </div>

      <div className="flex flex-col w-full h-full justify-center">
        <p className="font-semibold text-md text-neutral-300 leading-4">
          {props.title}
        </p>
        <p className="flex flex-row gap-1 items-center text-sm leading-4 text-neutral-400">
          {props.body}
          <Icons.IoCopy className="text-neutral-500" />
        </p>
      </div>

      <div className="flex flex-row items-center gap-2 ml-auto">
        {props.buttons}
      </div>
    </motion.div>
  );
};

export default ExternalLoginPage;
