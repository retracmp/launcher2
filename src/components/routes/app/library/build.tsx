import { useOptions } from "src/wrapper/options";
import FortniteBuildTile from "src/components/routes/app/library/tiled";
import FortniteBuildList from "src/components/routes/app/library/list_item";

type FortniteBuildProps = {
  entry: LibraryEntry;
};

const FortniteBuild = (props: FortniteBuildProps) => {
  const options = useOptions();

  if (options._tiled_builds) return <FortniteBuildTile entry={props.entry} />;
  return <FortniteBuildList entry={props.entry} />;
};

export default FortniteBuild;
