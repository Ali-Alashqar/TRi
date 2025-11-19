import React, { useState, useEffect, useMemo } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Home, Settings, Users, Mail, Briefcase, Star, Code2, FileText, Plus, Trash2, Save, Upload, CheckCircle2, BarChart, Eye, Search, Edit, ChevronDown, ChevronUp, X, Server, Activity, Shield, Bot, Bell, Palette } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import SEO from '../components/SEO';

// Main Dashboard Component
export default function DashboardPage() {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/data`);
        const data = await response.json();
        setSiteData(data);
      } catch (error) {
        console.error('Error fetching site data:', error);
        toast({ title: 'Error', description: 'Failed to fetch site data.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl, toast]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><p>Loading Dashboard...</p></div>;
  }

  if (!siteData) {
    return <div className="flex items-center justify-center h-screen"><p>Failed to load data. Please try again later.</p></div>;
  }

  return (
    <>
      <SEO title="Dashboard - TechNest" description="Manage your TechNest website content." />
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar siteData={siteData} />
        <main className="flex-1 p-6 md:p-10">
          <Routes>
            <Route path="/" element={<DashboardHome siteData={siteData} />} />
            <Route path="/projects" element={<ProjectsContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
            <Route path="/about" element={<AboutContent siteData={siteData} apiUrl={apiUrl} toast={toast} />} />
            {/* Add other routes here */}
          </Routes>
        </main>
      </div>
    </>
  );
}

// Sidebar Navigation
function Sidebar({ siteData }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-card border-r border-border flex-shrink-0 p-6">
      <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
      <nav className="space-y-2">
        <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isActive('/dashboard') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}> <Home size={20} /> <span>Home</span> </Link>
        <Link to="/dashboard/projects" className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isActive('/dashboard/projects') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}> <Briefcase size={20} /> <span>Projects</span> </Link>
        <Link to="/dashboard/about" className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isActive('/dashboard/about') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}> <Users size={20} /> <span>About Us</span> </Link>
        {/* Add other links here */}
      </nav>
    </aside>
  );
}

// Dashboard Home
function DashboardHome({ siteData }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>
      <p className="text-muted-foreground">Here you can manage all the content for your TechNest website.</p>
      {/* Add some stats or quick links here */}
    </div>
  );
}

// Projects Content Management
function ProjectsContent({ siteData, apiUrl, toast }) {
  const [projects, setProjects] = useState(siteData.projects || []);
  const [editingProject, setEditingProject] = useState(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file, field, isDownload = false) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (field.startsWith('mediaGallery-')) {
        const index = parseInt(field.split('-')[1], 10);
        updateMediaInGallery(index, 'url', result.url);
      } else {
        setEditingProject(prev => ({ ...prev, [field]: result.url }));
      }

      toast({ title: 'Success', description: 'File uploaded successfully.' });
    } catch (error) {
      console.error('File upload error:', error);
      toast({ title: 'Error', description: 'File upload failed.', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };
  
  const handleExternalLinkUpload = async (link, filename) => {
    if (!link || !filename) {
        toast({ title: 'Error', description: 'Link and filename are required.', variant: 'destructive' });
        return;
    }
    setUploading(true);
    try {
        const response = await fetch(`${apiUrl}/api/upload/link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link, filename }),
        });
        if (!response.ok) throw new Error('Failed to save link');
        const result = await response.json();
        setEditingProject(prev => ({ ...prev, downloadLink: result.url }));
        toast({ title: 'Success', description: 'External link saved.' });
    } catch (error) {
        console.error('Error saving external link:', error);
        toast({ title: 'Error', description: 'Failed to save external link.', variant: 'destructive' });
    } finally {
        setUploading(false);
    }
  };

  const saveProject = async () => {
    // Save project logic here
  };

  const addMediaToGallery = () => {
    setEditingProject(prev => ({
      ...prev,
      mediaGallery: [...(prev.mediaGallery || []), { type: 'image', url: '', caption: '' }]
    }));
  };

  const removeMediaFromGallery = (index) => {
    setEditingProject(prev => ({
      ...prev,
      mediaGallery: prev.mediaGallery.filter((_, i) => i !== index)
    }));
  };

  const updateMediaInGallery = (index, field, value) => {
    setEditingProject(prev => {
      const newMediaGallery = [...prev.mediaGallery];
      newMediaGallery[index] = { ...newMediaGallery[index], [field]: value };
      return { ...prev, mediaGallery: newMediaGallery };
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>
      <Button onClick={() => { setEditingProject({}); setShowProjectDialog(true); }}>
        <Plus className="mr-2 h-4 w-4" /> Add New Project
      </Button>

      {/* Project List */}
      <div className="mt-6 space-y-4">
        {projects.map(p => (
          <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg">
            <span>{p.title}</span>
            <div>
              <Button variant="outline" size="sm" onClick={() => { setEditingProject(p); setShowProjectDialog(true); }}>Edit</Button>
              <Button variant="destructive" size="sm" className="ml-2">Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Edit/Add Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingProject?.id ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input value={editingProject.title || ''} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} placeholder="Project Title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea value={editingProject.description || ''} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} placeholder="Project Description" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                <div className="flex items-center gap-2">
                  <Input type="file" onChange={(e) => handleFileUpload(e.target.files[0], 'thumbnailUrl')} disabled={uploading} />
                </div>
                <Input value={editingProject.thumbnailUrl || ''} onChange={(e) => setEditingProject({ ...editingProject, thumbnailUrl: e.target.value })} placeholder="Or enter Thumbnail URL" className="mt-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                <div className="flex items-center gap-2">
                  <Input type="file" onChange={(e) => handleFileUpload(e.target.files[0], 'coverUrl')} disabled={uploading} />
                </div>
                <Input value={editingProject.coverUrl || ''} onChange={(e) => setEditingProject({ ...editingProject, coverUrl: e.target.value })} placeholder="Or enter Cover Image URL" className="mt-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <Input value={Array.isArray(editingProject.tags) ? editingProject.tags.join(', ') : ''} onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(',').map(t => t.trim()) })} placeholder="Action, Adventure, Sci-Fi" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Key Features (comma-separated)</label>
                <Textarea value={Array.isArray(editingProject.features) ? editingProject.features.join(', ') : ''} onChange={(e) => setEditingProject({ ...editingProject, features: e.target.value.split(',').map(f => f.trim()) })} placeholder="Multiplayer mode, 4K graphics" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Technologies (comma-separated)</label>
                <Input value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(', ') : ''} onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(t => t.trim()) })} placeholder="Unity, C#, Photon" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Release Date</label>
                <Input type="date" value={editingProject.releaseDate ? new Date(editingProject.releaseDate).toISOString().split('T')[0] : ''} onChange={(e) => setEditingProject({ ...editingProject, releaseDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Platforms (comma-separated)</label>
                <Input value={Array.isArray(editingProject.platforms) ? editingProject.platforms.join(', ') : ''} onChange={(e) => setEditingProject({ ...editingProject, platforms: e.target.value.split(',').map(p => p.trim()) })} placeholder="PC, PlayStation, Xbox" />
              </div>
              <div className="border p-3 rounded-lg space-y-2">
                <label className="block text-sm font-medium mb-1">Download File/Link</label>
                <div className="flex items-center gap-2">
                  <Input type="file" onChange={(e) => handleFileUpload(e.target.files[0], 'downloadLink', true)} disabled={uploading} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Input value={editingProject.downloadLink || ''} onChange={(e) => setEditingProject({ ...editingProject, downloadLink: e.target.value })} placeholder="Or enter External Download Link" />
                  <Button type="button" onClick={() => handleExternalLinkUpload(editingProject.downloadLink, editingProject.title + '-download')} disabled={uploading || !editingProject.downloadLink || !editingProject.title}>Save Link</Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Video Link (optional)</label>
                <Input value={editingProject.videoLink || ''} onChange={(e) => setEditingProject({ ...editingProject, videoLink: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="border-t pt-4">
                <label className="block text-sm font-medium mb-3">Media Gallery</label>
                <div className="space-y-3">
                  {(editingProject.mediaGallery || []).map((media, index) => (
                    <div key={index} className="border p-3 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <select value={media.type} onChange={(e) => updateMediaInGallery(index, 'type', e.target.value)} className="px-2 py-1 border rounded bg-background text-sm">
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                        <Button type="button" size="sm" variant="destructive" onClick={() => removeMediaFromGallery(index)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input type="file" accept={media.type === 'image' ? 'image/*' : 'video/*'} onChange={(e) => handleFileUpload(e.target.files[0], `mediaGallery-${index}`)} disabled={uploading} />
                      </div>
                      <Input placeholder={`${media.type === 'image' ? 'Image' : 'Video'} URL`} value={media.url || ''} onChange={(e) => updateMediaInGallery(index, 'url', e.target.value)} className="mt-2" />
                      <Input placeholder="Caption (optional)" value={media.caption || ''} onChange={(e) => updateMediaInGallery(index, 'caption', e.target.value)} />
                    </div>
                  ))}
                </div>
                <Button type="button" size="sm" onClick={addMediaToGallery} className="mt-3"><Plus className="mr-1 h-3 w-3" />Add Media</Button>
              </div>
              <Button onClick={saveProject} className="w-full" disabled={uploading}><Save className="mr-2 h-4 w-4" />{uploading ? 'Uploading...' : 'Save Project'}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// About Content Management
function AboutContent({ siteData, apiUrl, toast }) {
  // ... (implementation for about page management)
  return <div>About Content Management</div>;
}
