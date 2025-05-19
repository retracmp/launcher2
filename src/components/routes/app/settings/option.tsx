import { useEffect, useRef, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";

import * as Icons from "react-icons/io5";
import UI from "src/components/core/default";
import { AnimatePresence, motion } from "motion/react";

export type OptionTypeFile = {};
type AllowedOptionTypes = string | boolean | number | OptionTypeFile;

type OptionProps<T extends AllowedOptionTypes> = {
  title: React.ReactNode;
  description: React.ReactNode;
  state: T;
  set: (state: T) => void;
  icon?: keyof typeof Icons;
  colour?:
    | "red"
    | "blue"
    | "green"
    | "yellow"
    | "pink"
    | "purple"
    | "orange"
    | "gray"
    | "teal"
    | "indigo"
    | "slate"
    | "neutral"
    | "violet"
    | "emerald"
    | "lime"
    | "rose";

  _is_file_override?: boolean;
  _number_extra_text?: string;
  _number_min?: number;
  _number_max?: number;
  _animate?: boolean;
};

const Option = <T extends AllowedOptionTypes>(props: OptionProps<T>) => {
  const Icon = (
    props.icon != null ? Icons[props.icon] : null
  ) as React.ElementType | null;

  const isString = typeof props.state === "string";
  const isBoolean = typeof props.state === "boolean";
  const isNumber = typeof props.state === "number";
  const isFile = props._is_file_override || props.state instanceof Object;

  return (
    <motion.div
      className="relative flex flex-col p-2.5 py-2 gap-0.5 w-[100%] bg-neutral-800/10 rounded-sm border-neutral-700/40 border-1 border-solid overflow-hidden backdrop-blur-md"
      variants={
        props._animate
          ? {
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0 },
            }
          : {}
      }
      transition={{ type: "spring", stiffness: 200, damping: 19 }}
    >
      <span className="flex flex-row items-center gap-1 font-[500] text-neutral-300 text-[1rem] leading-5">
        {Icon && (
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
        )}

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
        {isNumber && !isFile && !isString && (
          <ControlStateNumber
            state={props.state as number}
            set={props.set as (state: number) => void}
            _number_extra_text={props._number_extra_text}
            _number_min={props._number_min}
            _number_max={props._number_max}
          />
        )}
        {isFile && (
          <ControlStateFile
            state={props.state as string}
            set={props.set as (state: string) => void}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

type ControlStateProps<T extends AllowedOptionTypes> = {
  state: T;
  set: (state: T) => void;
  _number_extra_text?: string;
  _number_min?: number;
  _number_max?: number;
};

const ControlStateBoolean = (props: ControlStateProps<boolean>) => {
  return props.state ? (
    <div
      className="absolute right-2 top-[50%] bg-green-700/40 w-7 h-7 rounded-sm flex items-center justify-center cursor-pointer border-1 border-solid border-green-500/20 hover:bg-green-800/50 active:scale-[0.97] backdrop-blur-lg"
      style={{
        transform: "translateY(-50%)",
      }}
      onClick={() => props.set(!props.state)}
    >
      <Icons.IoCheckmarkSharp className="text-neutral-300" />
    </div>
  ) : (
    <div
      className="absolute right-2 top-[50%] bg-neutral-800/50 w-7 h-7 rounded-sm flex items-center justify-center cursor-pointer border-1 border-solid border-neutral-500/20 hover:bg-neutral-800/20 active:scale-[0.98] backdrop-blur-lg"
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
        className="bg-neutral-700/20 h-7 p-[5px] pr-2 pl-2 gap-1.5 rounded-sm flex items-center justify-center cursor-pointer border-1 border-solid border-neutral-600/20 hover:bg-neutral-700/30 active:scale-[0.97] overflow-hidden"
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

const ControlStateNumber = (props: ControlStateProps<number>) => {
  const onFocusLost = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      e.target.value = "0";
      return;
    }
    if (value < (props._number_min ?? 0)) {
      e.target.value = props._number_min?.toString() ?? "0";
      return props.set(props._number_min ?? 0);
    }
    if (value > (props._number_max ?? Infinity)) {
      e.target.value = props._number_max?.toString() ?? "Infinity";
      return props.set(props._number_max ?? Infinity);
    }
    props.set(value);
  };

  return (
    <div
      className="absolute right-2 top-[50%] flex flex-row-reverse items-center gap-1.5"
      style={{ transform: "translateY(-50%)" }}
    >
      <div
        className="bg-neutral-700/20 h-6 py-4 px-2 rounded-sm border-1 border-solid border-neutral-600/20 hover:bg-neutral-700/30 text-neutral-300 font-code max-w-min"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input
          type="number"
          className="text-neutral-300 outline-none text-sm"
          value={props.state}
          onChange={(e) => props.set(parseFloat(e.target.value))}
          step={1}
          min={props._number_min ?? 0}
          max={props._number_max ?? Infinity}
          onFocus={(e) => e.target.select()}
          onBlur={onFocusLost}
        />

        <span className="text-neutral-500 text-xs font-code whitespace-nowrap">
          {props._number_extra_text}
        </span>
      </div>
    </div>
  );
};

const BooleanOption = (props: OptionProps<boolean>) => {
  return <Option {...props} />;
};

const StringOption = (props: OptionProps<string>) => {
  return <Option {...props} />;
};

const NumberOption = (props: OptionProps<number>) => {
  return <Option {...props} />;
};

const FileOption = (props: OptionProps<string>) => {
  return <Option {...props} _is_file_override />;
};

type OptionGroupProps = {
  title?: string;
  children: React.ReactNode;
  _first?: boolean;
  _last?: boolean;
  _hideBorder?: boolean;
  _animate?: boolean;
  _hideable?: boolean;
};

const OptionGroup = (props: OptionGroupProps) => {
  const [open, set] = useState(true);

  return (
    <motion.div
      className={`relative flex flex-col gap-2 p-2.5 ${
        !props._hideBorder &&
        "border-neutral-700/40 border-b-[1px] border-solid"
      } py-3.5 ${props._last ? "pb-3" : ""} ${props._first ? "pt-2.5" : ""}`}
      variants={
        props._animate
          ? {
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 },
            }
          : {}
      }
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{
        staggerChildren: 0.05,
      }}
    >
      {!!props.title && (
        <UI.P
          onClick={() => set((prev) => (props._hideable ? !prev : true))}
          className={`flex flex-row items-center gap-0.5 text-neutral-300/70 absolute top-[-0.6rem] bg-neutral-900/20 backdrop-blur-2xl pb-[0.15rem] pt-[0.1rem] rounded-sm px-1 ${
            props._hideable &&
            "cursor-pointer hover:text-neutral-400 transition-colors duration-[70ms]"
          }`}
        >
          {props._hideable && (
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: open ? 0 : -90 }}
            >
              <Icons.IoChevronDownSharp />
            </motion.span>
          )}

          {props.title}
        </UI.P>
      )}
      {props._hideable ? (
        <motion.div
          className="relative flex flex-col gap-2 overflow-hidden"
          animate={{
            opacity: open ? 1 : 0,
            height: open ? "auto" : 0,
          }}
          exit={{ opacity: 0, height: 0 }}
          transition={{
            height: {
              type: "spring",
              stiffness: 170,
              damping: 18,
            },
            opacity: {
              duration: 0.4,
            },
            staggerChildren: 1,
          }}
        >
          {props.children}
        </motion.div>
      ) : (
        props.children
      )}
    </motion.div>
  );
};

export { OptionGroup, StringOption, BooleanOption, NumberOption, FileOption };
