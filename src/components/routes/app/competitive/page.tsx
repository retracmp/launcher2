import { motion } from "motion/react";
import { useNavigate } from "@tanstack/react-router";

import UI from "src/components/core/default";
import { OptionGroup } from "src/components/core/option";
import { IoArrowForward } from "react-icons/io5";

const CompetitivePage = () => {
  return (
    <>
      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">Competitive</UI.H1>
          <UI.P className="text-neutral-400">
            Either view global leaderboards tracking eliminations and wins, or
            review current in-game tournaments!
          </UI.P>
        </div>
      </OptionGroup>

      <OptionGroup _first _last title="">
        <motion.div
          className="flex flex-col flex-wrap gap-2"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 },
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{
            staggerChildren: 0.05,
          }}
        >
          <Redirect
            name="Leaderboards"
            description="Find out if you are among the top-rated players."
            path="/app/leaderboard"
          />
          <Redirect
            name="Tournaments"
            description="Upcoming tournaments and events to play with your friends."
            path="/app/scrims"
            yellow_tag="coming soon"
            disabled
          />
          <Redirect
            name="Scrims"
            description="Only for the highest level of players, view your status and prize payouts."
            path="/app/scrims"
            yellow_tag="coming soon"
            disabled
          />
        </motion.div>
      </OptionGroup>
    </>
  );
};

type RedirectItemProps = {
  path: string;
  name: string;
  description: string;
  yellow_tag?: string;
  disabled?: boolean;
};

const Redirect = (props: RedirectItemProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className={`group flex flex-row items-center w-full p-2.5 gap-2 rounded-sm border-neutral-700/10 border-[1px] border-solid overflow-hidden bg-neutral-700/10  ${
        !props.disabled && "hover:bg-neutral-700/15 cursor-pointer"
      } transition-colors hover:duration-[20ms] duration-150`}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 19 }}
      onClick={() =>
        !props.disabled &&
        navigate({
          to: props.path,
        })
      }
    >
      <div className="flex flex-col w-full h-full justify-center gap-[0.05rem]">
        <p
          className={`flex flex-row items-center gap-1 font-semibold text-md text-neutral-300 leading-4 transition-colors duration-75`}
        >
          {props.name}

          {props.yellow_tag && props.yellow_tag != "" && (
            <span className="bg-amber-400 px-1 font-bold leading-3 py-0.5 rounded-full text-xs text-black/50">
              {props.yellow_tag}
            </span>
          )}
        </p>
        <p
          className={`flex flex-row gap-1 items-center text-sm leading-4 text-neutral-400 transition-colors duration-75`}
        >
          {props.description}
        </p>
      </div>
      <IoArrowForward className="ml-auto w-5 h-5 text-neutral-400" />
    </motion.div>
  );
};

export default CompetitivePage;
