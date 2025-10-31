import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { LogOut, Home, FolderOpen, Users, Mail, Briefcase, Settings, Plus, Edit, Trash2, Save, Send, BarChart3, MessageSquare, Code2, FileText, Eye, XCircle, CheckCircle2, Star, Phone } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function DashboardPage({ siteData, apiUrl }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user || !siteData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">TechNest CMS</h2>
          <p className="text-sm text-muted-foreground mt-1">Welcome, {user.username}</p>
        </div>

        <nav className="space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <Home size={20} />
            <span>Home Content</span>
          </Link>
          <Link to="/dashboard/projects" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <FolderOpen size={20} />
            <span>Projects</span>
          </Link>
          <Link to="/dashboard/about" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <Users size={20} />
            <span>About</span>
          </Link>
          <Link to="/dashboard/messages" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <Mail size={20} />
            <span>Messages</span>
            {siteData.messages?.length > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {siteData.messages.length}
              </span>
            )}
          </Link>
          <Link to="/dashboard/project-submissions" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <Send size={20} />
            <span>Project Ideas</span>
            {siteData.projectSubmissions?.length > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {siteData.projectSubmissions.length}
              </span>
            )}
          </Link>
          <Link to="/dashboard/statistics" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <BarChart3 size={20} />
            <span>Statistics</span>
          </Link>
          <Link to="/dashboard/testimonials" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <MessageSquare size={20} />
            <span>Testimonials</span>
          </Link>
          <Link to="/dashboard/testimonial-submissions" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <CheckCircle2 size={20} />
            <span>Testimonial Requests</span>
            {siteData.testimonialSubmissions?.length > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {siteData.testimonialSubmissions.length}
              </span>
            )}
          </Link>
          <Link to="/dashboard/ratings" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <Star size={20} />
            <span>Project Ratings</span>
          </Link>
          <Link to="/dashboard/technologies" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <Code2 size={20} />
            <span>Technologies</span>
          </Link>
          <Link to="/dashboard/blog" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <FileText size={20} />
            <span>Blog/News</span>
          </Link>
          <Link to="/dashboard/visitors" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <Eye size={20} />
            <span>Visitors</span>
          </Link>
          <Link to="/dashboard/contact-settings" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <Phone size={20} />
            <span>Contact Settings</span>
          </Link>
          <Link to="/dashboard/chatbot-conversations" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <MessageSquare size={20} />
            <span>Chatbot Conversations</span>
          </Link>
          <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <Routes>
          <Route path="/" element={<HomeContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
          <Route path="/projects" element={<ProjectsContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
          <Route path="/about" element={<AboutContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
          <Route path="/messages" element={<MessagesContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
          <Route path="/project-submissions" element={<ProjectSubmissionsContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
          <Route path="/statistics" element={<StatisticsContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
          <Route path="/testimonials" element={<TestimonialsContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
          <Route path="/technologies" element={<TechnologiesContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
          <Route path="/blog" element={<BlogContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
          <Route path="/testimonial-submissions" element={<TestimonialSubmissionsContent apiUrl={apiUrl} toast={toast} />} />
          <Route path="/ratings" element={<RatingsContent apiUrl={apiUrl} toast={toast} />} />
          <Route path="/visitors" element={<VisitorsContent apiUrl={apiUrl} toast={toast} />} />
          <Route path="/contact-settings" element={<ContactSettingsContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
          <Route path="/chatbot-conversations" element={<ChatbotConversationsContent apiUrl={apiUrl} toast={toast} />} />
          <Route path="/settings" element={<SettingsContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
        </Routes>
      </div>
    </div>
  );
}

// Home Content Management
function HomeContent({ siteData, apiUrl, toast }) {
  const [heroData, setHeroData] = useState(siteData.home.hero);
  const [whatWeDo, setWhatWeDo] = useState(siteData.home.whatWeDo);
  const [vision, setVision] = useState(siteData.home.vision);
  const [partners, setPartners] = useState(siteData.home.partners);
  const [editingService, setEditingService] = useState(null);
  const [editingPartner, setEditingPartner] = useState(null);

  const saveHero = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/home/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData)
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Hero section updated!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const saveWhatWeDo = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/home/whatwedo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(whatWeDo)
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'What We Do updated!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const saveVision = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/home/vision`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vision)
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Vision updated!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const savePartners = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/home/partners`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partners)
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Partners updated!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const addService = () => {
    const newService = {
      id: Date.now().toString(),
      title: 'New Service',
      description: 'Service description',
      icon: 'Gamepad2'
    };
    setWhatWeDo([...whatWeDo, newService]);
  };

  const updateService = (id, field, value) => {
    setWhatWeDo(whatWeDo.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const deleteService = (id) => {
    setWhatWeDo(whatWeDo.filter(s => s.id !== id));
  };

  const addPartner = () => {
    const newPartner = {
      id: Date.now().toString(),
      name: 'New Partner',
      logoUrl: 'https://via.placeholder.com/150x60'
    };
    setPartners([...partners, newPartner]);
  };

  const updatePartner = (id, field, value) => {
    setPartners(partners.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deletePartner = (id) => {
    setPartners(partners.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Home Page Content</h1>

      {/* Hero Section */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={heroData.title}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <Input
              value={heroData.subtitle}
              onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">CTA 1</label>
              <Input
                value={heroData.cta1}
                onChange={(e) => setHeroData({ ...heroData, cta1: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CTA 2</label>
              <Input
                value={heroData.cta2}
                onChange={(e) => setHeroData({ ...heroData, cta2: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={saveHero}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* What We Do Section */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">What We Do</h2>
          <Button onClick={addService} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
        <div className="space-y-4">
          {whatWeDo.map((service) => (
            <div key={service.id} className="border border-border rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={service.title}
                    onChange={(e) => updateService(service.id, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={service.description}
                    onChange={(e) => updateService(service.id, 'description', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Icon Name (Lucide)</label>
                  <Input
                    value={service.icon}
                    onChange={(e) => updateService(service.id, 'icon', e.target.value)}
                    placeholder="e.g., Gamepad2, Glasses, Palette"
                  />
                </div>
                <Button onClick={() => deleteService(service.id)} variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={saveWhatWeDo} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save All Services
          </Button>
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Our Vision</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={vision.title}
              onChange={(e) => setVision({ ...vision, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Text</label>
            <Textarea
              value={vision.text}
              onChange={(e) => setVision({ ...vision, text: e.target.value })}
              rows={4}
            />
          </div>
          <Button onClick={saveVision}>
            <Save className="mr-2 h-4 w-4" />
            Save Vision
          </Button>
        </div>
      </div>

      {/* Partners Section */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Our Partners</h2>
          <Button onClick={addPartner} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Button>
        </div>
        <div className="space-y-4">
          {partners.map((partner) => (
            <div key={partner.id} className="border border-border rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Partner Name</label>
                  <Input
                    value={partner.name}
                    onChange={(e) => updatePartner(partner.id, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Logo URL</label>
                  <Input
                    value={partner.logoUrl}
                    onChange={(e) => updatePartner(partner.id, 'logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <Button onClick={() => deletePartner(partner.id)} variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={savePartners} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save All Partners
          </Button>
        </div>
      </div>
    </div>
  );
}

// Projects Content Management
function ProjectsContent({ siteData, apiUrl, toast }) {
  const [projects, setProjects] = useState(siteData.projects || []);
  const [editingProject, setEditingProject] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const addProject = () => {
    const newProject = {
      id: '',
      title: '',
      type: '2D',
      tags: [],
      description: '',
      thumbnailUrl: '',
      coverUrl: '',
      features: [],
      technologies: [],
      releaseDate: '',
      platforms: [],
      gallery: [],
      mediaGallery: [],
      downloadLink: '',
      videoLink: ''
    };
    setEditingProject(newProject);
    setShowDialog(true);
  };

  const addMediaToGallery = () => {
    const newMedia = { type: 'image', url: '', caption: '' };
    setEditingProject({
      ...editingProject,
      mediaGallery: [...(editingProject.mediaGallery || []), newMedia]
    });
  };

  const updateMediaInGallery = (index, field, value) => {
    const updatedGallery = [...(editingProject.mediaGallery || [])];
    updatedGallery[index] = { ...updatedGallery[index], [field]: value };
    setEditingProject({ ...editingProject, mediaGallery: updatedGallery });
  };

  const removeMediaFromGallery = (index) => {
    const updatedGallery = (editingProject.mediaGallery || []).filter((_, i) => i !== index);
    setEditingProject({ ...editingProject, mediaGallery: updatedGallery });
  };

  const editProject = (project) => {
    setEditingProject({ ...project });
    setShowDialog(true);
  };

  const saveProject = async () => {
    try {
      const projectId = editingProject._id || editingProject.id;
      const url = projectId 
        ? `${apiUrl}/api/projects/${projectId}`
        : `${apiUrl}/api/projects`;
      
      const method = projectId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject)
      });
      
      if (response.ok) {
        const result = await response.json();
        if (projectId) {
          setProjects(projects.map(p => (p._id || p.id) === (result._id || result.id) ? result : p));
        } else {
          setProjects([...projects, result]);
        }
        toast({ title: 'Success', description: 'Project saved!' });
        setShowDialog(false);
        setEditingProject(null);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save project', variant: 'destructive' });
    }
  };

  const deleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await fetch(`${apiUrl}/api/projects/${projectId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setProjects(projects.filter(p => p._id !== projectId));
        toast({ title: 'Success', description: 'Project deleted!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete project', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <Button onClick={addProject}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-card rounded-lg border border-border overflow-hidden">
            <img src={project.thumbnailUrl} alt={project.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{project.type}</p>
              <div className="flex gap-2">
                <Button onClick={() => editProject(project)} size="sm" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button onClick={() => deleteProject(project._id)} size="sm" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject?.id ? 'Edit Project' : 'Add Project'}</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={editingProject.type}
                  onChange={(e) => setEditingProject({ ...editingProject, type: e.target.value })}
                >
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="VR">VR</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Web">Web</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                <Input
                  value={editingProject.thumbnailUrl}
                  onChange={(e) => setEditingProject({ ...editingProject, thumbnailUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <Input
                  value={Array.isArray(editingProject.tags) ? editingProject.tags.join(', ') : ''}
                  onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(',').map(t => t.trim()) })}
                  placeholder="Action, Adventure, Sci-Fi"
                />
              <div>
                <label className="block text-sm font-medium mb-1">Key Features (comma-separated)</label>
                <Textarea
                  value={Array.isArray(editingProject.features) ? editingProject.features.join(', ') : ''}
                  onChange={(e) => setEditingProject({ ...editingProject, features: e.target.value.split(',').map(f => f.trim()) })}
                  placeholder="Multiplayer mode, 4K graphics, Cross-platform"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Technologies (comma-separated)</label>
                <Input
                  value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(', ') : ''}
                  onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(t => t.trim()) })}
                  placeholder="Unity, C#, Photon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Release Date</label>
                <Input
                  type="date"
                  value={editingProject.releaseDate ? new Date(editingProject.releaseDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingProject({ ...editingProject, releaseDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Platforms (comma-separated)</label>
                <Input
                  value={Array.isArray(editingProject.platforms) ? editingProject.platforms.join(', ') : ''}
                  onChange={(e) => setEditingProject({ ...editingProject, platforms: e.target.value.split(',').map(p => p.trim()) })}
                  placeholder="PC, PlayStation, Xbox, Mobile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                <Input
                  value={editingProject.coverUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, coverUrl: e.target.value })}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Download Link (optional)</label>
                <Input
                  value={editingProject.downloadLink || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, downloadLink: e.target.value })}
                  placeholder="https://example.com/download/game.zip"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Video Link (optional)</label>
                <Input
                  value={editingProject.videoLink || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, videoLink: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {/* Media Gallery Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium">Media Gallery (Images & Videos)</label>
                  <Button type="button" size="sm" onClick={addMediaToGallery}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add Media
                  </Button>
                </div>
                <div className="space-y-3">
                  {(editingProject.mediaGallery || []).map((media, index) => (
                    <div key={index} className="border border-border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <select
                          className="px-2 py-1 border border-border rounded bg-background text-sm"
                          value={media.type}
                          onChange={(e) => updateMediaInGallery(index, 'type', e.target.value)}
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => removeMediaFromGallery(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <Input
                        placeholder={`${media.type === 'image' ? 'Image' : 'Video'} URL`}
                        value={media.url}
                        onChange={(e) => updateMediaInGallery(index, 'url', e.target.value)}
                      />
                      <Input
                        placeholder="Caption (optional)"
                        value={media.caption || ''}
                        onChange={(e) => updateMediaInGallery(index, 'caption', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={saveProject} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Project
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// About Content Management
function AboutContent({ siteData, apiUrl, toast }) {
  const [story, setStory] = useState(siteData.about.story);
  const [team, setTeam] = useState(siteData.about.team || []);
  const [values, setValues] = useState(siteData.about.values || []);
  const [editingMember, setEditingMember] = useState(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);

  const saveStory = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/about/story`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(story)
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Story updated!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const saveTeam = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/about/team`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(team)
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Team updated!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const saveValues = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/about/values`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Values updated!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const addTeamMember = () => {
    setEditingMember({
      id: '',
      name: '',
      role: '',
      bio: '',
      photoUrl: '',
      linkedin: '',
      github: ''
    });
    setShowMemberDialog(true);
  };

  const editTeamMember = (member) => {
    setEditingMember({ ...member });
    setShowMemberDialog(true);
  };

  const saveMember = () => {
    if (editingMember.id) {
      setTeam(team.map(m => m.id === editingMember.id ? editingMember : m));
    } else {
      setTeam([...team, { ...editingMember, id: Date.now().toString() }]);
    }
    setShowMemberDialog(false);
    setEditingMember(null);
  };

  const deleteMember = (id) => {
    setTeam(team.filter(m => m.id !== id));
  };

  const addValue = () => {
    setValues([...values, {
      id: Date.now().toString(),
      title: 'New Value',
      description: 'Value description'
    }]);
  };

  const updateValue = (id, field, value) => {
    setValues(values.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const deleteValue = (id) => {
    setValues(values.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">About Page Content</h1>

      {/* Story Section */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Our Story</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={story.title}
              onChange={(e) => setStory({ ...story, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Text</label>
            <Textarea
              value={story.text}
              onChange={(e) => setStory({ ...story, text: e.target.value })}
              rows={4}
            />
          </div>
          <Button onClick={saveStory}>
            <Save className="mr-2 h-4 w-4" />
            Save Story
          </Button>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <Button onClick={addTeamMember} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {team.map((member) => (
            <div key={member.id} className="border border-border rounded-lg p-4">
              <img src={member.photoUrl} alt={member.name} className="w-full h-32 object-cover rounded-lg mb-3" />
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
              <div className="flex gap-2">
                <Button onClick={() => editTeamMember(member)} size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button onClick={() => deleteMember(member.id)} size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={saveTeam} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Team
        </Button>
      </div>

      {/* Values Section */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Our Values</h2>
          <Button onClick={addValue} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Value
          </Button>
        </div>
        <div className="space-y-4">
          {values.map((value) => (
            <div key={value.id} className="border border-border rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={value.title}
                    onChange={(e) => updateValue(value.id, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={value.description}
                    onChange={(e) => updateValue(value.id, 'description', e.target.value)}
                  />
                </div>
                <Button onClick={() => deleteValue(value.id)} variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={saveValues} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save All Values
          </Button>
        </div>
      </div>

      {/* Team Member Dialog */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingMember?.id ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <Input
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <Textarea
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Photo URL</label>
                <Input
                  value={editingMember.photoUrl}
                  onChange={(e) => setEditingMember({ ...editingMember, photoUrl: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                  <Input
                    value={editingMember.linkedin}
                    onChange={(e) => setEditingMember({ ...editingMember, linkedin: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GitHub URL</label>
                  <Input
                    value={editingMember.github}
                    onChange={(e) => setEditingMember({ ...editingMember, github: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={saveMember} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Member
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Messages Content
function MessagesContent({ siteData, apiUrl, toast }) {
  const [messages, setMessages] = useState(siteData.messages || []);

  const deleteMessage = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/contact/messages/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setMessages(messages.filter(m => m.id !== id));
        toast({ title: 'Success', description: 'Message deleted!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contact Messages</h1>
      {messages.length === 0 ? (
        <p className="text-muted-foreground">No messages yet</p>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="bg-card p-6 rounded-lg border border-border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{message.name}</h3>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                </div>
                <Button onClick={() => deleteMessage(message.id)} variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <h4 className="font-medium mb-2">{message.subject}</h4>
              <p className="text-sm mb-3">{message.message}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(message.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Project Submissions Content
function ProjectSubmissionsContent({ siteData, apiUrl, toast }) {
  const [submissions, setSubmissions] = useState(siteData.projectSubmissions || []);

  const deleteSubmission = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/project-submissions/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setSubmissions(submissions.filter(s => s.id !== id));
        toast({ title: 'Success', description: 'Submission deleted!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Project Ideas Submissions</h1>
      {submissions.length === 0 ? (
        <p className="text-muted-foreground">No project submissions yet</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-card p-6 rounded-lg border border-border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{submission.name}</h3>
                  <p className="text-sm text-muted-foreground">{submission.email}</p>
                  <p className="text-sm text-muted-foreground">{submission.phone}</p>
                </div>
                <Button onClick={() => deleteSubmission(submission.id)} variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <h4 className="font-medium mb-2">{submission.title}</h4>
              <p className="text-sm mb-3">{submission.message}</p>
              {submission.link && (
                <a href={submission.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                  Project Link →
                </a>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                {new Date(submission.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Settings Content
function SettingsContent({ siteData, apiUrl, toast }) {
  const [introSettings, setIntroSettings] = useState(siteData.intro);
  const [contactInfo, setContactInfo] = useState(siteData.contact);
  const [joinSettings, setJoinSettings] = useState(siteData.join);
  const [chatbotSettings, setChatbotSettings] = useState(siteData.chatbot || { enabled: true, name: 'Tec', welcomeMessage: 'مرحباً! أنا Tec 🤖، مساعدك الذكي في جامعة عمان العربية. كيف يمكنني مساعدتك اليوم؟' });

  const saveChatbot = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/chatbot/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatbotSettings)
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Chatbot settings updated!' });
        // Reload page to apply changes
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const saveIntro = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/intro`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(introSettings)
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Intro settings updated!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const saveContact = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactInfo)
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Contact info updated!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const saveJoinHero = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/join/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(joinSettings.hero)
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Join page hero updated!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const saveWhyJoin = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/join/whyjoin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(joinSettings.whyJoinUs)
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Why Join Us updated!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const addWhyJoinItem = () => {
    setJoinSettings({
      ...joinSettings,
      whyJoinUs: [...joinSettings.whyJoinUs, {
        id: Date.now().toString(),
        title: 'New Benefit',
        description: 'Benefit description'
      }]
    });
  };

  const updateWhyJoinItem = (id, field, value) => {
    setJoinSettings({
      ...joinSettings,
      whyJoinUs: joinSettings.whyJoinUs.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const deleteWhyJoinItem = (id) => {
    setJoinSettings({
      ...joinSettings,
      whyJoinUs: joinSettings.whyJoinUs.filter(item => item.id !== id)
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Site Settings</h1>

      {/* Chatbot Settings */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">🤖 Tec Chatbot Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={chatbotSettings.enabled}
              onChange={(e) => setChatbotSettings({ ...chatbotSettings, enabled: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">Enable Chatbot</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Chatbot Name</label>
            <Input
              value={chatbotSettings.name}
              onChange={(e) => setChatbotSettings({ ...chatbotSettings, name: e.target.value })}
              placeholder="Tec"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Welcome Message</label>
            <Textarea
              value={chatbotSettings.welcomeMessage}
              onChange={(e) => setChatbotSettings({ ...chatbotSettings, welcomeMessage: e.target.value })}
              placeholder="مرحباً! أنا Tec..."
              rows={3}
            />
          </div>
          <Button onClick={saveChatbot}>
            <Save className="mr-2 h-4 w-4" />
            Save Chatbot Settings
          </Button>
        </div>
      </div>

      {/* Intro Video Settings */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Intro Video Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={introSettings.enabled}
              onChange={(e) => setIntroSettings({ ...introSettings, enabled: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">Enable Intro Video</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Video URL</label>
            <Input
              value={introSettings.videoUrl}
              onChange={(e) => setIntroSettings({ ...introSettings, videoUrl: e.target.value })}
              placeholder="/intro.mp4"
            />
          </div>
          <Button onClick={saveIntro}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discord</label>
            <Input
              value={contactInfo.discord}
              onChange={(e) => setContactInfo({ ...contactInfo, discord: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              value={contactInfo.location}
              onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
            />
          </div>
          <Button onClick={saveContact}>
            <Save className="mr-2 h-4 w-4" />
            Save Contact Info
          </Button>
        </div>
      </div>

      {/* Join Page Settings */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Join Page Hero</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={joinSettings.hero.title}
              onChange={(e) => setJoinSettings({ 
                ...joinSettings, 
                hero: { ...joinSettings.hero, title: e.target.value }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <Input
              value={joinSettings.hero.subtitle}
              onChange={(e) => setJoinSettings({ 
                ...joinSettings, 
                hero: { ...joinSettings.hero, subtitle: e.target.value }
              })}
            />
          </div>
          <Button onClick={saveJoinHero}>
            <Save className="mr-2 h-4 w-4" />
            Save Hero
          </Button>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Why Join Us</h2>
          <Button onClick={addWhyJoinItem} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
        <div className="space-y-4">
          {joinSettings.whyJoinUs.map((item) => (
            <div key={item.id} className="border border-border rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateWhyJoinItem(item.id, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => updateWhyJoinItem(item.id, 'description', e.target.value)}
                  />
                </div>
                <Button onClick={() => deleteWhyJoinItem(item.id)} variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={saveWhyJoin} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save All Items
          </Button>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Footer Links</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              placeholder="contact@technest.com"
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Social Links</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">Discord</label>
                <Input
                  value={contactInfo.socials?.discord || ''}
                  onChange={(e) => setContactInfo({ ...contactInfo, socials: { ...contactInfo.socials, discord: e.target.value } })}
                  placeholder="https://discord.gg/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub</label>
                <Input
                  value={contactInfo.socials?.github || ''}
                  onChange={(e) => setContactInfo({ ...contactInfo, socials: { ...contactInfo.socials, github: e.target.value } })}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn</label>
                <Input
                  value={contactInfo.socials?.linkedin || ''}
                  onChange={(e) => setContactInfo({ ...contactInfo, socials: { ...contactInfo.socials, linkedin: e.target.value } })}
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">YouTube</label>
                <Input
                  value={contactInfo.socials?.youtube || ''}
                  onChange={(e) => setContactInfo({ ...contactInfo, socials: { ...contactInfo.socials, youtube: e.target.value } })}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>
          <Button onClick={saveContact} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Footer Links
          </Button>
        </div>
      </div>

    </div>
  );
}



// Statistics Content Component
function StatisticsContent({ siteData, apiUrl, toast }) {
  const [statistics, setStatistics] = useState(siteData.statistics || []);
  const [editingStat, setEditingStat] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const iconOptions = ['Briefcase', 'Users', 'Trophy', 'Star', 'Zap', 'Code2', 'Cpu', 'Layers'];
  const colorOptions = [
    'text-blue-500',
    'text-green-500',
    'text-yellow-500',
    'text-purple-500',
    'text-red-500',
    'text-pink-500',
    'text-indigo-500',
    'text-orange-500'
  ];

  const handleAdd = () => {
    setEditingStat({
      id: Date.now().toString(),
      icon: 'Star',
      value: 0,
      suffix: '+',
      label: '',
      color: 'text-blue-500'
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (stat) => {
    setEditingStat({ ...stat });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      let updatedStats;
      if (statistics.find(s => s.id === editingStat.id)) {
        updatedStats = statistics.map(s => s.id === editingStat.id ? editingStat : s);
      } else {
        updatedStats = [...statistics, editingStat];
      }

      const response = await fetch(`${apiUrl}/api/statistics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStats)
      });

      if (response.ok) {
        setStatistics(updatedStats);
        setIsDialogOpen(false);
        setEditingStat(null);
        toast({ title: 'Success', description: 'Statistics updated successfully' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update statistics', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const updatedStats = statistics.filter(s => s.id !== id);
      const response = await fetch(`${apiUrl}/api/statistics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStats)
      });

      if (response.ok) {
        setStatistics(updatedStats);
        toast({ title: 'Success', description: 'Statistic deleted successfully' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete statistic', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Statistics Management</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Statistic
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statistics.map((stat) => (
          <div key={stat.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`text-4xl font-bold ${stat.color}`}>
                {stat.value}{stat.suffix}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(stat)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(stat.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-xs text-muted-foreground mt-2">Icon: {stat.icon}</div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStat?.id && statistics.find(s => s.id === editingStat.id) ? 'Edit' : 'Add'} Statistic</DialogTitle>
          </DialogHeader>
          {editingStat && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <Input
                  value={editingStat.label}
                  onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                  placeholder="Projects Completed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <Input
                  type="number"
                  value={editingStat.value}
                  onChange={(e) => setEditingStat({ ...editingStat, value: parseInt(e.target.value) || 0 })}
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Suffix</label>
                <Input
                  value={editingStat.suffix}
                  onChange={(e) => setEditingStat({ ...editingStat, suffix: e.target.value })}
                  placeholder="+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={editingStat.icon}
                  onChange={(e) => setEditingStat({ ...editingStat, icon: e.target.value })}
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={editingStat.color}
                  onChange={(e) => setEditingStat({ ...editingStat, color: e.target.value })}
                >
                  {colorOptions.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleSave} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



// Testimonials Content Component
function TestimonialsContent({ siteData, apiUrl, toast }) {
  const [testimonials, setTestimonials] = useState(siteData.testimonials || []);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAdd = () => {
    setEditingTestimonial({
      id: Date.now().toString(),
      name: '',
      role: '',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Date.now(),
      rating: 5,
      text: ''
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial({ ...testimonial });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      let updatedTestimonials;
      if (testimonials.find(t => t.id === editingTestimonial.id)) {
        updatedTestimonials = testimonials.map(t => t.id === editingTestimonial.id ? editingTestimonial : t);
      } else {
        updatedTestimonials = [...testimonials, editingTestimonial];
      }

      const response = await fetch(`${apiUrl}/api/testimonials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTestimonials)
      });

      if (response.ok) {
        setTestimonials(updatedTestimonials);
        setIsDialogOpen(false);
        setEditingTestimonial(null);
        toast({ title: 'Success', description: 'Testimonials updated successfully' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update testimonials', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const updatedTestimonials = testimonials.filter(t => t.id !== id);
      const response = await fetch(`${apiUrl}/api/testimonials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTestimonials)
      });

      if (response.ok) {
        setTestimonials(updatedTestimonials);
        toast({ title: 'Success', description: 'Testimonial deleted successfully' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete testimonial', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonials Management</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <div className="flex gap-1 mt-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{testimonial.text}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(testimonial)} className="flex-1">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(testimonial.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTestimonial?.id && testimonials.find(t => t.id === editingTestimonial.id) ? 'Edit' : 'Add'} Testimonial</DialogTitle>
          </DialogHeader>
          {editingTestimonial && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={editingTestimonial.name}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role/Company</label>
                <Input
                  value={editingTestimonial.role}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                  placeholder="CEO, Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input
                  value={editingTestimonial.image}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={editingTestimonial.rating}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) || 5 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Testimonial Text</label>
                <Textarea
                  value={editingTestimonial.text}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                  placeholder="Write the testimonial..."
                  rows={5}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



// Technologies Content Component
function TechnologiesContent({ siteData, apiUrl, toast }) {
  const [technologies, setTechnologies] = useState(siteData.technologies || []);
  const [editingTech, setEditingTech] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const iconOptions = ['Code2', 'Cpu', 'Layers', 'Zap'];

  const handleAdd = () => {
    setEditingTech({
      id: Date.now().toString(),
      category: '',
      icon: 'Code2',
      items: []
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (tech) => {
    setEditingTech({ ...tech });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      let updatedTech;
      if (technologies.find(t => t.id === editingTech.id)) {
        updatedTech = technologies.map(t => t.id === editingTech.id ? editingTech : t);
      } else {
        updatedTech = [...technologies, editingTech];
      }

      const response = await fetch(`${apiUrl}/api/technologies`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTech)
      });

      if (response.ok) {
        setTechnologies(updatedTech);
        setIsDialogOpen(false);
        setEditingTech(null);
        toast({ title: 'Success', description: 'Technologies updated successfully' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update technologies', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const updatedTech = technologies.filter(t => t.id !== id);
      const response = await fetch(`${apiUrl}/api/technologies`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTech)
      });

      if (response.ok) {
        setTechnologies(updatedTech);
        toast({ title: 'Success', description: 'Technology category deleted successfully' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete technology', variant: 'destructive' });
    }
  };

  const handleAddItem = () => {
    setEditingTech({ ...editingTech, items: [...editingTech.items, ''] });
  };

  const handleRemoveItem = (index) => {
    const newItems = editingTech.items.filter((_, i) => i !== index);
    setEditingTech({ ...editingTech, items: newItems });
  };

  const handleItemChange = (index, value) => {
    const newItems = [...editingTech.items];
    newItems[index] = value;
    setEditingTech({ ...editingTech, items: newItems });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Technologies Management</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {technologies.map((tech) => (
          <div key={tech.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{tech.category}</h3>
                <p className="text-xs text-muted-foreground">Icon: {tech.icon}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => handleEdit(tech)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(tech.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              {tech.items.map((item, idx) => (
                <div key={idx} className="text-sm text-muted-foreground">• {item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTech?.id && technologies.find(t => t.id === editingTech.id) ? 'Edit' : 'Add'} Technology Category</DialogTitle>
          </DialogHeader>
          {editingTech && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name</label>
                <Input
                  value={editingTech.category}
                  onChange={(e) => setEditingTech({ ...editingTech, category: e.target.value })}
                  placeholder="Game Engines"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={editingTech.icon}
                  onChange={(e) => setEditingTech({ ...editingTech, icon: e.target.value })}
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Items</label>
                  <Button size="sm" onClick={handleAddItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {editingTech.items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => handleItemChange(index, e.target.value)}
                        placeholder="Unity"
                      />
                      <Button size="sm" variant="outline" onClick={() => handleRemoveItem(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



// Blog Content Component
function BlogContent({ siteData, apiUrl, toast }) {
  const [blog, setBlog] = useState(siteData.blog || []);
  const [editingPost, setEditingPost] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAdd = () => {
    setEditingPost({
      id: Date.now().toString(),
      title: '',
      excerpt: '',
      content: '',
      image: '',
      mediaGallery: [],
      author: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      tags: []
    });
    setIsDialogOpen(true);
  };

  const addMediaToBlogGallery = () => {
    const newMedia = { type: 'image', url: '', caption: '' };
    setEditingPost({
      ...editingPost,
      mediaGallery: [...(editingPost.mediaGallery || []), newMedia]
    });
  };

  const updateBlogMedia = (index, field, value) => {
    const updatedGallery = [...(editingPost.mediaGallery || [])];
    updatedGallery[index] = { ...updatedGallery[index], [field]: value };
    setEditingPost({ ...editingPost, mediaGallery: updatedGallery });
  };

  const removeBlogMedia = (index) => {
    const updatedGallery = (editingPost.mediaGallery || []).filter((_, i) => i !== index);
    setEditingPost({ ...editingPost, mediaGallery: updatedGallery });
  };

  const handleEdit = (post) => {
    setEditingPost({ ...post });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      let response;
      if (blog.find(p => p.id === editingPost.id)) {
        response = await fetch(`${apiUrl}/api/blog/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingPost)
        });
      } else {
        response = await fetch(`${apiUrl}/api/blog`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingPost)
        });
      }

      if (response.ok) {
        const data = await response.json();
        if (blog.find(p => p.id === editingPost.id)) {
          setBlog(blog.map(p => p.id === editingPost.id ? data : p));
        } else {
          setBlog([...blog, data]);
        }
        setIsDialogOpen(false);
        setEditingPost(null);
        toast({ title: 'Success', description: 'Blog post saved successfully' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save blog post', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/blog/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setBlog(blog.filter(p => p.id !== id));
        toast({ title: 'Success', description: 'Blog post deleted successfully' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete blog post', variant: 'destructive' });
    }
  };

  const handleTagsChange = (tagsString) => {
    const tags = tagsString.split(',').map(t => t.trim()).filter(t => t);
    setEditingPost({ ...editingPost, tags });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog/News Management</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Post
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {blog.map((post) => (
          <div key={post.id} className="bg-card border border-border rounded-lg p-6 flex gap-6">
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-48 h-32 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    By {post.author} • {post.date} • {post.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
              <div className="flex gap-2 flex-wrap">
                {post.tags?.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost?.id && blog.find(p => p.id === editingPost.id) ? 'Edit' : 'Add'} Blog Post</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt (Short Description)</label>
                <Textarea
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Brief description..."
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content (Full Article)</label>
                <Textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="Full article content..."
                  rows={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input
                  value={editingPost.image}
                  onChange={(e) => setEditingPost({ ...editingPost, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <Input
                    value={editingPost.author}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Input
                    type="date"
                    value={editingPost.date}
                    onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  value={editingPost.category}
                  onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                  placeholder="Technology, Development, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <Input
                  value={editingPost.tags?.join(', ') || ''}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="VR, Gaming, Innovation"
                />
              </div>

              {/* Media Gallery Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium">Media Gallery (Images & Videos)</label>
                  <Button type="button" size="sm" onClick={addMediaToBlogGallery}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add Media
                  </Button>
                </div>
                <div className="space-y-3">
                  {(editingPost.mediaGallery || []).map((media, index) => (
                    <div key={index} className="border border-border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <select
                          className="px-2 py-1 border border-border rounded bg-background text-sm"
                          value={media.type}
                          onChange={(e) => updateBlogMedia(index, 'type', e.target.value)}
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => removeBlogMedia(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <Input
                        placeholder={`${media.type === 'image' ? 'Image' : 'Video'} URL`}
                        value={media.url}
                        onChange={(e) => updateBlogMedia(index, 'url', e.target.value)}
                      />
                      <Input
                        placeholder="Caption (optional)"
                        value={media.caption || ''}
                        onChange={(e) => updateBlogMedia(index, 'caption', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Post
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



// Visitors Content Component
function VisitorsContent({ apiUrl, toast }) {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, today, week, month
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchVisitors();
    fetchStats();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/visitors`);
      if (response.ok) {
        const data = await response.json();
        setVisitors(data);
      }
    } catch (error) {
      console.error('Error fetching visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/visitors/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all visitor data?')) return;
    
    try {
      const response = await fetch(`${apiUrl}/api/visitors`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setVisitors([]);
        fetchStats();
        toast({ title: 'Success', description: 'All visitor data deleted' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete visitor data', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/visitors/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setVisitors(visitors.filter(v => v._id !== id));
        fetchStats();
        toast({ title: 'Success', description: 'Visitor deleted' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete visitor', variant: 'destructive' });
    }
  };

  const getFilteredVisitors = () => {
    if (filter === 'all') return visitors;
    
    const now = new Date();
    const filtered = visitors.filter(v => {
      const visitDate = new Date(v.visitTime);
      if (filter === 'today') {
        return visitDate.toDateString() === now.toDateString();
      } else if (filter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return visitDate >= weekAgo;
      } else if (filter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return visitDate >= monthAgo;
      }
      return true;
    });
    return filtered;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredVisitors = getFilteredVisitors();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Visitor Analytics</h1>
        <Button onClick={handleDeleteAll} variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete All
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl font-bold text-primary">{stats.totalVisitors}</div>
            <div className="text-sm text-muted-foreground">Total Visitors</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl font-bold text-green-500">{stats.uniqueVisitors}</div>
            <div className="text-sm text-muted-foreground">Unique Visitors</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-500">
              {stats.topCountries[0]?._id || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Top Country</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl font-bold text-purple-500">
              {stats.browserBreakdown[0]?._id || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">Top Browser</div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Time
        </Button>
        <Button
          variant={filter === 'today' ? 'default' : 'outline'}
          onClick={() => setFilter('today')}
        >
          Today
        </Button>
        <Button
          variant={filter === 'week' ? 'default' : 'outline'}
          onClick={() => setFilter('week')}
        >
          This Week
        </Button>
        <Button
          variant={filter === 'month' ? 'default' : 'outline'}
          onClick={() => setFilter('month')}
        >
          This Month
        </Button>
      </div>

      {/* Visitors Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Device</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Browser</th>
                <th className="px-4 py-3 text-left text-sm font-medium">OS</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Page</th>
                <th className="px-4 py-3 text-left text-sm font-medium">IP</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.map((visitor) => (
                <tr key={visitor._id} className="border-t border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm">
                    {new Date(visitor.visitTime).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {visitor.city ? `${visitor.city}, ${visitor.country}` : visitor.country || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-sm">{visitor.deviceType || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm">
                    {visitor.browser} {visitor.browserVersion}
                  </td>
                  <td className="px-4 py-3 text-sm">{visitor.os}</td>
                  <td className="px-4 py-3 text-sm">{visitor.page}</td>
                  <td className="px-4 py-3 text-sm font-mono text-xs">{visitor.ip}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setSelectedVisitor(visitor); setShowDetails(true); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(visitor._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredVisitors.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No visitors found
          </div>
        )}
      </div>

      {/* Additional Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Top Countries</h3>
            <div className="space-y-2">
              {stats.topCountries.map((country, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm">{country._id || 'Unknown'}</span>
                  <span className="text-sm font-semibold">{country.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Device Breakdown</h3>
            <div className="space-y-2">
              {stats.deviceBreakdown.map((device, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm">{device._id || 'Unknown'}</span>
                  <span className="text-sm font-semibold">{device.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visitor Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comprehensive Visitor Details</DialogTitle>
          </DialogHeader>
          {selectedVisitor && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="font-medium">Visit Time:</span> {new Date(selectedVisitor.visitTime).toLocaleString()}</div>
                  <div><span className="font-medium">Session ID:</span> <span className="font-mono text-xs">{selectedVisitor.sessionId}</span></div>
                  <div><span className="font-medium">IP Address:</span> {selectedVisitor.ip}</div>
                  <div><span className="font-medium">Page:</span> {selectedVisitor.page}</div>
                  <div><span className="font-medium">Referrer:</span> {selectedVisitor.referrer || 'Direct'}</div>
                  <div><span className="font-medium">Returning Visitor:</span> {selectedVisitor.isReturningVisitor ? 'Yes' : 'No'}</div>
                  <div><span className="font-medium">Visit Count:</span> {selectedVisitor.visitCount || 1}</div>
                  <div><span className="font-medium">First Visit:</span> {selectedVisitor.firstVisit ? new Date(selectedVisitor.firstVisit).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Location</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="font-medium">Country:</span> {selectedVisitor.country || 'Unknown'}</div>
                  <div><span className="font-medium">City:</span> {selectedVisitor.city || 'Unknown'}</div>
                  <div><span className="font-medium">Region:</span> {selectedVisitor.region || 'Unknown'}</div>
                  <div><span className="font-medium">Postal Code:</span> {selectedVisitor.postalCode || 'N/A'}</div>
                  <div><span className="font-medium">Timezone:</span> {selectedVisitor.timezone || 'N/A'}</div>
                  <div><span className="font-medium">Timezone Offset:</span> {selectedVisitor.timezoneOffset ? `${selectedVisitor.timezoneOffset} minutes` : 'N/A'}</div>
                </div>
              </div>

              {/* Device & Browser */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Device & Browser</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="font-medium">Device Type:</span> {selectedVisitor.deviceType || 'Unknown'}</div>
                  <div><span className="font-medium">Browser:</span> {selectedVisitor.browser} {selectedVisitor.browserVersion}</div>
                  <div><span className="font-medium">OS:</span> {selectedVisitor.os}</div>
                  <div><span className="font-medium">Platform:</span> {selectedVisitor.platform || 'N/A'}</div>
                  <div><span className="font-medium">Language:</span> {selectedVisitor.language || 'N/A'}</div>
                  <div><span className="font-medium">Touch Support:</span> {selectedVisitor.touchSupport ? 'Yes' : 'No'}</div>
                  <div><span className="font-medium">Max Touch Points:</span> {selectedVisitor.maxTouchPoints || 0}</div>
                  <div><span className="font-medium">CPU Cores:</span> {selectedVisitor.hardwareConcurrency || 'N/A'}</div>
                  <div><span className="font-medium">Device Memory:</span> {selectedVisitor.deviceMemory ? `${selectedVisitor.deviceMemory} GB` : 'N/A'}</div>
                </div>
              </div>

              {/* Screen */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Screen & Display</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="font-medium">Screen Resolution:</span> {selectedVisitor.screenResolution || 'N/A'}</div>
                  <div><span className="font-medium">Viewport:</span> {selectedVisitor.viewportWidth}x{selectedVisitor.viewportHeight}</div>
                  <div><span className="font-medium">Color Depth:</span> {selectedVisitor.colorDepth} bits</div>
                  <div><span className="font-medium">Pixel Ratio:</span> {selectedVisitor.devicePixelRatio || 1}</div>
                  <div><span className="font-medium">Orientation:</span> {selectedVisitor.screenOrientation || 'N/A'}</div>
                  <div><span className="font-medium">Available Screen:</span> {selectedVisitor.screenAvailWidth}x{selectedVisitor.screenAvailHeight}</div>
                </div>
              </div>

              {/* Network */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Network</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="font-medium">Connection Type:</span> {selectedVisitor.connectionType || 'Unknown'}</div>
                  <div><span className="font-medium">Effective Type:</span> {selectedVisitor.effectiveType || 'Unknown'}</div>
                  <div><span className="font-medium">RTT:</span> {selectedVisitor.rtt ? `${selectedVisitor.rtt} ms` : 'N/A'}</div>
                  <div><span className="font-medium">Downlink:</span> {selectedVisitor.downlink ? `${selectedVisitor.downlink} Mbps` : 'N/A'}</div>
                  <div><span className="font-medium">Save Data:</span> {selectedVisitor.saveData ? 'Enabled' : 'Disabled'}</div>
                  <div><span className="font-medium">Online Status:</span> {selectedVisitor.onlineStatus ? 'Online' : 'Offline'}</div>
                </div>
              </div>

              {/* Battery */}
              {selectedVisitor.batteryLevel > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Battery</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="font-medium">Level:</span> {selectedVisitor.batteryLevel}%</div>
                    <div><span className="font-medium">Charging:</span> {selectedVisitor.batteryCharging ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              )}

              {/* WebGL */}
              {selectedVisitor.webglVendor && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">WebGL</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="font-medium">Vendor:</span> {selectedVisitor.webglVendor}</div>
                    <div><span className="font-medium">Renderer:</span> {selectedVisitor.webglRenderer}</div>
                    <div><span className="font-medium">Version:</span> {selectedVisitor.webglVersion}</div>
                    <div><span className="font-medium">Max Texture Size:</span> {selectedVisitor.webglMaxTextureSize}</div>
                  </div>
                </div>
              )}

              {/* Features */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Features & Capabilities</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    {selectedVisitor.cookiesEnabled ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">Cookies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedVisitor.localStorageEnabled ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">Local Storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedVisitor.sessionStorageEnabled ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">Session Storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedVisitor.indexedDBEnabled ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">IndexedDB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedVisitor.webGLEnabled ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">WebGL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedVisitor.webGL2Enabled ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">WebGL 2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedVisitor.webRTCEnabled ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">WebRTC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedVisitor.webWorkersEnabled ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">Web Workers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedVisitor.serviceWorkerEnabled ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">Service Worker</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedVisitor.doNotTrack ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">Do Not Track</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedVisitor.adBlockerDetected ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">Ad Blocker</span>
                  </div>
                </div>
              </div>

              {/* Plugins */}
              {selectedVisitor.plugins && selectedVisitor.plugins.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Browser Plugins ({selectedVisitor.plugins.length})</h3>
                  <div className="max-h-40 overflow-y-auto">
                    <div className="text-sm space-y-1">
                      {selectedVisitor.plugins.map((plugin, idx) => (
                        <div key={idx} className="text-muted-foreground">{typeof plugin === 'string' ? plugin : plugin.name}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Canvas Fingerprint */}
              {selectedVisitor.canvasFingerprint && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Canvas Fingerprint</h3>
                  <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                    {selectedVisitor.canvasFingerprint.substring(0, 100)}...
                  </div>
                </div>
              )}

              {/* User Agent */}
              <div>
                <h3 className="font-semibold text-lg mb-3">User Agent</h3>
                <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                  {selectedVisitor.userAgent}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



// Testimonial Submissions Content Component
function TestimonialSubmissionsContent({ apiUrl, toast }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/testimonials/submissions`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/testimonials/submissions/${id}/approve`, {
        method: 'PUT'
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Testimonial approved and added to the website' });
        fetchSubmissions();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve testimonial', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      const response = await fetch(`${apiUrl}/api/testimonials/submissions/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Submission deleted' });
        fetchSubmissions();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete submission', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Testimonial Submissions</h1>
      
      {submissions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No testimonial submissions yet
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission._id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{submission.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {submission.role}{submission.company ? `, ${submission.company}` : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">{submission.email}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(submission.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{submission.testimonial}</p>
              <div className="flex gap-2">
                {!submission.approved && (
                  <Button size="sm" onClick={() => handleApprove(submission._id)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve & Add to Website
                  </Button>
                )}
                {submission.approved && (
                  <span className="text-sm text-green-500 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Approved
                  </span>
                )}
                <Button size="sm" variant="destructive" onClick={() => handleDelete(submission._id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Submitted: {new Date(submission.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Ratings Content Component
function RatingsContent({ apiUrl, toast }) {
  const [ratings, setRatings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('all');

  useEffect(() => {
    fetchRatings();
    fetchProjects();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/ratings`);
      if (response.ok) {
        const data = await response.json();
        setRatings(data);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this rating?')) return;
    try {
      const response = await fetch(`${apiUrl}/api/ratings/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast({ title: 'Success', description: 'Rating deleted successfully' });
        fetchRatings();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete rating', variant: 'destructive' });
    }
  };

  const filteredRatings = selectedProject === 'all' 
    ? ratings 
    : ratings.filter(r => r.projectId?._id === selectedProject);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Project Ratings</h1>
        <select
          className="px-4 py-2 border border-border rounded-md bg-background"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {filteredRatings.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No ratings yet
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4">Project</th>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Rating</th>
                <th className="text-left p-4">IP</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRatings.map((rating) => (
                <tr key={rating._id} className="border-t border-border">
                  <td className="p-4">
                    <span className="font-medium">{rating.projectId?.title || 'Unknown'}</span>
                  </td>
                  <td className="p-4">{rating.userName}</td>
                  <td className="p-4 text-sm text-muted-foreground">{rating.userEmail}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {[...Array(rating.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      ))}
                      <span className="ml-2 text-sm font-semibold">{rating.rating}/5</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{rating.userIp || 'N/A'}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(rating.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(rating._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Ratings</h3>
          <p className="text-3xl font-bold">{filteredRatings.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Rating</h3>
          <p className="text-3xl font-bold">
            {filteredRatings.length > 0
              ? (filteredRatings.reduce((sum, r) => sum + r.rating, 0) / filteredRatings.length).toFixed(1)
              : '0.0'}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">5-Star Ratings</h3>
          <p className="text-3xl font-bold">
            {filteredRatings.filter(r => r.rating === 5).length}
          </p>
        </div>
      </div>
    </div>
  );
}



// Contact Settings Content Component
function ContactSettingsContent({ siteData, apiUrl, toast }) {
  const [contactInfo, setContactInfo] = useState(siteData.contact || {
    message: '',
    email: '',
    discord: '',
    location: '',
    businessHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed'
    },
    socials: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      discord: '',
      github: '',
      youtube: ''
    }
  });

  const saveContactInfo = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactInfo)
      });
      
      if (response.ok) {
        toast({ title: 'Success', description: 'Contact information updated successfully!' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update contact information', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contact Page Settings</h1>

      {/* Business Hours Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
        <div className="space-y-3">
          {Object.keys(contactInfo.businessHours || {}).map((day) => (
            <div key={day} className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium capitalize">{day}:</label>
              <Input
                value={contactInfo.businessHours[day]}
                onChange={(e) => setContactInfo({
                  ...contactInfo,
                  businessHours: {
                    ...contactInfo.businessHours,
                    [day]: e.target.value
                  }
                })}
                placeholder="9:00 AM - 6:00 PM"
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <Textarea
              value={contactInfo.message}
              onChange={(e) => setContactInfo({ ...contactInfo, message: e.target.value })}
              placeholder="Have a question or want to collaborate? We'd love to hear from you!"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              placeholder="hello@technest.studio"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discord</label>
            <Input
              value={contactInfo.discord}
              onChange={(e) => setContactInfo({ ...contactInfo, discord: e.target.value })}
              placeholder="TechNest#1234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              value={contactInfo.location}
              onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>
      </div>

      {/* Social Media Links Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Follow Us - Social Media Links</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Facebook</label>
            <Input
              value={contactInfo.socials?.facebook || ''}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                socials: { ...contactInfo.socials, facebook: e.target.value }
              })}
              placeholder="https://facebook.com/technest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Twitter</label>
            <Input
              value={contactInfo.socials?.twitter || ''}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                socials: { ...contactInfo.socials, twitter: e.target.value }
              })}
              placeholder="https://twitter.com/technest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Instagram</label>
            <Input
              value={contactInfo.socials?.instagram || ''}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                socials: { ...contactInfo.socials, instagram: e.target.value }
              })}
              placeholder="https://instagram.com/technest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn</label>
            <Input
              value={contactInfo.socials?.linkedin || ''}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                socials: { ...contactInfo.socials, linkedin: e.target.value }
              })}
              placeholder="https://linkedin.com/company/technest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discord</label>
            <Input
              value={contactInfo.socials?.discord || ''}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                socials: { ...contactInfo.socials, discord: e.target.value }
              })}
              placeholder="https://discord.gg/technest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">GitHub</label>
            <Input
              value={contactInfo.socials?.github || ''}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                socials: { ...contactInfo.socials, github: e.target.value }
              })}
              placeholder="https://github.com/technest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">YouTube</label>
            <Input
              value={contactInfo.socials?.youtube || ''}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                socials: { ...contactInfo.socials, youtube: e.target.value }
              })}
              placeholder="https://youtube.com/@technest"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button onClick={saveContactInfo} size="lg" className="w-full">
        <Save className="mr-2 h-5 w-5" />
        Save All Contact Settings
      </Button>
    </div>
  );
}





// Chatbot Conversations Management
function ChatbotConversationsContent({ apiUrl, toast }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchConversations();
    fetchStats();
  }, [page]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/chatbot/conversations?page=${page}&limit=20`);
      
      // CRITICAL DEBUGGING: Log status and check for non-OK response
      console.log('API Response Status:', response.status);
      if (!response.ok) {
        // Attempt to read response body for more details, but handle case where it's not JSON
        const errorText = await response.text();
        console.error('Non-OK HTTP Status:', response.status, 'Body:', errorText);
        throw new Error(`Failed to fetch conversations: HTTP Status ${response.status}. Details: ${errorText.substring(0, 100)}...`);
      }

      const data = await response.json();
      console.log('Received Conversation Data:', data);
      
      // Ensure the expected structure exists before setting state
      if (!data || !data.conversations || !data.pagination || typeof data.pagination.pages === 'undefined') {
        throw new Error('API response is missing required data structure (conversations or pagination).');
      }

      setConversations(data.conversations);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching conversations:', error.message);
      toast({
        title: 'Error Fetching Conversations',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/chatbot/conversations/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchConversations();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/chatbot/conversations/search/${searchQuery}`);
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error searching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to search conversations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await fetch(`${apiUrl}/api/chatbot/conversations/${id}`, { method: 'DELETE' });
      toast({
        title: 'Success',
        description: 'Conversation deleted successfully'
      });
      fetchConversations();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete conversation',
        variant: 'destructive'
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/chatbot/conversations/export/json`);
      const data = await response.json();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chatbot-conversations-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: 'Success',
        description: 'Conversations exported successfully'
      });
    } catch (error) {
      console.error('Error exporting conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to export conversations',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chatbot Conversations</h1>
        <p className="text-muted-foreground mt-2">View and manage all chatbot interactions</p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Total Conversations</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalConversations}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground">With Images</h3>
            <p className="text-3xl font-bold mt-2">{stats.conversationsWithImages}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Avg Response Time</h3>
            <p className="text-3xl font-bold mt-2">{Math.round(stats.averageResponseTime)}ms</p>
          </div>
        </div>
      )}

      {/* Search and Export */}
      <div className="flex gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <Button onClick={handleExport} variant="outline">
          Export JSON
        </Button>
      </div>

      {/* Conversations Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No conversations found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">User Message</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Bot Response</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Response Time</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((conv) => (
                  <tr key={conv._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-3 text-sm">
                      <div className="max-w-xs truncate">{conv.userMessage}</div>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <div className="max-w-xs truncate">{conv.botResponse}</div>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {new Date(conv.date).toLocaleDateString('ar-JO')}
                    </td>
                    <td className="px-6 py-3 text-sm">{conv.responseTime}ms</td>
                    <td className="px-6 py-3 text-sm space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedConversation(conv);
                          setShowDetailModal(true);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteConversation(conv._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Conversation Details</DialogTitle>
          </DialogHeader>
          {selectedConversation && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">User Message</h3>
                <p className="bg-muted p-3 rounded-lg text-sm">{selectedConversation.userMessage}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bot Response</h3>
                <p className="bg-muted p-3 rounded-lg text-sm">{selectedConversation.botResponse}</p>
              </div>
              {selectedConversation.imageUrl && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Image</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = selectedConversation.imageUrl;
                        link.download = `chatbot-image-${selectedConversation._id}.jpg`;
                        link.click();
                      }}
                    >
                      Download
                    </Button>
                  </div>
                  <img src={selectedConversation.imageUrl} alt="Conversation" className="max-w-full rounded-lg" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Response Time</p>
                  <p className="font-semibold">{selectedConversation.responseTime}ms</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-semibold">{new Date(selectedConversation.date).toLocaleString('ar-JO')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
