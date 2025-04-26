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
              id={node.id}
              className="absolute z-50 pointer-events-none min-w-max min-h-max"
              style={{
                transformOrigin: "center left",
              }}
              initial={{
                x: node.x,
                y: node.y,
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                x: node.x,
                y: node.y,
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              exit={{
                x: node.x,
                y: node.y,
                opacity: 0,
              }}
              transition={{
                duration: 0.1,
                type: "spring",
                stiffness: 500,
                damping: 24.5,
              }}
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
