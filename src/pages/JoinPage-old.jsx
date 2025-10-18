import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Users, BookOpen, Globe, Lightbulb } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const iconMap = {
  'Team Spirit': Users,
  'Learning Culture': BookOpen,
  'Global Impact': Globe,
  'Creative Freedom': Lightbulb
};

export default function JoinPage({ data, apiUrl }) {
  const { toast } = useToast();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = (position) => {
    setSelectedPosition(position);
    setFormData({ ...formData, role: position.title });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/api/join/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: 'Application submitted!',
          description: 'We\'ll review your application and get back to you soon.',
        });
        setFormData({ name: '', email: '', role: '', message: '' });
        setSelectedPosition(null);
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

        {/* Open Positions Section */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Open Positions
          </motion.h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {data.positions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2">{position.title}</h3>
                    <p className="text-muted-foreground mb-2">{position.description}</p>
                    <p className="text-sm text-primary">{position.requirements}</p>
                  </div>
                  <Button
                    onClick={() => handleApply(position)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Apply Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Application Modal */}
        <Dialog open={!!selectedPosition} onOpenChange={() => setSelectedPosition(null)}>
          <DialogContent className="max-w-2xl">
            {selectedPosition && (
              <>
                <DialogHeader>
                  <DialogTitle>Apply for {selectedPosition.title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <Input
                      type="text"
                      value={formData.role}
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cover Letter / Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="bg-background resize-none"
                      placeholder="Tell us why you'd be a great fit..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

