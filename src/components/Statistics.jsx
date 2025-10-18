import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { Trophy, Users, Briefcase, Star, Zap, Code2, Cpu, Layers } from 'lucide-react';

const iconMap = {
  Briefcase,
  Users,
  Trophy,
  Star,
  Zap,
  Code2,
  Cpu,
  Layers
};

export default function Statistics({ stats = [] }) {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = iconMap[stat.icon] || Star;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full bg-background/50 backdrop-blur-sm border border-border flex items-center justify-center ${stat.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2.5} />
                </div>
                <div className="text-muted-foreground text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

