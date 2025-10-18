import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { LogOut, Home, FolderOpen, Users, Mail, Briefcase, Settings, Plus, Edit, Trash2, Save } from 'lucide-react';
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
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6">
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
          </Link>
          <Link to="/dashboard/applications" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <Briefcase size={20} />
            <span>Applications</span>
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
          <Route path="/applications" element={<ApplicationsContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
          <Route path="/settings" element={<SettingsContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
        </Routes>
      </div>
    </div>
  );
}

// Home Content Management
function HomeContent({ siteData, apiUrl, toast }) {
  const [heroData, setHeroData] = useState(siteData.home.hero);

  const saveHero = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/home/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData)
      });
      if (response.ok) {
        toast({ title: 'Saved!', description: 'Hero section updated successfully.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save changes.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Home Page Content</h1>
      
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={heroData.title}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              className="bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <Input
              value={heroData.subtitle}
              onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
              className="bg-background"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">CTA 1</label>
              <Input
                value={heroData.cta1}
                onChange={(e) => setHeroData({ ...heroData, cta1: e.target.value })}
                className="bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CTA 2</label>
              <Input
                value={heroData.cta2}
                onChange={(e) => setHeroData({ ...heroData, cta2: e.target.value })}
                className="bg-background"
              />
            </div>
          </div>
          <Button onClick={saveHero} className="bg-primary text-primary-foreground">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// Projects Management
function ProjectsContent({ siteData, apiUrl, toast }) {
  const [projects, setProjects] = useState(siteData.projects);
  const [editingProject, setEditingProject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = async (project) => {
    try {
      const url = project.id && projects.find(p => p.id === project.id)
        ? `${apiUrl}/api/projects/${project.id}`
        : `${apiUrl}/api/projects`;
      
      const method = project.id && projects.find(p => p.id === project.id) ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });

      if (response.ok) {
        const updatedProject = await response.json();
        if (method === 'POST') {
          setProjects([...projects, updatedProject]);
        } else {
          setProjects(projects.map(p => p.id === project.id ? updatedProject : p));
        }
        toast({ title: 'Saved!', description: 'Project saved successfully.' });
        setIsDialogOpen(false);
        setEditingProject(null);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save project.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/projects/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id));
        toast({ title: 'Deleted!', description: 'Project deleted successfully.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete project.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <Button onClick={() => { setEditingProject({}); setIsDialogOpen(true); }} className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <img src={project.thumbnailUrl} alt={project.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{project.type}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditingProject(project); setIsDialogOpen(true); }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProjectDialog
        project={editingProject}
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditingProject(null); }}
        onSave={handleSave}
      />
    </div>
  );
}

function ProjectDialog({ project, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState(project || {});

  useEffect(() => {
    setFormData(project || {});
  }, [project]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{formData.id ? 'Edit Project' : 'Add Project'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Input
            placeholder="Type (2D/3D/VR/Mobile/Web)"
            value={formData.type || ''}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            placeholder="Thumbnail URL"
            value={formData.thumbnailUrl || ''}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
          />
          <Button onClick={() => onSave(formData)} className="w-full bg-primary">
            Save Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// About Content Management
function AboutContent({ siteData, apiUrl, toast }) {
  const [story, setStory] = useState(siteData.about.story);

  const saveStory = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/about/story`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(story)
      });
      if (response.ok) {
        toast({ title: 'Saved!', description: 'Story updated successfully.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save changes.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">About Page Content</h1>
      
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Our Story</h2>
        <div className="space-y-4">
          <Input
            placeholder="Title"
            value={story.title}
            onChange={(e) => setStory({ ...story, title: e.target.value })}
            className="bg-background"
          />
          <Textarea
            placeholder="Story text"
            value={story.text}
            onChange={(e) => setStory({ ...story, text: e.target.value })}
            rows={6}
            className="bg-background"
          />
          <Button onClick={saveStory} className="bg-primary">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// Messages Management
function MessagesContent({ siteData, apiUrl, toast }) {
  const [messages, setMessages] = useState(siteData.messages);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/contact/messages/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMessages(messages.filter(m => m.id !== id));
        toast({ title: 'Deleted!', description: 'Message deleted successfully.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete message.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Contact Messages</h1>
      
      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No messages yet</p>
        ) : (
          messages.map(message => (
            <div key={message.id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{message.name}</h3>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleDelete(message.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-medium mb-2">{message.subject}</p>
              <p className="text-muted-foreground">{message.message}</p>
              <p className="text-xs text-muted-foreground mt-4">
                {new Date(message.date).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Applications Management
function ApplicationsContent({ siteData, apiUrl, toast }) {
  const [applications, setApplications] = useState(siteData.applications);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/join/applications/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setApplications(applications.filter(a => a.id !== id));
        toast({ title: 'Deleted!', description: 'Application deleted successfully.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete application.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Job Applications</h1>
      
      <div className="space-y-4">
        {applications.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No applications yet</p>
        ) : (
          applications.map(app => (
            <div key={app.id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{app.name}</h3>
                  <p className="text-sm text-muted-foreground">{app.email}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleDelete(app.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-medium text-primary mb-2">Position: {app.role}</p>
              <p className="text-muted-foreground">{app.message}</p>
              <p className="text-xs text-muted-foreground mt-4">
                {new Date(app.date).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Settings Management
function SettingsContent({ siteData, apiUrl, toast }) {
  const [intro, setIntro] = useState(siteData.intro);

  const saveIntro = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/intro`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intro)
      });
      if (response.ok) {
        toast({ title: 'Saved!', description: 'Intro settings updated successfully.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save changes.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
      
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Intro Video Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={intro.enabled}
              onChange={(e) => setIntro({ ...intro, enabled: e.target.checked })}
              className="w-4 h-4"
            />
            <label>Enable Intro Video</label>
          </div>
          <Input
            placeholder="Video URL"
            value={intro.videoUrl}
            onChange={(e) => setIntro({ ...intro, videoUrl: e.target.value })}
            className="bg-background"
          />
          <Button onClick={saveIntro} className="bg-primary">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

