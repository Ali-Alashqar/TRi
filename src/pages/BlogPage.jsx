import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, X, Clock, Video, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '../components/ui/dialog';
import SEO from '../components/SEO';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxMedia, setLightboxMedia] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${window.location.origin}/api/blog`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const getFilteredPosts = () => {
    if (filter === 'all') return posts;
    return posts.filter(p => p.category === filter);
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Blog & News - TechNest"
        description="Stay updated with the latest news, development insights, and community stories from TechNest"
      />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4"
          >
            Blog & News
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Stay updated with the latest news, development insights, and community stories
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 border-b border-border">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full transition-all ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card hover:bg-muted border border-border'
              }`}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  filter === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card hover:bg-muted border border-border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => handlePostClick(post)}
              >
                {post.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl text-muted-foreground">No posts found</p>
            </div>
          )}
        </div>
      </section>

      {/* Post Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedPost && (
            <div>
              {/* Header Image */}
              {selectedPost.image && (
                <div className="relative h-64 md:h-96 overflow-hidden">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                    {selectedPost.category}
                  </div>
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              
              {/* Content */}
              <div className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {selectedPost.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span className="font-medium">{selectedPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(selectedPost.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{Math.ceil(selectedPost.content.split(' ').length / 200)} min read</span>
                  </div>
                </div>
                
                <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                  {selectedPost.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Media Gallery - Enhanced */}
                {selectedPost.mediaGallery && selectedPost.mediaGallery.length > 0 && (
                  <div className="mb-8 border-t border-border pt-8">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Media Gallery</span>
                      <span className="text-sm font-normal text-muted-foreground">({selectedPost.mediaGallery.length} items)</span>
                    </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {selectedPost.mediaGallery.map((media, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
                          onClick={() => {
                            setLightboxMedia(selectedPost.mediaGallery);
                            setLightboxIndex(index);
                            setLightboxOpen(true);
                          }}
                        >
                          {media.type === 'image' ? (
                            <div className="relative aspect-video overflow-hidden bg-muted">
                              <img
                                src={media.url}
                                alt={media.caption || `Gallery image ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                Image {index + 1}
                              </div>
                            </div>
                          ) : (
                            <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group">
                              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
                              <div className="relative z-10">
                                <div className="bg-primary/20 backdrop-blur-md rounded-full p-4 md:p-6 mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                                  <Video className="h-8 w-8 md:h-12 md:w-12 text-primary" />
                                </div>
                                <p className="text-xs md:text-sm font-medium text-center">Video Content</p>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="transform scale-75 group-hover:scale-100 transition-transform">
                                  <div className="bg-primary rounded-full p-3 md:p-4 shadow-lg shadow-primary/50">
                                    <Play className="h-6 w-6 md:h-8 md:w-8 text-primary-foreground fill-current" />
                                  </div>
                                </div>
                              </div>
                              <div className="absolute top-3 right-3 bg-secondary/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-secondary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                Video {index + 1}
                              </div>
                            </div>
                          )}
                          {media.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent text-white p-3 md:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              <p className="text-xs md:text-sm font-medium line-clamp-2">{media.caption}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="pt-6 border-t border-border">
                    <h3 className="text-sm font-semibold mb-3">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          <Tag size={14} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox for Media Gallery */}
      {lightboxOpen && lightboxMedia.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 md:p-3 transition-all"
          >
            <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>

          {/* Previous Button */}
          {lightboxMedia.length > 1 && (
            <button
              onClick={() => setLightboxIndex((lightboxIndex - 1 + lightboxMedia.length) % lightboxMedia.length)}
              className="absolute left-2 md:left-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 md:p-3 transition-all"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </button>
          )}

          {/* Next Button */}
          {lightboxMedia.length > 1 && (
            <button
              onClick={() => setLightboxIndex((lightboxIndex + 1) % lightboxMedia.length)}
              className="absolute right-2 md:right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 md:p-3 transition-all"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </button>
          )}

          {/* Media Content */}
          <div className="w-full max-w-6xl max-h-[90vh] flex flex-col items-center justify-center">
            {lightboxMedia[lightboxIndex].type === 'image' ? (
              <img
                src={lightboxMedia[lightboxIndex].url}
                alt={lightboxMedia[lightboxIndex].caption || `Image ${lightboxIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            ) : (
              <div className="w-full aspect-video max-h-[80vh]">
                <iframe
                  src={lightboxMedia[lightboxIndex].url}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}
            
            {/* Caption */}
            {lightboxMedia[lightboxIndex].caption && (
              <div className="mt-4 text-center">
                <p className="text-white text-sm md:text-base">{lightboxMedia[lightboxIndex].caption}</p>
              </div>
            )}
            
            {/* Counter */}
            <div className="mt-4 text-white/70 text-xs md:text-sm">
              {lightboxIndex + 1} / {lightboxMedia.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

