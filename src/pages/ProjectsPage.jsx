import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { ExternalLink, Play, Download, Video, Star, Share2, Search, Filter, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import SEO from '../components/SEO';

export default function ProjectsPage({ projects }) {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [ratings, setRatings] = useState({});
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingForm, setRatingForm] = useState({ userName: '', userEmail: '' });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxMedia, setLightboxMedia] = useState([]);

  const filters = ['All', '2D', '3D', 'VR', 'Mobile', 'Web'];

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'All' || p.type === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleShare = (project) => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied!', description: 'Project link copied to clipboard' });
    }
  };

  const handleRateClick = (projectId, rating) => {
    // Check if user already rated this project
    const ratedProjects = JSON.parse(localStorage.getItem('ratedProjects') || '[]');
    if (ratedProjects.includes(projectId)) {
      toast({ 
        title: 'Already rated', 
        description: 'You have already rated this project',
        variant: 'destructive'
      });
      return;
    }
    setSelectedRating(rating);
    setShowRatingDialog(true);
  };

  const handleSubmitRating = async () => {
    if (!ratingForm.userName || !ratingForm.userEmail) {
      toast({ 
        title: 'Missing information', 
        description: 'Please enter your name and email',
        variant: 'destructive'
      });
      return;
    }

    const projectId = selectedProject._id || selectedProject.id;
    
    try {
      const response = await fetch(`${window.location.origin}/api/projects/${projectId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rating: selectedRating,
          userName: ratingForm.userName,
          userEmail: ratingForm.userEmail
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRatings({ ...ratings, [projectId]: selectedRating });
        
        // Mark as rated in localStorage
        const ratedProjects = JSON.parse(localStorage.getItem('ratedProjects') || '[]');
        ratedProjects.push(projectId);
        localStorage.setItem('ratedProjects', JSON.stringify(ratedProjects));
        
        toast({ 
          title: 'Thank you!', 
          description: `You rated this project ${selectedRating} stars` 
        });
        
        setShowRatingDialog(false);
        setRatingForm({ userName: '', userEmail: '' });
        
        // Refresh projects to get updated ratings
        window.location.reload();
      } else {
        toast({ 
          title: 'Error', 
          description: data.error || 'Failed to submit rating',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to submit rating. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getRelatedProjects = (currentProject) => {
    return projects
      .filter(p => p.id !== currentProject.id && p.type === currentProject.type)
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <SEO 
        title="Our Projects - TechNest"
        description="Explore our portfolio of immersive gaming experiences across 2D, 3D, VR, Mobile, and Web platforms"
        keywords="game projects, TechNest portfolio, indie games, VR games, mobile games"
      />
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-center mb-8"
        >
          Our Projects
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
        >
          Explore our portfolio of immersive gaming experiences
        </motion.p>

        {/* Search Bar - NEW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search projects by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card border-border"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          {filters.map(f => (
            <Button
              key={f}
              onClick={() => setFilter(f)}
              variant={filter === f ? 'default' : 'outline'}
              className={filter === f ? 'bg-primary text-primary-foreground' : 'border-border hover:border-primary'}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Projects Grid - Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-2xl hover:shadow-primary/20"
              onClick={() => setSelectedProject(project)}
            >
              {/* Image Container with Enhanced Effects */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500 ease-out"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="bg-primary/90 backdrop-blur-sm p-3 rounded-full">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                    <span className="text-white text-sm font-semibold">View Details</span>
                  </motion.div>
                </div>
                
                {/* Rating Badge - Enhanced */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-primary to-secondary backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                  <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
                  <span className="text-xs font-bold text-white">
                    {project.ratings?.average ? project.ratings.average.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-xs text-white/80">({project.ratings?.count || 0})</span>
                </div>
                
                {/* Type Badge - Enhanced */}
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Badge variant="outline" className="border-primary text-primary text-xs font-semibold">
                    {project.type}
                  </Badge>
                </div>
              </div>
              
              {/* Content Container */}
              <div className="p-6 space-y-4">
                {/* Title and Share */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(project);
                    }}
                    className="h-8 w-8 p-0 flex-shrink-0 hover:bg-primary/10"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Description */}
                <p className="text-muted-foreground text-sm line-clamp-2 group-hover:text-foreground transition-colors">{project.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full text-primary font-medium">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-xs px-2.5 py-1 bg-muted rounded-full text-muted-foreground font-medium">+{project.tags.length - 3}</span>
                  )}
                </div>
                
                {/* Footer with CTA */}
                <div className="pt-2 border-t border-border/50">
                  <Button 
                    onClick={() => setSelectedProject(project)}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-white font-semibold"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Project
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground">No projects found</p>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filter</p>
          </div>
        )}

        {/* Project Detail Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedProject && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-3xl">{selectedProject.title}</DialogTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleShare(selectedProject)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </DialogHeader>
                <div className="space-y-6">
                  <img
                    src={selectedProject.coverUrl}
                    alt={selectedProject.title}
                    className="w-full rounded-lg"
                  />

                  {/* Media Gallery - Enhanced with Lightbox */}
                  {selectedProject.mediaGallery && selectedProject.mediaGallery.length > 0 && (
                    <div className="border-t border-border pt-6">
                      <h4 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Gallery</span>
                        <span className="text-sm font-normal text-muted-foreground">({selectedProject.mediaGallery.length} items)</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {selectedProject.mediaGallery.map((media, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
                            onClick={() => {
                              setLightboxMedia(selectedProject.mediaGallery);
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
                                <div className="absolute top-3 right-3 bg-secondary/90 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full text-xs font-semibold text-secondary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
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
                  
                  {/* Rating Section - NEW */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold mb-1">Rate this project</h4>
                        <p className="text-sm text-muted-foreground">Help others discover great games</p>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateClick(selectedProject.id, star)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= (ratings[selectedProject.id] || 0)
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedProject.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Key Features</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {selectedProject.features.map(feature => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map(tech => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Release Date</h4>
                    <p className="text-muted-foreground">
                      {new Date(selectedProject.releaseDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Available On</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.platforms.map(platform => (
                        <Button key={platform} variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {platform}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {(selectedProject.downloadLink || selectedProject.videoLink) && (
                    <div className="flex gap-4 pt-4 border-t border-border">
                      {selectedProject.downloadLink && (
                        <Button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedProject.downloadLink;
                            link.download = selectedProject.title + '-download';
                            if (selectedProject.downloadLink.startsWith('http')) {
                              window.open(selectedProject.downloadLink, '_blank');
                            } else {
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                            toast({ title: 'Download Started', description: 'Your file download has started' });
                          }}
                          className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Now
                        </Button>
                      )}
                      {selectedProject.videoLink && (
                        <Button 
                          onClick={() => window.open(selectedProject.videoLink, '_blank')}
                          variant="outline" 
                          className="flex-1 border-primary text-primary hover:bg-primary/10 font-semibold"
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Watch Trailer
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Related Projects - NEW */}
                  {getRelatedProjects(selectedProject).length > 0 && (
                    <div className="border-t border-border pt-6">
                      <h4 className="font-semibold mb-4">You might also like</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {getRelatedProjects(selectedProject).map((relatedProject) => (
                          <div
                            key={relatedProject.id}
                            className="cursor-pointer group"
                            onClick={() => setSelectedProject(relatedProject)}
                          >
                            <div className="aspect-video rounded-lg overflow-hidden mb-2">
                              <img
                                src={relatedProject.thumbnailUrl}
                                alt={relatedProject.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <h5 className="text-sm font-semibold group-hover:text-primary transition-colors">
                              {relatedProject.title}
                            </h5>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Rating Dialog */}
        <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rate this Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 ${
                      star <= selectedRating
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name</label>
                <Input
                  placeholder="Enter your name"
                  value={ratingForm.userName}
                  onChange={(e) => setRatingForm({ ...ratingForm, userName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={ratingForm.userEmail}
                  onChange={(e) => setRatingForm({ ...ratingForm, userEmail: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowRatingDialog(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSubmitRating}>
                  Submit Rating
                </Button>
              </div>
            </div>
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
    </div>
  );
}

