import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Gamepad2, Glasses, Palette, Rocket, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import HeroModern from '../components/HeroModern';
import GlassCard from '../components/GlassCard';
import FeaturedProjects from '../components/FeaturedProjects';
import BlogSection from '../components/BlogSection';
import ScrollProgress from '../components/ScrollProgress';
import Statistics from '../components/Statistics';
import Testimonials from '../components/Testimonials';
import Technologies from '../components/Technologies';
import LiveVisitorCounter from '../components/LiveVisitorCounter';
import { useEffect, useState } from 'react';

const iconMap = {
  Gamepad2,
  Glasses,
  Palette,
  Rocket
};

export default function HomePage({ data }) {
  const [projects, setProjects] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    // Fetch all data
    fetch(`${window.location.origin}/api/data`)
      .then(res => res.json())
      .then(siteData => {
        if (siteData.projects) {
          setProjects(siteData.projects);
        }
        if (siteData.statistics) {
          setStatistics(siteData.statistics);
        }
        if (siteData.testimonials) {
          setTestimonials(siteData.testimonials);
        }
        if (siteData.technologies) {
          setTechnologies(siteData.technologies);
        }
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <LiveVisitorCounter />
      <SEO 
        title="TechNest - Immersive Gaming Experiences"
        description="Creating next-generation gaming experiences with cutting-edge technology. Explore our portfolio of immersive games and interactive experiences."
        keywords="game development, immersive gaming, VR games, AR experiences, interactive entertainment, TechNest"
      />

      {/* Hero Section - Enhanced */}
      <HeroModern hero={data.hero} />

      {/* What We Do Section - Enhanced with Glass Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            What We Do
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.whatWeDo.map((item, index) => {
              const Icon = iconMap[item.icon] || Gamepad2;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="h-full p-6 hover:scale-105 transition-transform duration-300">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {statistics.length > 0 && <Statistics stats={statistics} />}

      {/* Featured Projects Section */}
      {projects.length > 0 && (
        <FeaturedProjects projects={projects} />
      )}

      {/* Technologies Section */}
      {technologies.length > 0 && <Technologies technologies={technologies} />}

      {/* Vision Section - Enhanced */}
      <section className="py-20 px-4 bg-card/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            {data.vision.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            {data.vision.text}
          </motion.p>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && <Testimonials testimonials={testimonials} />}

      {/* Blog Section */}
      <BlogSection />

      {/* Partners Section - Enhanced */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Our Partners
          </motion.h2>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {data.partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
              >
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-16 object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

