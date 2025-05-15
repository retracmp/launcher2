import { useUserManager } from "src/wrapper/user";
import { openUrl } from "@tauri-apps/plugin-opener";

import { IoLinkSharp } from "react-icons/io5";
import { OptionGroup } from "src/components/routes/app/settings/option";
import { motion } from "motion/react";
import UI from "src/components/core/default";

const StorePage = () => {
  return (
    <>
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">Store</UI.H1>
          <UI.P className="text-neutral-400">
            Consider donating to help fund the development of Retrac. All
            donations go towards server costs, development tools and other
            expenses.
          </UI.P>
        </div>
      </OptionGroup>

      <OptionGroup title="Retrac Series" _animate>
        <Package
          donatePackageTag="carti"
          title="Carti Bundle"
          price={15}
          blurb="A simple bundle of Carti skins and emotes."
          iconImage="/donate/carti.webp"
          image="/donate/carti_big.jpg"
          _iconColour1="bg-orange-500"
          _iconColour2="bg-pink-500"
        />
        <Package
          donatePackageTag="gamer"
          title="Gamer Package"
          price={15}
          blurb="Obtain lots of Gaming Series favourites."
          iconImage="/donate/gamer.webp"
          image="/donate/gamer_big.jpg"
          _iconColour1="bg-green-500"
          _iconColour2="bg-lime-500"
          _doNotAllowPurchaseIfOwnedThese={["ultimate"]}
        />
      </OptionGroup>

      <OptionGroup title="Offers" _animate>
        <Package
          donatePackageTag="crystal"
          title="Crystal Package"
          price={35}
          blurb="Unlock every Fortnite cosmetic in the game."
          iconImage="/donate/crystal.webp"
          image="/donate/crystal_big.jpg"
          _addPadding
          _iconColour1="bg-red-500"
          _iconColour2="bg-fuchsia-500"
        />
        <Package
          donatePackageTag="fncs"
          title="FNCS Bundle"
          price={20}
          blurb="Receive a collection of Fortnite Championship cosmetics."
          iconImage="/donate/fncs.webp"
          image="/donate/fncs_big.jpg"
          _addPadding
          _iconColour1="bg-yellow-500"
          _iconColour2="bg-blue-500"
          _doNotAllowPurchaseIfOwnedThese={["crystal"]}
        />
        <Package
          donatePackageTag="llama"
          title="OG Package"
          price={20}
          blurb="Gain access to a wide range of nostalgic skins."
          iconImage="/donate/og.webp"
          image="/donate/og_big.jpg"
          _iconColour1="bg-blue-500"
          _iconColour2="bg-purple-500"
          _doNotAllowPurchaseIfOwnedThese={["crystal"]}
        />
      </OptionGroup>
    </>
  );
};

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
      className={`group relative min-h-max border-[#2e2e2e] border-[1px] border-solid rounded-sm overflow-hidden p-2.5 gap-0.5 ${
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

export default StorePage;
