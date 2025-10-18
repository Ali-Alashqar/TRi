import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Download, Play, Calendar, Monitor, Star } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function ProjectsPageEnhanced() {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${apiUrl}/api/projects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Error:', err));
  }, [apiUrl]);

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Search
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.type === selectedType);
    }

    // Platform filter
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(p => 
        p.platforms?.some(platform => 
          platform.toLowerCase().includes(selectedPlatform.toLowerCase())
        )
      );
    }

    // Sort
    if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.releaseDate || b.createdAt) - new Date(a.releaseDate || a.createdAt)
      );
    } else if (sortBy === 'oldest') {
      filtered = [...filtered].sort((a, b) => 
        new Date(a.releaseDate || a.createdAt) - new Date(b.releaseDate || b.createdAt)
      );
    } else if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [projects, searchQuery, selectedType, selectedPlatform, sortBy]);

  const projectTypes = ['all', ...new Set(projects.map(p => p.type).filter(Boolean))];
  const platforms = ['all', 'PC', 'PlayStation', 'Xbox', 'Mobile', 'Switch'];

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Our Projects
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our portfolio of immersive gaming experiences
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-card border rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Type</label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Platform</label>
                      <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map(platform => (
                            <SelectItem key={platform} value={platform}>
                              {platform}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Sort By</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="name">Name (A-Z)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found</span>
              {(searchQuery || selectedType !== 'all' || selectedPlatform !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedPlatform('all');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group relative bg-card rounded-xl overflow-hidden border hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.thumbnailUrl || 'https://via.placeholder.com/400x225?text=No+Image'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Type Badge */}
                    {project.type && (
                      <Badge className="absolute top-2 right-2">
                        {project.type}
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Platforms */}
                    {project.platforms && project.platforms.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Monitor className="h-3 w-3" />
                        <span>{project.platforms.join(', ')}</span>
                      </div>
                    )}

                    {/* Release Date */}
                    {project.releaseDate && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(project.releaseDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedPlatform('all');
              }}>
                Clear all filters
              </Button>
            </motion.div>
          )}
        </div>

        {/* Project Detail Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-3xl">{selectedProject.title}</DialogTitle>
                </DialogHeader>
                
                {/* Cover Image */}
                {selectedProject.coverUrl && (
                  <img
                    src={selectedProject.coverUrl}
                    alt={selectedProject.title}
                    className="w-full rounded-lg"
                  />
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {selectedProject.downloadLink && (
                    <Button asChild className="flex-1">
                      <a href={selectedProject.downloadLink} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download Game
                      </a>
                    </Button>
                  )}
                  {selectedProject.videoLink && (
                    <Button asChild variant="outline" className="flex-1">
                      <a href={selectedProject.videoLink} target="_blank" rel="noopener noreferrer">
                        <Play className="mr-2 h-4 w-4" />
                        Watch Trailer
                      </a>
                    </Button>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedProject.description}</p>
                  </div>

                  {/* Features */}
                  {selectedProject.features && selectedProject.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Features</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedProject.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies */}
                  {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech, i) => (
                          <Badge key={i} variant="secondary">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Platforms */}
                  {selectedProject.platforms && selectedProject.platforms.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Available On</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.platforms.map((platform, i) => (
                          <Badge key={i}>{platform}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Release Date */}
                  {selectedProject.releaseDate && (
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
                  )}

                  {/* Gallery */}
                  {selectedProject.galleryImages && selectedProject.galleryImages.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Gallery</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedProject.galleryImages.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={`${selectedProject.title} ${i + 1}`}
                            className="rounded-lg w-full"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}

