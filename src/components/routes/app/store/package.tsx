import { useUserManager } from "src/wrapper/user";
import { openUrl } from "@tauri-apps/plugin-opener";

import { IoLinkSharp } from "react-icons/io5";
import { motion } from "motion/react";
import UI from "src/components/core/default";

type PackageProps = {
  donatePackageTag?: string;
  title: string;
  price: number;
  blurb: string;
  iconImage: string;
  image: string;
  link?: string;
  _iconColour1?: string;
  _iconColour2?: string;
  _addPadding?: boolean;
  _doNotAllowPurchaseIfOwnedThese?: string[];
};

const Package = (props: PackageProps) => {
  const user = useUserManager();

  const owns = user._user?.Account.State.Packages.includes(
    props.donatePackageTag ?? "none"
  );

  const allowPurchase =
    user._user?.Account.State.Packages.reduce((acc, cur) => {
      if (props._doNotAllowPurchaseIfOwnedThese?.includes(cur)) {
        return false;
      }
      return acc;
    }, true) ?? true;

  return (
    <motion.div
      className={`group relative min-h-max border-[#2e2e2e] backdrop-blur-2xl border-[1px] border-solid rounded-sm overflow-hidden p-2.5 gap-0.5 ${
        allowPurchase ? "cursor-pointer" : "cursor-not-allowed"
      }`}
      variants={{
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 19 }}
      onClick={() => {
        if (allowPurchase) {
          if (owns) {
            return;
          }
          openUrl(
            props.link ??
              `https://shop.retrac.site/product/${props.donatePackageTag}`
          );
        }
      }}
    >
      <div
        className={`absolute w-full h-full flex flex-row top-0 left-0 blur-[0.03rem] transition-all duration-100`}
      >
        {
          <img
            src={props.image}
            className="ml-auto cover w-96 object-cover opacity-30 group-hover:opacity-100 transition-opacity duration-[70ms]"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 100%)",
              willChange: "transform",
              transform: "translateZ(0)",
            }}
            loading="lazy"
          />
        }
      </div>

      <div className="absolute top-2 right-2 flex flex-row gap-1">
        <div className="bg-neutral-700/40 h-[24px] min-h-[24px] min-w-[24px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-100">
          <IoLinkSharp className="text-neutral-400 w-[14px] h-[14px]" />
        </div>

        {owns ? (
          <div
            className={`bg-green-700/20 group-hover:bg-green-700/40 backdrop-blur-lg transition-all duration-50 rounded-xl p-2 py-1 flex flex-row items-center gap-1`}
          >
            <UI.P className="text-[12px] flex flex-row items-center gap-0.5 text-neutral-400 group-hover:text-neutral-300 transition-colors duration-[70ms]">
              Purchased
            </UI.P>
          </div>
        ) : (
          <div
            className={`bg-neutral-700/40 backdrop-blur-lg transition-opacity duration-50 rounded-xl p-2 py-1 flex flex-row items-center gap-1`}
          >
            <UI.P className="text-[12px] flex flex-row items-center gap-0.5 text-neutral-400 group-hover:text-neutral-300 transition-colors duration-[70ms]">
              {allowPurchase ? <>${props.price.toFixed(2)}</> : "Not Available"}
            </UI.P>
          </div>
        )}
      </div>

      <div className="w-full h-full top-0 left-0 flex flex-row z-20 opacity-100 transition-opacity duration-100 gap-2">
        <div
          className={`relative overflow-hidden flex items-center justify-center w-12 h-12 min-w-12 min-h-12 aspect-square bg-blue-400/10 rounded-md bg-cover bg-no-repeat bg-center ${
            props._addPadding && "p-1"
          }`}
        >
          <div className="absolute w-full h-full blur-[1.25rem]">
            <div
              className={`absolute w-[29%] h-[120%] top-0 left-0 ${props._iconColour1} rounded-full`}
              style={{
                transform: "translate(-50%, -50%)",
              }}
            ></div>

            <div
              className={`absolute w-[29%] h-[120%] bottom-0 right-0  ${props._iconColour2} rounded-full`}
              style={{
                transform: "translate(-50%, 50%)",
              }}
            ></div>
          </div>

          <div
            className="w-full h-full aspect-square bg-cover bg-no-repeat bg-center z-20"
            style={{
              backgroundImage: `url('${props.iconImage}')`,
            }}
          ></div>
        </div>
        <div className="w-full h-full flex flex-col justify-center">
          <UI.H1>{props.title}</UI.H1>
          <UI.P className="text-neutral-400">{props.blurb}</UI.P>
        </div>
      </div>
    </motion.div>
  );
};
export default Package;
