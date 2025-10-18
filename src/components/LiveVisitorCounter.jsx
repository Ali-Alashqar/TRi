import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, Globe, X, Eye } from 'lucide-react';

export default function LiveVisitorCounter() {
  const [stats, setStats] = useState({
    currentVisitors: 0,
    totalToday: 0,
    totalVisitors: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Fetch initial stats
    fetchStats();

    // Update every 5 seconds
    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${window.location.origin}/api/visitors/live-stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching live stats:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-2xl hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Toggle visitor stats"
      >
        <div className="relative">
          <Eye className="h-6 w-6" />
          {/* Live indicator */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-primary-foreground"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Visitor count badge */}
          <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {stats.currentVisitors}
          </div>
        </div>
      </motion.button>

      {/* Stats Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-[320px]"
            >
              <div className="bg-card/95 backdrop-blur-lg border border-border rounded-2xl shadow-2xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Users className="h-5 w-5 text-primary" />
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.8, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    <span className="font-semibold text-sm">Live Visitors</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="space-y-3">
                  {/* Current Visitors - Main Stat */}
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-3 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Online Now</div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={stats.currentVisitors}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="text-3xl font-bold text-primary"
                          >
                            {stats.currentVisitors}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Today's Visitors */}
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Today</div>
                        <div className="text-sm font-semibold">{stats.totalToday}</div>
                      </div>
                    </div>
                  </div>

                  {/* Total Visitors */}
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Globe className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">All Time</div>
                        <div className="text-sm font-semibold">{stats.totalVisitors.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Last Updated Indicator */}
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <motion.div
                      className="w-1.5 h-1.5 bg-green-500 rounded-full"
                      animate={{
                        opacity: [1, 0.3, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <span>Updates every 5s</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

