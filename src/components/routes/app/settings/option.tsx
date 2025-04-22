import { useEffect, useRef, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";

import * as Icons from "react-icons/io5";
import UI from "src/components/core/default";
import { AnimatePresence, motion } from "motion/react";

export type OptionTypeFile = {};
type AllowedOptionTypes = string | boolean | OptionTypeFile;

type OptionProps<T extends AllowedOptionTypes> = {
  title: React.ReactNode;
  description: React.ReactNode;
  state: T;
  set: (state: T) => void;
  icon?: keyof typeof Icons;
  colour?: "red" | "blue" | "green" | "yellow" | "pink" | "purple" | "orange";

  _is_file_override?: boolean;
};

const Option = <T extends AllowedOptionTypes>(props: OptionProps<T>) => {
  const Icon = (props.icon ? Icons[props.icon] : <></>) as React.ElementType;

  const isString = typeof props.state === "string";
  const isBoolean = typeof props.state === "boolean";
  const isFile = props._is_file_override || props.state instanceof Object;

  return (
    <div className="relative flex flex-col p-2 py-1.5 w-[100%] bg-neutral-800/10 rounded-sm border-[#2e2e2e] border-1 border-solid overflow-hidden">
      <span className="flex flex-row items-center gap-1 font-[500] text-neutral-300 text-[1rem] leading-5">
        <Icon
          style={{
            color: props.colour
              ? `var(--color-${props.colour}-300) !important`
              : "",
            fill: props.colour
              ? `var(--color-${props.colour}-300) !important`
              : "",
          }}
        />
        {props.title}
      </span>
      <span className="text-sm font-[400] text-neutral-500 leading-4">
        {props.description}
      </span>

      <AnimatePresence>
        {isString && !isFile && !isBoolean && (
          <ControlStateString
            state={props.state as string}
            set={props.set as (state: string) => void}
          />
        )}
        {isBoolean && !isFile && !isString && (
          <ControlStateBoolean
            state={props.state as boolean}
            set={props.set as (state: boolean) => void}
          />
        )}
        {isFile && (
          <ControlStateFile
            state={props.state as string}
            set={props.set as (state: string) => void}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

type ControlStateProps<T extends AllowedOptionTypes> = {
  state: T;
  set: (state: T) => void;
};

const ControlStateBoolean = (props: ControlStateProps<boolean>) => {
  return props.state ? (
    <div
      className="absolute right-2 top-[50%] bg-green-700/50 w-7 h-7 rounded-sm flex items-center justify-center cursor-pointer border-1 border-solid border-green-500/20 hover:bg-green-800/70 active:scale-[0.97]"
      style={{
        transform: "translateY(-50%)",
      }}
      onClick={() => props.set(!props.state)}
    >
      <Icons.IoCheckmarkSharp className="text-neutral-300" />
    </div>
  ) : (
    <div
      className="absolute right-2 top-[50%] bg-neutral-800/50 w-7 h-7 rounded-sm flex items-center justify-center cursor-pointer border-1 border-solid border-neutral-500/20 hover:bg-neutral-800/20 active:scale-[0.98]"
      style={{
        transform: "translateY(-50%)",
      }}
      onClick={() => props.set(!props.state)}
    >
      <Icons.IoCloseSharp className="text-neutral-700" />
    </div>
  );
};

const ControlStateString = (_: ControlStateProps<string>) => {
  return <></>;
};

const ControlStateFile = (props: ControlStateProps<string>) => {
  const [buttonHovered, setButtonHovered] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const textMeasureRef = useRef<HTMLSpanElement>(null);

  const niceFileName = props.state
    .replace(/\\/g, "/")
    .split("/")
    .slice(-2)
    .join("/");

  useEffect(() => {
    if (!textMeasureRef.current) return;
    setTextWidth(textMeasureRef.current.offsetWidth);
  }, [niceFileName]);

  const handleSetFile = async (location: string) => {
    if (location === props.state) return;
    props.set(location);
  };

  const handleFindLocation = async () => {
    const selectedPath = await open({ directory: true, multiple: false });
    if (!selectedPath) return;

    if (Array.isArray(selectedPath)) {
      return handleSetFile(selectedPath[0]);
    }

    return handleSetFile(selectedPath);
  };

  return (
    <div
      className="absolute right-2 top-[50%] flex flex-row-reverse items-center gap-1.5"
      style={{ transform: "translateY(-50%)" }}
    >
      <span
        ref={textMeasureRef}
        className="absolute invisible whitespace-nowrap text-xs font-code"
      >
        {props.state ? niceFileName : "Empty"}
      </span>

      <motion.div
        className="bg-[#242424] h-7 p-[5px] pr-2 pl-2 gap-1.5 rounded-sm flex items-center justify-center cursor-pointer border-1 border-solid border-neutral-500/20 hover:bg-[#222222] active:scale-[0.97] overflow-hidden"
        onClick={handleFindLocation}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        animate={{
          width: buttonHovered ? textWidth + 36 : 28,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 22.5 }}
      >
        {buttonHovered && (
          <UI.P
            className="text-neutral-500 text-xs font-code whitespace-nowrap"
            style={{
              direction: "rtl",
              textAlign: "left",
            }}
          >
            {props.state ? niceFileName : "Empty"}
          </UI.P>
        )}
        <Icons.IoFolderOpenSharp className="text-neutral-400 min-w-4" />
      </motion.div>
    </div>
  );
};

const BooleanOption = (props: OptionProps<boolean>) => {
  return <Option {...props} />;
};

const StringOption = (props: OptionProps<string>) => {
  return <Option {...props} />;
};

const FileOption = (props: OptionProps<string>) => {
  return <Option {...props} _is_file_override />;
};

export { StringOption, BooleanOption, FileOption };
