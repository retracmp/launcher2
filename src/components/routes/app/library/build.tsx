import { useOptions } from "src/wrapper/options";
import FortniteBuildTile from "src/components/routes/app/library/tiled";
import FortniteBuildList from "src/components/routes/app/library/list";

type FortniteBuildProps = {
  entry: LibraryEntry;
};

const FortniteBuild = (props: FortniteBuildProps) => {
  const options = useOptions();

  if (options.tiled_builds) return <FortniteBuildTile entry={props.entry} />;
  return <FortniteBuildList entry={props.entry} />;
};

export default FortniteBuild;
