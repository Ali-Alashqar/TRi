import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Users, BookOpen, Globe, Lightbulb } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import SEO from '../components/SEO';

const iconMap = {
  'Team Spirit': Users,
  'Learning Culture': BookOpen,
  'Global Impact': Globe,
  'Creative Freedom': Lightbulb
};

export default function JoinPage({ data, apiUrl }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    message: '',
    link: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Map form data to match the schema
      const submissionData = {
        name: formData.name,
        email: formData.email,
        projectName: formData.title,
        description: `Phone: ${formData.phone}\n\n${formData.message}`,
        links: formData.link ? [formData.link] : []
      };

      const response = await fetch(`${apiUrl}/api/project-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        toast({
          title: 'Project submitted!',
          description: 'Thank you for sharing your project idea with us. We\'ll review it and get back to you soon.',
        });
        setFormData({ name: '', email: '', phone: '', title: '', message: '', link: '' });
      } else {
        throw new Error('Failed to submit project');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit project. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Join Us - TechNest"
        description="Join the TechNest team and be part of creating next-generation gaming experiences. Explore career opportunities and submit your project."
        keywords="careers, join TechNest, game development jobs, work with us, team opportunities"
      />
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{data.hero.title}</h1>
          <p className="text-2xl text-primary">{data.hero.subtitle}</p>
        </motion.div>

        {/* Why Join Us Section */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Why Join Us
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.whyJoinUs.map((item, index) => {
              const Icon = iconMap[item.title] || Users;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Project Submission Form Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-4">Submit Your Project Idea</h2>
            <p className="text-center text-muted-foreground mb-12">
              Have a game or project idea? Share it with us! We're always looking for innovative concepts to collaborate on.
            </p>

            <div className="bg-card border border-border rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="bg-background"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-background"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-background"
                    placeholder="My Awesome Game Idea"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Description <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="bg-background resize-none"
                    placeholder="Tell us about your project idea, gameplay mechanics, target audience, and what makes it unique..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Link (Optional)
                  </label>
                  <Input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="bg-background"
                    placeholder="https://example.com/project-demo"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Share a link to your project demo, portfolio, or any relevant materials
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Project Idea'}
                </Button>
              </form>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
    </>
  );
}

