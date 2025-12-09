import { useOptions } from "src/wrapper/options";
import { SimpleUI } from "src/import/ui";

const FallingSnow = () => {
  const options = useOptions();
  if (!options.enable_snow) return;

  const show_snow =
    new Date() >= new Date(new Date().getFullYear(), 11, 1) &&
    new Date() <= new Date(new Date().getFullYear(), 11, 31);
  if (!show_snow) return null;

  return (
    <SimpleUI.FallingElements
      density={options.snow_particles}
      element={() => (
        <SimpleUI.FallingElementContainer
          element={() => (
            <div className="w-full h-full bg-white rounded-full"></div>
          )}
          size_scale_min={0.1}
          size_scale_max={0.5}
        />
      )}
    />
  );
};

export default FallingSnow;
