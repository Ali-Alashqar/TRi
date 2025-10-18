import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import GlassCard from './GlassCard';

export default function BlogSection() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch blog posts from API
    fetch(`${window.location.origin}/api/blog`)
      .then(res => res.json())
      .then(data => {
        // Show only the latest 3 posts
        setPosts(data.slice(0, 3));
      })
      .catch(err => console.error('Error fetching blog posts:', err));
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Newspaper className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Latest Updates</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            News & Insights
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with the latest news, development insights, and community stories
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to="/blog">
                <GlassCard className="h-full group cursor-pointer">
                {/* Image */}
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                      {post.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.ceil((post.content?.split(' ').length || 0) / 200)} min read
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Read More */}
                  <Button variant="ghost" className="w-full group/btn">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/blog">
            <Button size="lg" variant="outline">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

