import { motion } from "motion/react";
import UI from "src/components/core/default";
import NumberFlow from "@number-flow/react";

const PLAYLIST_LOOKUP = {
  playlist_showdownalt_solo_enablelategame: "Solo Lategame Arena",
  playlist_showdownalt_solo: "Solo Arena",
  playlist_showdown_solo: "Solo Tournament",
  playlist_vamp_solo: "Solo Lategame",
  playlist_defaultsolo: "Solo",

  playlist_showdownalt_duos_enablelategame: "Duos Lategame Arena",
  playlist_showdownalt_duos: "Duos Arena",
  playlist_showdown_duos: "Duos Tournament",
  playlist_vamp_duo: "Duos Lategame",
  playlist_defaultduo: "Duos",

  playlist_showdownalt_trios_enablelategame: "Trios Lategame Arena",
  playlist_showdownalt_trios: "Trios Arena",
  playlist_showdown_trios: "Trios Tournament",
  playlist_vamp_trio: "Trios Lategame",
  playlist_defaulttrio: "Trios",

  playlist_showdownalt_squads_enablelategame: "Squads Lategame Arena",
  playlist_showdownalt_squads: "Squads Arena",
  playlist_showdown_squads: "Squads Tournament",
  playlist_vamp_squads: "Squads Lategame",
  playlist_defaultsquad: "Squads",

  playlist_arseniccore_solo_maxfog: "Retracmares Solo",
  playlist_arseniccore_duos_maxfog: "Retracmares Duos",
  playlist_arseniccore_squads_maxfog: "Retracmares Squads",
  playlist_arseniccore_solo_minfog: "Retracmares Solo",
  playlist_arseniccore_duos_minfog: "Retracmares Duos",
  playlist_arseniccore_squads_minfog: "Retracmares Squads",
  playlist_arseniccore_solo: "Retracmares Solo",
  playlist_arseniccore_duos: "Retracmares Duos",
  playlist_arseniccore_squads: "Retracmares Squads",

  playlist_gg_solo: "Arsenal Solo",
  playlist_gg_duo: "Arsenal Duos",
  playlist_gg_squad: "Arsenal Squads",
};

const STATUS_LOOKUP = {
  0: "LOADING",
  1: "WAITING FOR GAME",
  2: "AWAITING BUS",
  3: "AWAITING BUS",
  4: "INGAME",
};

const calculate_name = (server: Match) => {
  const bucketIdParts = server.bucket_id.split(":");
  const playlist = bucketIdParts[bucketIdParts.length - 1].toLowerCase();
  return PLAYLIST_LOOKUP[playlist as keyof typeof PLAYLIST_LOOKUP] ?? playlist;
};

type ServerRenderedProps = {
  server: Match;
};

const ServerRendered = (props: ServerRenderedProps) => {
  const bucket = props.server.bucket_id.split(":");
  if (bucket[1] !== "0") return null;

  const gradient =
    props.server.alivecount <= 5
      ? "linear-gradient(90deg, #ef709b60, #ff5858 100%)"
      : "linear-gradient(90deg, #007bf720, #6f7bf7 100%)";

  return (
    <motion.div
      key={props.server.id}
      className="group relative min-h-max border-neutral-700/20 bg-neutral-700/10 backdrop-blur-2xl border-[1px] border-solid rounded-sm overflow-hidden p-2 gap-[0.125rem] flex flex-col"
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 19 }}
    >
      <motion.div
        className="absolute top-0 right-0 h-full z-10 border-blue-400/10 opacity-10"
        initial={{ width: 0 }}
        animate={{
          width: `${Math.round(
            ((props.server.maxplayercount - props.server.alivecount) /
              props.server.maxplayercount) *
              100
          )}%`,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 19 }}
        style={{
          backgroundImage:
            "linear-gradient(to right, #6f7bf7 0%, #05df72 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 400%)",
          backgroundSize: "200% 100%",
        }}
      ></motion.div>

      <UI.H1 className="flex flex-row items-center gap-1">
        {calculate_name(props.server)}{" "}
        <span className="text-[16px] font-[800] text-neutral-500">
          • {STATUS_LOOKUP[props.server.status as keyof typeof STATUS_LOOKUP]}
        </span>
      </UI.H1>
      <div className="h-1 rounded-full my-0.5 bg-red-50/10 w-full overflow-hidden transition-all duration-100">
        <motion.div
          className="h-full backdrop-blur-lg rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${Math.round(
              (props.server.alivecount / props.server.maxplayercount) * 100
            )}%`,
          }}
          style={{
            backgroundImage: gradient,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 21 }}
        ></motion.div>
      </div>
      <UI.P className="text-neutral-500 text-[12px]">
        <span className="font-[600]">{props.server.region}</span> •{" "}
        {props.server.id}
      </UI.P>

      <div className="absolute top-2 right-2 flex flex-row gap-1">
        <div className="bg-[#292929] backdrop-blur-lg transition-opacity duration-50 rounded-xl p-1.5 py-0.5 flex flex-row items-center gap-1">
          <UI.P className="text-[12px] flex flex-row items-center gap-1 text-neutral-400">
            <span className="font-semibold text-neutral-300">
              <NumberFlow
                className="max-h-[15px]"
                value={Math.min(
                  props.server.alivecount || 0,
                  props.server.maxplayercount
                )}
              />
            </span>
            <span className="">players left</span>
          </UI.P>
        </div>

        <div className="bg-[#292929] backdrop-blur-lg transition-opacity duration-50 rounded-xl p-1.5 py-0.5 flex flex-row items-center gap-1">
          <UI.P className="text-[12px] flex flex-row items-center gap-0.5 text-neutral-400">
            <span className="font-semibold text-neutral-300">
              <NumberFlow
                className="max-h-[15px]"
                value={Math.min(
                  props.server.playercount || 0,
                  props.server.maxplayercount
                )}
              />
            </span>
            /<span className="">{props.server.maxplayercount}</span>
          </UI.P>
        </div>
      </div>
    </motion.div>
  );
};

const NoServers = () => {
  return (
    <motion.div
      key={"no-servers"}
      className="group relative min-h-max border-neutral-700/40 bg-neutral-800/10 backdrop-blur-2xl border-[1px] border-solid rounded-sm overflow-hidden p-2 gap-[0.125rem] flex flex-col"
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 19 }}
    >
      <UI.P className="text-neutral-500">
        There are currently no servers in this state.
      </UI.P>
    </motion.div>
  );
};

export { NoServers };
export default ServerRendered;
