import { useCallback, useEffect, useRef, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";

import * as Icons from "react-icons/io5";
import UI from "src/components/core/default";
import { AnimatePresence, motion } from "motion/react";

export type OptionTypeString = { _a: "string" };
export type OptionTypeBoolean = { _a: "boolean" };
export type OptionTypeNumber = { _a: "number" };
export type OptionTypeFile = { _a: "file" };
export type OptionTypeColour = { _a: "colour" };
export type OptionTypeSlider = { _a: "slider" };

type AllowedOptionTypes =
  | OptionTypeString
  | OptionTypeBoolean
  | OptionTypeNumber
  | OptionTypeFile
  | OptionTypeColour
  | OptionTypeSlider;

type OptionStateType = string | number | boolean | string[] | null;

type OptionProps<T extends AllowedOptionTypes, K extends OptionStateType> = {
  title: React.ReactNode;
  description: React.ReactNode;
  type: T;
  state: K;
  set: (state: K) => void;
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
  _colour_options?: string[];
  _colour_gradient?: boolean;
  _number_extra_text?: string;
  _number_min?: number;
  _number_max?: number;
  _animate?: boolean;
  _attachImage?: boolean;
  _attachedImagePath?: string;
  _setAttachedImagePath?: (path: string) => void;
  _slider?: boolean;
  _slider_min?: number;
  _slider_max?: number;
  _slider_step?: number;
  _slider_values?: number[];
  _file_extensions?: string[];
  _string_placeholder?: string;
};

const Option = <T extends AllowedOptionTypes, K extends OptionStateType>(
  props: OptionProps<T, K>
) => {
  const Icon = (
    props.icon != null ? Icons[props.icon] : null
  ) as React.ElementType | null;

  const controls: Record<string, React.ReactNode> = {
    string: (
      <ControlStateString
        {...(props as any as OptionProps<OptionTypeString, string>)}
      />
    ),
    boolean: (
      <ControlStateBoolean
        {...(props as any as OptionProps<OptionTypeBoolean, boolean>)}
      />
    ),
    number: (
      <ControlStateNumber
        {...(props as any as OptionProps<OptionTypeNumber, number>)}
      />
    ),
    file: (
      <ControlStateFile
        {...(props as any as OptionProps<OptionTypeFile, string>)}
      />
    ),
    colour: (
      <ControlStateColours
        {...(props as any as OptionProps<OptionTypeColour, string>)}
      />
    ),
    slider: (
      <ControlStateSlider
        {...(props as any as OptionProps<OptionTypeSlider, number>)}
      />
    ),
  };

  return (
    <motion.div
      className="@container relative flex flex-col p-2.5 py-2 gap-0.5 w-[100%] bg-neutral-800/10 rounded-sm border-neutral-700/40 border-1 border-solid backdrop-blur-md"
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
      <div
        className={`flex ${
          props.type._a === "slider" ? "flex-col" : "flex-row items-center"
        } w-full h-full gap-1`}
      >
        <div className="flex flex-col w-full h-full">
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
        </div>

        <AnimatePresence>
          {controls[props.type._a] ?? (
            <div className="text-red-300/70 text-sm">
              Unsupported option type
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ControlStateBoolean = (
  props: OptionProps<OptionTypeBoolean, boolean>
) => {
  const [buttonHovered, setButtonHovered] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const textMeasureRef = useRef<HTMLSpanElement>(null);

  const niceFileName = (props._attachedImagePath ?? "")
    .replace(/\\/g, "/")
    .split("/")
    .pop();

  useEffect(() => {
    if (!textMeasureRef.current) return;
    setTextWidth(textMeasureRef.current.offsetWidth);
  }, [niceFileName]);

  const handleSetFile = async (location: string) => {
    if (location === props._attachedImagePath) return;
    props._setAttachedImagePath?.(location);
  };

  const handleFindLocation = async () => {
    const selectedPath = await open({
      directory: false,
      multiple: false,
      filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png"] }],
    });
    if (!selectedPath) return;

    console.log(selectedPath);

    if (Array.isArray(selectedPath)) {
      return handleSetFile(selectedPath[0]);
    }

    return handleSetFile(selectedPath);
  };

  return (
    <div className="min-w-7 h-7 rounded-sm flex flex-row items-center justify-center gap-1">
      {props._attachImage && (
        <div className="flex flex-row-reverse items-center gap-1.5">
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
            <Icons.IoDocument className="text-neutral-400 min-w-4" />
          </motion.div>
        </div>
      )}

      <div
        className={`flex items-center justify-center min-w-7 h-7 rounded-sm cursor-pointer border-1 border-solid active:scale-[0.98] backdrop-blur-lg ${
          props.state
            ? "bg-green-700/40 border-green-500/20 hover:bg-green-800/50"
            : "bg-neutral-800/50 border-neutral-500/20 hover:bg-neutral-800/20"
        }`}
        onClick={() => props.set(!props.state)}
      >
        {props.state ? (
          <Icons.IoCheckmarkSharp className="text-neutral-300" />
        ) : (
          <Icons.IoCloseSharp className="text-neutral-700" />
        )}
      </div>
    </div>
  );
};

const ControlStateString = (props: OptionProps<OptionTypeString, string>) => {
  const stringRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-row-reverse items-center gap-1.5 backdrop-blur-lg">
      <div
        onClick={() => {
          stringRef.current?.focus();
        }}
        className="flex items-center justify-center min-w-7 h-7 rounded-sm cursor-text border-1 border-solid backdrop-blur-lg active:bg-neutral-800/50 border-neutral-500/20 bg-neutral-800/20 text-sm px-1.5 font-light text-neutral-200"
      >
        <input
          ref={stringRef}
          type="text"
          className="bg-transparent outline-none w-full"
          value={props.state}
          onChange={(e) => props.set(e.target.value)}
          placeholder={props._string_placeholder ?? "String option"}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

const ControlStateColours = (props: OptionProps<OptionTypeColour, string>) => {
  return (
    <div className="w-max rounded-sm flex flex-row items-center justify-center gap-1 @max-sm:flex-wrap">
      {props._colour_options?.map((colour) => (
        <div
          key={colour}
          className={`min-w-7 h-7 rounded-sm cursor-pointer border-1 border-solid hover:bg-neutral-800/20 active:scale-[0.98] backdrop-blur-lg`}
          style={
            !props._colour_gradient
              ? {
                  backgroundColor:
                    colour === "#4f4f4f"
                      ? props.state === colour
                        ? "#ffffff40"
                        : "#ffffff20"
                      : `color-mix(in srgb, ${colour} ${
                          props.state === colour ? "50%" : "10%"
                        }, transparent 1%)`,
                  borderColor:
                    colour === "#4f4f4f" || colour === "#1f1f1f"
                      ? props.state === colour
                        ? "#ffffff20"
                        : "#ffffff10"
                      : `color-mix(in srgb, ${colour} ${
                          props.state === colour ? "50%" : "15%"
                        }, transparent 100%)`,
                }
              : {
                  backgroundImage: colour,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "transparent",
                  borderColor: "#2f2f2f",
                }
          }
          onClick={() => props.set(colour)}
        ></div>
      ))}
    </div>
  );
};

const ControlStateFile = (props: OptionProps<OptionTypeFile, string>) => {
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
    const selectedPath = await open({
      directory: props._file_extensions ? false : true,
      multiple: false,
      filters: props._file_extensions
        ? [{ name: "Files", extensions: props._file_extensions }]
        : [],
    });
    if (!selectedPath) return;

    if (Array.isArray(selectedPath)) {
      return handleSetFile(selectedPath[0]);
    }

    return handleSetFile(selectedPath);
  };

  return (
    <div className="flex flex-row-reverse items-center gap-1.5 backdrop-blur-lg">
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

        {props._file_extensions ? (
          <>
            <Icons.IoDocuments className="text-neutral-400 min-w-4" />
          </>
        ) : (
          <>
            <Icons.IoFolderOpenSharp className="text-neutral-400 min-w-4" />
          </>
        )}
      </motion.div>
    </div>
  );
};

type OmmitedOptionProps<
  T extends AllowedOptionTypes,
  K extends OptionStateType
> = Omit<OptionProps<T, K>, "type">;

const ControlStateNumber = (
  props: OmmitedOptionProps<OptionTypeNumber, number>
) => {
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

const ControlStateSlider = (
  props: OmmitedOptionProps<OptionTypeSlider, number>
) => {
  const [cachedValue, setCachedValue] = useState(props.state);

  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const usingMinimum = props._slider_min ?? 0;
  const usingMaximum = props._slider_max ?? 100;
  const usingStep = props._slider_step ?? usingMaximum / 100;
  const usingValues = props._slider_values ?? [];

  const position = Math.max(
    0,
    Math.min(1, (cachedValue - usingMinimum) / (usingMaximum - usingMinimum))
  );

  const handleResize = useCallback(() => {
    if (!sliderRef.current) return;
    setSliderWidth(sliderRef.current.offsetWidth);
  }, []);

  useEffect(() => {
    console.log("resize handler");

    if (!sliderRef.current) return;
    setSliderWidth(sliderRef.current.offsetWidth);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(sliderRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [sliderRef]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    setIsDragging(true);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = moveEvent.clientX - rect.left;
      const newPosition = Math.max(0, Math.min(1, x / (sliderWidth - 6)));

      let newValue = usingMinimum + newPosition * (usingMaximum - usingMinimum);
      if (usingValues.length > 0) {
        newValue = usingValues.reduce((prev, curr) =>
          Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev
        );
      } else {
        newValue = Math.round(newValue / usingStep) * usingStep;
      }

      setCachedValue(newValue);
    };

    const endDrag = () => {
      setIsDragging(false);
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerup", endDrag);
      target.releasePointerCapture(e.pointerId);
    };

    target.addEventListener("pointermove", handlePointerMove);
    target.addEventListener("pointerup", endDrag);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      props.set(cachedValue);
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [cachedValue]);

  type SliderSetValueProps = {
    value: number;
  };

  const SliderSetValue = (props: SliderSetValueProps) => {
    const position = Math.max(
      0,
      Math.min(1, (props.value - usingMinimum) / (usingMaximum - usingMinimum))
    );

    return (
      <motion.div
        className="absolute w-[2px] h-1.5 select-none pointer-events-none bg-neutral-600/70"
        style={{
          left: position * (sliderWidth - 2) - sliderWidth / 2,
        }}
      ></motion.div>
    );
  };

  return (
    <div className="relative py-1 w-full h-max">
      <div
        className="@container relative w-full h-1.5 bg-neutral-700/60 rounded-full flex items-center"
        ref={sliderRef}
      >
        <motion.div
          className="relative w-3 h-3 bg-neutral-600 rounded-full cursor-pointer ring-0 hover:ring-3 ring-neutral-700/60"
          initial={{ x: position * (sliderWidth - 6) }}
          animate={{
            x: position * (sliderWidth - 6),
          }}
          transition={{
            type: "tween",
            duration: 0.1,
          }}
          onPointerDown={onPointerDown}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => !isDragging && setShowTooltip(false)}
        >
          <AnimatePresence>
            {(showTooltip || isDragging) && (
              <motion.div
                className="absolute bg-neutral-800 text-neutral-300 font-semibold text-xs font-code rounded-xl px-2 py-0.5 flex items-center justify-center z-20"
                style={{
                  width: "max-content",
                  whiteSpace: "nowrap",
                  left: "-100%",
                  transform: "translateX(50%) translateY(-100%)",
                  top: "-1.5rem",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {cachedValue.toFixed(2)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {usingValues.length > 0 && (
          <div className="absolute inset-0 flex items-center pointer-events-none w-full px-1 overflow-hidden rounded-full">
            {usingValues.map((value, index) => (
              <SliderSetValue key={index} value={value} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BooleanOption = (
  props: OmmitedOptionProps<OptionTypeBoolean, boolean>
) => {
  return <Option {...props} type={{ _a: "boolean" }} />;
};

const StringOption = (props: OmmitedOptionProps<OptionTypeString, string>) => {
  return <Option {...props} type={{ _a: "string" }} />;
};

const NumberOption = (props: OmmitedOptionProps<OptionTypeNumber, number>) => {
  return <Option {...props} type={{ _a: "number" }} />;
};

const FileOption = (props: OmmitedOptionProps<OptionTypeFile, string>) => {
  return <Option {...props} _is_file_override type={{ _a: "file" }} />;
};

const ColourOption = (props: OmmitedOptionProps<OptionTypeColour, string>) => {
  return <Option {...props} type={{ _a: "colour" }} />;
};

const SliderOption = (props: OmmitedOptionProps<OptionTypeSlider, number>) => {
  return <Option {...props} _slider type={{ _a: "slider" }} />;
};

type OptionGroupProps = {
  title?: string;
  children: React.ReactNode;
  _first?: boolean;
  _last?: boolean;
  _hideBorder?: boolean;
  _animate?: boolean;
  _hideable?: boolean;
  _hiddenByDefault?: boolean;
  _row?: boolean;
  _overflow?: boolean;
};

const OptionGroup = (props: OptionGroupProps) => {
  const [open, set] = useState(props._hiddenByDefault ? false : true);

  return (
    <motion.div
      className={`relative flex ${
        props._row ? "flex-row @max-2xl:flex-col" : "flex-col"
      } gap-2 p-2.5 ${
        !props._hideBorder &&
        "border-neutral-700/40 border-b-[1px] border-solid"
      } py-3.5 ${props._last ? "pb-3" : ""} ${props._first ? "pt-2.5" : ""}
      ${props._overflow ? "overflow-y-auto" : ""}
      `}
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

export {
  OptionGroup,
  StringOption,
  BooleanOption,
  NumberOption,
  FileOption,
  ColourOption,
  SliderOption,
};
