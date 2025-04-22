import * as Icons from "react-icons/io5";

type OptionProps<T> = {
  title: React.ReactNode;
  description: React.ReactNode;
  state: T;
  set: (state: T) => void;
  icon?: keyof typeof Icons;
  colour?: "red" | "blue" | "green" | "yellow" | "pink" | "purple" | "orange";
};

const Option = <T,>(props: OptionProps<T>) => {
  const Icon = (props.icon ? Icons[props.icon] : <></>) as React.ElementType;

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
    </div>
  );
};

const StringOption = (props: OptionProps<string>) => {
  return <Option {...props} />;
};

const BooleanOption = (props: OptionProps<boolean>) => {
  return <Option {...props} />;
};

export { StringOption, BooleanOption };
