import { LucideMouse} from "lucide-react";
import { motion } from "framer-motion";

export const MouseAnimation = () => {
  return (
    <motion.div
      className="mt-5 relative w-12 h-12"
      animate={{
        x: [0, 20, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="absolute"
        animate={{
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <LucideMouse className="w-12 h-12 text-white" />
      </motion.div>
    </motion.div>
  );
};