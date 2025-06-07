import { useHover } from "src/wrapper/hover";
import { motion, AnimatePresence } from "motion/react";

const HoverManager = () => {
  const hover = useHover();

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <AnimatePresence>
        {Object.values(hover.nodes).map((node) => {
          if (!node) return null;
          return (
            <motion.div
              key={node.id}
              className="absolute z-50 pointer-events-none min-w-max min-h-max"
              style={
                {
                  // transformOrigin:
                  //   node.direction === "RIGHT" ? "center left" : "center right",
                }
              }
              initial={{
                x: node.x,
                y: node.y,
                opacity: 0.8,
                scale: 0.95,
              }}
              animate={{
                x: node.x,
                y: node.y,
                opacity: 1,
                scale: 1,
              }}
              exit={{
                x: node.x,
                y: node.y,
                scale: 0.7,
                opacity: 0,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 21 }}
            >
              {node.node}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default HoverManager;
