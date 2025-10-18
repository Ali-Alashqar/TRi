import { motion } from 'framer-motion';
import { Star, Quote, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';

export default function Testimonials({ testimonials = [] }) {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    company: '',
    rating: 5,
    testimonial: ''
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.role || !formData.testimonial) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(`${window.location.origin}/api/testimonials/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Thank you!',
          description: data.message || 'Your testimonial has been submitted for review'
        });
        setShowDialog(false);
        setFormData({
          name: '',
          email: '',
          role: '',
          company: '',
          rating: 5,
          testimonial: ''
        });
      } else {
        throw new Error(data.error || 'Failed to submit');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit testimonial. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied clients
          </p>
          <div className="mt-6">
            <Button onClick={() => setShowDialog(true)} size="lg">
              <MessageSquare className="mr-2 h-5 w-5" />
              Share Your Experience
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {testimonial.text}
              </p>
              
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full bg-primary/10"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial Submission Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Share Your Experience</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Your Name *</label>
                <Input
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Your Email *</label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Your Role *</label>
                <Input
                  placeholder="CEO, Product Manager, etc."
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Company (Optional)</label>
                <Input
                  placeholder="Company name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Rating *</label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= formData.rating
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Your Testimonial *</label>
                <Textarea
                  placeholder="Tell us about your experience working with us..."
                  value={formData.testimonial}
                  onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  Submit Testimonial
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

