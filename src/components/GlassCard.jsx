import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function GlassCard({ children, className, hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative backdrop-blur-xl bg-background/40 border border-white/10",
        "rounded-2xl p-6 shadow-2xl",
        "before:absolute before:inset-0 before:rounded-2xl",
        "before:bg-gradient-to-br before:from-white/10 before:to-transparent",
        "before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

