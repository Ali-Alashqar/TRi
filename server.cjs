const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage: storage });

const mongoose = require('mongoose');
const { SiteData, Project, Message, Application, ProjectSubmission, User, Visitor, Rating, TestimonialSubmission, LiveNotification, ChatbotConversation } = require('./models.js');


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliqadomi67_db_user:Technest2024admin@cluster0.2ttysuy.mongodb.net/technest?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Initialize default data if database is empty
async function initializeData() {
  try {
    const siteDataCount = await SiteData.countDocuments();
    
    if (siteDataCount === 0) {
      console.log('📦 Initializing default data...');
      
      // Create default site data
      const defaultSiteData = new SiteData({
        intro: {
          enabled: true,
          videoUrl: '/intro.mp4',
          posterUrl: '',
          autoplay: true,
          loop: true
        },
        home: {
          hero: {
            title: 'TechNest',
            subtitle: 'Crafting Immersive Gaming Experiences',
            videoUrl: '/intro.mp4',
            cta1: 'Explore Projects',
            cta2: 'Join Us'
          },
          whatWeDo: [
            { id: '1', title: 'Game Development', description: 'Creating engaging and innovative games across all platforms', icon: 'Gamepad2' },
            { id: '2', title: 'VR Experiences', description: 'Pushing boundaries with immersive virtual reality', icon: 'Glasses' },
            { id: '3', title: 'Design & Art', description: 'Stunning visuals and captivating art direction', icon: 'Palette' },
            { id: '4', title: 'Publishing', description: 'Bringing games to global audiences', icon: 'Rocket' }
          ],
          vision: {
            title: 'Our Vision',
            text: 'At TechNest, we believe in creating worlds that inspire, challenge, and unite players across the globe. Our mission is to push the boundaries of interactive entertainment through innovation, creativity, and technical excellence.'
          },
          partners: [
            { id: '1', name: 'Unity', logoUrl: 'https://via.placeholder.com/150x60/00E5FF/FFFFFF?text=Unity' },
            { id: '2', name: 'Unreal', logoUrl: 'https://via.placeholder.com/150x60/7C3AED/FFFFFF?text=Unreal' },
            { id: '3', name: 'Steam', logoUrl: 'https://via.placeholder.com/150x60/00E5FF/FFFFFF?text=Steam' }
          ]
        },
        about: {
          story: {
            title: 'Our Story',
            text: 'Founded in 2020, TechNest emerged from a shared passion for creating unforgettable gaming experiences. What started as a small indie team has grown into a dynamic studio pushing the boundaries of interactive entertainment.'
          },
          team: [
            {
              id: '1',
              name: 'Alex Chen',
              role: 'CEO & Creative Director',
              bio: 'Visionary leader with 10+ years in game development',
              photoUrl: 'https://via.placeholder.com/300x300/00E5FF/FFFFFF?text=AC',
              linkedin: '#',
              github: '#'
            },
            {
              id: '2',
              name: 'Sarah Martinez',
              role: 'Lead Developer',
              bio: 'Expert in game engines and technical architecture',
              photoUrl: 'https://via.placeholder.com/300x300/7C3AED/FFFFFF?text=SM',
              linkedin: '#',
              github: '#'
            },
            {
              id: '3',
              name: 'James Wilson',
              role: 'Art Director',
              bio: 'Award-winning artist specializing in game visuals',
              photoUrl: 'https://via.placeholder.com/300x300/00E5FF/FFFFFF?text=JW',
              linkedin: '#',
              github: '#'
            }
          ],
          values: [
            { id: '1', title: 'Innovation', description: 'Constantly exploring new technologies and gameplay mechanics' },
            { id: '2', title: 'Creativity', description: 'Fostering imagination and artistic expression' },
            { id: '3', title: 'Teamwork', description: 'Collaborating to achieve extraordinary results' },
            { id: '4', title: 'Impact', description: 'Creating games that leave lasting impressions' }
          ]
        },
        contact: {
          message: 'Have a question or want to collaborate? We\'d love to hear from you!',
          email: 'hello@technest.studio',
          discord: 'TechNest#1234',
          location: 'San Francisco, CA',
          socials: {
            discord: '#',
            github: '#',
            linkedin: '#',
            youtube: '#'
          }
        },
        join: {
          hero: {
            title: 'Join the Nest',
            subtitle: 'Let\'s Build Worlds Together'
          },
          whyJoinUs: [
            { id: '1', title: 'Team Spirit', description: 'Work with passionate, talented individuals' },
            { id: '2', title: 'Learning Culture', description: 'Continuous growth and skill development' },
            { id: '3', title: 'Global Impact', description: 'Create games played by millions worldwide' },
            { id: '4', title: 'Creative Freedom', description: 'Your ideas matter and shape our projects' }
          ],
          positions: [
            {
              id: '1',
              title: 'Senior Game Developer',
              description: 'Looking for an experienced developer with Unity/Unreal expertise',
              requirements: '5+ years experience, C++/C# proficiency'
            },
            {
              id: '2',
              title: '3D Artist',
              description: 'Create stunning 3D models and environments for our games',
              requirements: 'Portfolio required, Blender/Maya experience'
            }
          ]
        },
        statistics: [
          { id: '1', icon: 'Briefcase', value: 50, suffix: '+', label: 'Projects Completed', color: 'text-blue-500' },
          { id: '2', icon: 'Users', value: 100, suffix: '+', label: 'Happy Clients', color: 'text-green-500' },
          { id: '3', icon: 'Trophy', value: 15, suffix: '+', label: 'Awards Won', color: 'text-yellow-500' },
          { id: '4', icon: 'Star', value: 98, suffix: '%', label: 'Satisfaction Rate', color: 'text-purple-500' }
        ],
        testimonials: [
          {
            id: '1',
            name: 'Sarah Johnson',
            role: 'CEO, GameVerse Studios',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            rating: 5,
            text: 'TechNest delivered an exceptional VR experience that exceeded our expectations. Their attention to detail and innovative approach set them apart.'
          },
          {
            id: '2',
            name: 'Michael Chen',
            role: 'Product Manager, Digital Dreams',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
            rating: 5,
            text: 'Working with TechNest was a game-changer for our project. Their technical expertise and creative vision brought our ideas to life perfectly.'
          },
          {
            id: '3',
            name: 'Emma Williams',
            role: 'Creative Director, Pixel Perfect',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
            rating: 5,
            text: 'The team at TechNest is incredibly talented. They transformed our concept into an immersive gaming experience that our users absolutely love.'
          }
        ],
        technologies: [
          { id: '1', category: 'Game Engines', icon: 'Cpu', items: ['Unity', 'Unreal Engine', 'Godot', 'CryEngine'] },
          { id: '2', category: 'Programming', icon: 'Code2', items: ['C#', 'C++', 'Python', 'JavaScript'] },
          { id: '3', category: 'Platforms', icon: 'Layers', items: ['PC', 'Mobile', 'VR/AR', 'Console'] },
          { id: '4', category: 'Tools', icon: 'Zap', items: ['Blender', 'Maya', 'Photoshop', 'Substance'] }
        ],
        blog: [
          {
            id: '1',
            title: 'The Future of VR Gaming',
            excerpt: 'Exploring the next generation of virtual reality experiences and what they mean for game developers.',
            content: 'Virtual Reality gaming has come a long way since its inception. In this article, we explore the cutting-edge technologies that are shaping the future of VR gaming...\n\nThe landscape of VR gaming is rapidly evolving with new hardware capabilities, improved motion tracking, and more immersive experiences. Major players in the industry are investing heavily in VR technology, and we\'re seeing incredible innovations in haptic feedback, eye tracking, and wireless solutions.\n\nAt TechNest, we\'re excited about the possibilities that VR brings to storytelling and gameplay. Our team is actively developing VR experiences that push the boundaries of what\'s possible in immersive entertainment.',
            image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=400&fit=crop',
            author: 'Alex Chen',
            date: '2025-01-15',
            category: 'Technology',
            tags: ['VR', 'Gaming', 'Innovation']
          },
          {
            id: '2',
            title: 'Behind the Scenes: Neon Odyssey Development',
            excerpt: 'A deep dive into the development process of our upcoming cyberpunk adventure game.',
            content: 'Creating Neon Odyssey has been an incredible journey for our team. In this behind-the-scenes look, we share insights into our development process...\n\nFrom concept art to final implementation, every aspect of Neon Odyssey has been carefully crafted to deliver an unforgettable cyberpunk experience. Our art team spent months developing the unique neon-lit aesthetic that defines the game\'s visual identity.\n\nThe technical challenges were significant, but our engineering team rose to the occasion, implementing advanced rendering techniques and optimization strategies to ensure smooth performance across all platforms.',
            image: 'https://images.unsplash.com/photo-1593305841355-355e68983a0b?w=800&h=400&fit=crop',
            author: 'Sarah Martinez',
            date: '2025-02-20',
            category: 'Development',
            tags: ['Cyberpunk', 'Development', '3D']
          }
        ],
        seo: {
          home: {
            title: 'TechNest - Crafting Immersive Gaming Experiences',
            description: 'A leading game development studio focused on creating innovative and engaging gaming experiences across all platforms.',
            keywords: 'game development, indie games, VR, mobile games, TechNest'
          },
          projects: {
            title: 'Our Projects - TechNest Portfolio',
            description: 'Explore our portfolio of completed and in-development projects, showcasing our expertise in 2D, 3D, VR, and mobile gaming.',
            keywords: 'game projects, TechNest portfolio, indie games, VR games, mobile games'
          },
          about: {
            title: 'About TechNest - Our Story and Team',
            description: 'Learn about TechNest, our vision, our story, and meet the talented team behind our innovative games.',
            keywords: 'TechNest team, game studio history, company vision, game developers'
          },
          join: {
            title: 'Join the Nest - Careers at TechNest',
            description: 'Explore career opportunities at TechNest and join our passionate team of game developers and artists.',
            keywords: 'game development jobs, careers, job openings, TechNest hiring'
          },
          contact: {
            title: 'Contact TechNest - Get in Touch',
            description: 'Contact TechNest for inquiries, partnerships, or support. We are always happy to hear from you.',
            keywords: 'contact game studio, TechNest email, support, partnership'
          },
          blog: {
            title: 'TechNest Blog - News and Insights',
            description: 'Read the latest news, development insights, and articles from the TechNest team.',
            keywords: 'game development blog, TechNest news, gaming industry insights'
          }
        },
        chatbot: {
          enabled: true,
          name: 'Tec',
          welcomeMessage: 'مرحباً! أنا Tec 🤖، مساعدك الذكي في جامعة عمان العربية. كيف يمكنني مساعدتك اليوم؟'
        }
      });
      
      await defaultSiteData.save();
      
      // Create default projects
      const defaultProjects = [
        {
          id: '1',
          title: 'Neon Odyssey',
          type: '3D',
          tags: ['Cyberpunk', 'Action', 'RPG'],
          description: 'A sprawling open-world cyberpunk RPG set in a neon-drenched metropolis.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1593305841355-355e68983a0b?w=400&h=225&fit=crop',
          coverUrl: 'https://images.unsplash.com/photo-1593305841355-355e68983a0b?w=800&h=450&fit=crop',
          features: ['Open World', 'Deep Customization', 'Branching Storylines'],
          technologies: ['Unreal Engine 5', 'C++', 'Blender'],
          releaseDate: '2025-10-27',
          platforms: ['PC', 'PlayStation 5', 'Xbox Series X'],
          gallery: [],
          mediaGallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1593305841355-355e68983a0b?w=800&h=450&fit=crop', caption: 'The neon-drenched city skyline' },
            { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', caption: 'Official Gameplay Trailer' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1593305841355-355e68983a0b?w=400&h=225&fit=crop', caption: 'Character concept art' }
          ],
          downloadLink: '',
          videoLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          ratings: { total: 45, count: 10, average: 4.5, breakdown: { 1: 0, 2: 0, 3: 1, 4: 3, 5: 6 } }
        },
        {
          id: '2',
          title: 'Aether Drift',
          type: 'VR',
          tags: ['Space', 'Exploration', 'Simulation'],
          description: 'A breathtaking VR space exploration and trading simulation game.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1534796504249-158223155702?w=400&h=225&fit=crop',
          coverUrl: 'https://images.unsplash.com/photo-1534796504249-158223155702?w=800&h=450&fit=crop',
          features: ['Full VR Support', 'Procedural Galaxy', 'Multiplayer Trading'],
          technologies: ['Unity', 'C#', 'Oculus SDK'],
          releaseDate: '2024-08-15',
          platforms: ['Oculus Quest', 'SteamVR'],
          gallery: [],
          mediaGallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1534796504249-158223155702?w=800&h=450&fit=crop', caption: 'A distant nebula' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1534796504249-158223155702?w=400&h=225&fit=crop', caption: 'Cockpit view' }
          ],
          downloadLink: '',
          videoLink: '',
          ratings: { total: 38, count: 8, average: 4.75, breakdown: { 1: 0, 2: 0, 3: 0, 4: 2, 5: 6 } }
        },
        {
          id: '3',
          title: 'Pixel Raiders',
          type: '2D',
          tags: ['Platformer', 'Retro', 'Co-op'],
          description: 'A charming retro 2D platformer with challenging co-op levels.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=225&fit=crop',
          coverUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=450&fit=crop',
          features: ['Local Co-op', 'Pixel Art Graphics', 'Secret Levels'],
          technologies: ['Godot Engine', 'GDScript'],
          releaseDate: '2023-05-01',
          platforms: ['PC', 'Nintendo Switch'],
          gallery: [],
          mediaGallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=450&fit=crop', caption: 'Level 3 screenshot' }
          ],
          downloadLink: '',
          videoLink: '',
          ratings: { total: 40, count: 10, average: 4.0, breakdown: { 1: 0, 2: 0, 3: 2, 4: 4, 5: 4 } }
        }
      ];
      
      for (const projectData of defaultProjects) {
        const project = new Project(projectData);
        await project.save();
      }
      
      console.log('✅ Default data initialized successfully');
    }
  } catch (error) {
    console.error('❌ Error initializing default data:', error);
  }
}

// Start initialization
initializeData();

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check for authentication (simple check for admin access)
const isAuthenticated = (req, res, next) => {
  // In a real app, this would involve JWT or session checks
  // For this example, we'll allow all requests to pass for simplicity
  // The frontend handles the simple login state
  next();
};

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected to socket.io');
  
  socket.on('disconnect', () => {
    console.log('User disconnected from socket.io');
  });
});

// Function to broadcast updates to all connected clients
const broadcastUpdate = (key, data) => {
  io.emit('dataUpdate', { key, data });
};

// ===== API Endpoints =====

// General data endpoint
app.get('/api/data', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    const projects = await Project.find();
    const messages = await Message.find();
    const applications = await Application.find();
    const projectSubmissions = await ProjectSubmission.find();
    const users = await User.find();
    const ratings = await Rating.find();
    const testimonialSubmissions = await TestimonialSubmission.find();
    const liveNotifications = await LiveNotification.find();
    const chatbotConversations = await ChatbotConversation.find();
    
    res.json({
      siteData,
      projects,
      messages,
      applications,
      projectSubmissions,
      users,
      ratings,
      testimonialSubmissions,
      liveNotifications,
      chatbotConversations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Intro endpoints
app.put('/api/intro', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.intro = { ...siteData.intro, ...req.body };
    await siteData.save();
    broadcastUpdate('intro', siteData.intro);
    res.json(siteData.intro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Home endpoints
app.put('/api/home/hero', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.home.hero = { ...siteData.home.hero, ...req.body };
    await siteData.save();
    broadcastUpdate('home.hero', siteData.home.hero);
    res.json(siteData.home.hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/home/whatwedo', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.home.whatWeDo = req.body;
    await siteData.save();
    broadcastUpdate('home.whatWeDo', siteData.home.whatWeDo);
    res.json(siteData.home.whatWeDo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/home/vision', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.home.vision = { ...siteData.home.vision, ...req.body };
    await siteData.save();
    broadcastUpdate('home.vision', siteData.home.vision);
    res.json(siteData.home.vision);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/home/partners', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.home.partners = req.body;
    await siteData.save();
    broadcastUpdate('home.partners', siteData.home.partners);
    res.json(siteData.home.partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Project endpoints
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    const projects = await Project.find();
    broadcastUpdate('projects', projects);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const projects = await Project.find();
    broadcastUpdate('projects', projects);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    const projects = await Project.find();
    broadcastUpdate('projects', projects);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects/:id/rate', async (req, res) => {
  try {
    const { rating, userName, userEmail } = req.body;
    const projectId = req.params.id;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Create new rating
    const newRating = new Rating({
      projectId,
      rating,
      userName,
      userEmail,
      date: new Date()
    });
    await newRating.save();
    
    // Update project ratings
    if (!project.ratings) {
      project.ratings = {
        total: 0,
        count: 0,
        average: 0,
        breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }
    
    project.ratings.total += rating;
    project.ratings.count += 1;
    project.ratings.breakdown[rating] = (project.ratings.breakdown[rating] || 0) + 1;
    project.ratings.average = project.ratings.total / project.ratings.count;
    
    await project.save();
    
    const projects = await Project.find();
    broadcastUpdate('projects', projects);
    
    res.json({
      success: true,
      ratings: project.ratings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// About endpoints
app.put('/api/about/story', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.about.story = { ...siteData.about.story, ...req.body };
    await siteData.save();
    broadcastUpdate('about.story', siteData.about.story);
    res.json(siteData.about.story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/about/team', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.about.team = req.body;
    await siteData.save();
    broadcastUpdate('about.team', siteData.about.team);
    res.json(siteData.about.team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/about/values', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.about.values = req.body;
    await siteData.save();
    broadcastUpdate('about.values', siteData.about.values);
    res.json(siteData.about.values);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact endpoints
app.put('/api/contact', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.contact = { ...siteData.contact, ...req.body };
    await siteData.save();
    broadcastUpdate('contact', siteData.contact);
    res.json(siteData.contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contact/messages', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    const messages = await Message.find();
    broadcastUpdate('messages', messages);
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/contact/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/contact/messages/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    const messages = await Message.find();
    broadcastUpdate('messages', messages);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join endpoints
app.put('/api/join/hero', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.join.hero = { ...siteData.join.hero, ...req.body };
    await siteData.save();
    broadcastUpdate('join.hero', siteData.join.hero);
    res.json(siteData.join.hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/join/whyjoin', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.join.whyJoinUs = req.body;
    await siteData.save();
    broadcastUpdate('join.whyJoinUs', siteData.join.whyJoinUs);
    res.json(siteData.join.whyJoinUs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/join/positions', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.join.positions = req.body;
    await siteData.save();
    broadcastUpdate('join.positions', siteData.join.positions);
    res.json(siteData.join.positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/join/applications', async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    const applications = await Application.find();
    broadcastUpdate('applications', applications);
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/join/applications', async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/join/applications/:id', async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    const applications = await Application.find();
    broadcastUpdate('applications', applications);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Project submissions endpoints
app.post('/api/project-submissions', async (req, res) => {
  try {
    const submission = new ProjectSubmission(req.body);
    await submission.save();
    const projectSubmissions = await ProjectSubmission.find();
    broadcastUpdate('projectSubmissions', projectSubmissions);
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/project-submissions', async (req, res) => {
  try {
    const projectSubmissions = await ProjectSubmission.find();
    res.json(projectSubmissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/project-submissions/:id', async (req, res) => {
  try {
    await ProjectSubmission.findByIdAndDelete(req.params.id);
    const projectSubmissions = await ProjectSubmission.find();
    broadcastUpdate('projectSubmissions', projectSubmissions);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Statistics endpoints
app.put('/api/statistics', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.statistics = req.body;
    await siteData.save();
    broadcastUpdate('statistics', siteData.statistics);
    res.json(siteData.statistics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Testimonials endpoints
app.put('/api/testimonials', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.testimonials = req.body;
    await siteData.save();
    broadcastUpdate('testimonials', siteData.testimonials);
    res.json(siteData.testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Technologies endpoints
app.put('/api/technologies', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.technologies = req.body;
    await siteData.save();
    broadcastUpdate('technologies', siteData.technologies);
    res.json(siteData.technologies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blog endpoints
app.post('/api/blog', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    const newPost = {
      id: Date.now().toString(),
      ...req.body,
      date: new Date().toISOString().split('T')[0]
    };
    siteData.blog.push(newPost);
    await siteData.save();
    broadcastUpdate('blog', siteData.blog);
    res.json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/blog/:id', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    const index = siteData.blog.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      siteData.blog[index] = { ...siteData.blog[index], ...req.body };
      await siteData.save();
      broadcastUpdate('blog', siteData.blog);
      res.json(siteData.blog[index]);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/blog/:id', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.blog = siteData.blog.filter(p => p.id !== req.params.id);
    await siteData.save();
    broadcastUpdate('blog', siteData.blog);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SEO endpoints
app.put('/api/seo/:page', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    if (siteData.seo[req.params.page]) {
      siteData.seo[req.params.page] = { ...siteData.seo[req.params.page], ...req.body };
      await siteData.save();
      broadcastUpdate('seo', siteData.seo);
      res.json(siteData.seo[req.params.page]);
    } else {
      res.status(404).json({ error: 'Page not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Visitor tracking endpoints
app.post('/api/track-visitor', async (req, res) => {
  try {
    // Clean the data - remove undefined, null, empty values, and complex objects
    const cleanData = {};
    for (const [key, value] of Object.entries(req.body)) {
      // Skip if undefined, null, or empty string
      if (value === undefined || value === null || value === '') {
        continue;
      }
      
      // Handle arrays - convert to simple arrays or skip complex ones
      if (Array.isArray(value)) {
        // Only keep simple string arrays
        if (value.every(item => typeof item === 'string' || typeof item === 'number')) {
          cleanData[key] = value;
        }
        continue;
      }
      
      // Handle objects - stringify or skip
      if (typeof value === 'object') {
        try {
          cleanData[key] = JSON.stringify(value);
        } catch (e) {
          // Skip if can't stringify
        }
        continue;
      }
      
      // Keep primitive values (string, number, boolean)
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        cleanData[key] = value;
      }
    }
    
    const visitorData = {
      ...cleanData,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress,
      visitTime: new Date()
    };
    
    const visitor = new Visitor(visitorData);
    await visitor.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    // Don't fail the request, just log the error
    res.json({ success: true, warning: 'Partial tracking' });
  }
});

app.post('/api/update-session', async (req, res) => {
  try {
    const { sessionId, sessionDuration, scrollDepth, mouseMovements, clicks, touches, keyPresses } = req.body;
    await Visitor.updateOne(
      { sessionId },
      { $set: { sessionDuration, scrollDepth, mouseMovements, clicks, touches, keyPresses } },
      { sort: { visitTime: -1 } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/visitors', async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ visitTime: -1 }).limit(1000);
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/visitors/stats', async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count visitors in last 5 minutes as "current"
    const currentVisitors = await Visitor.countDocuments({
      visitTime: { $gte: fiveMinutesAgo }
    });
    
    // Count today's visitors
    const totalToday = await Visitor.countDocuments({
      visitTime: { $gte: today }
    });
    
    // Total all-time visitors
    const totalVisitors = await Visitor.countDocuments();
    
    const uniqueIPs = await Visitor.distinct('ip');
    const countries = await Visitor.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const devices = await Visitor.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]);
    const browsers = await Visitor.aggregate([
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const pages = await Visitor.aggregate([
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      currentVisitors,
      totalToday,
      totalVisitors,
      uniqueVisitors: uniqueIPs.length,
      topCountries: countries,
      deviceBreakdown: devices,
      browserBreakdown: browsers,
      topPages: pages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/visitors/:id', async (req, res) => {
  try {
    await Visitor.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/visitors', async (req, res) => {
  try {
    await Visitor.deleteMany({});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Live visitor stats endpoint
app.get('/api/visitors/live-stats', async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count visitors in last 5 minutes as "current"
    const currentVisitors = await Visitor.countDocuments({
      visitTime: { $gte: fiveMinutesAgo }
    });
    
    // Count today's visitors
    const totalToday = await Visitor.countDocuments({
      visitTime: { $gte: today }
    });
    
    // Total all-time visitors
    const totalVisitors = await Visitor.countDocuments();
    
    res.json({
      currentVisitors,
      totalToday,
      totalVisitors
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ratings management endpoints
app.get('/api/ratings', async (req, res) => {
  try {
    const ratings = await Rating.find().populate('projectId', 'title').sort({ date: -1 });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ratings/project/:projectId', async (req, res) => {
  try {
    const ratings = await Rating.find({ projectId: req.params.projectId }).sort({ date: -1 });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/ratings/:id', async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    // Update project ratings
    const project = await Project.findById(rating.projectId);
    if (project && project.ratings) {
      project.ratings.total -= rating.rating;
      project.ratings.count -= 1;
      project.ratings.breakdown[rating.rating] = Math.max(0, (project.ratings.breakdown[rating.rating] || 0) - 1);
      project.ratings.average = project.ratings.count > 0 ? project.ratings.total / project.ratings.count : 0;
      await project.save();
    }
    
    await Rating.findByIdAndDelete(req.params.id);
    const projects = await Project.find();
    broadcastUpdate('projects', projects);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/ratings/:id/approve', async (req, res) => {
  try {
    const rating = await Rating.findByIdAndUpdate(
      req.params.id,
      { approved: req.body.approved },
      { new: true }
    );
    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Testimonial submission endpoints
app.post('/api/testimonials/submit', async (req, res) => {
  try {
    const submission = new TestimonialSubmission(req.body);
    await submission.save();
    res.json({ success: true, message: 'Thank you for your testimonial! It will be reviewed shortly.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/testimonials/submissions', async (req, res) => {
  try {
    const submissions = await TestimonialSubmission.find().sort({ date: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/testimonials/submissions/:id/approve', async (req, res) => {
  try {
    const submission = await TestimonialSubmission.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    
    // Add to testimonials if approved
    if (submission.approved) {
      const siteData = await SiteData.findOne();
      const newTestimonial = {
        id: Date.now().toString(),
        name: submission.name,
        role: `${submission.role}${submission.company ? ', ' + submission.company : ''}`,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${submission.name}`,
        rating: submission.rating,
        text: submission.testimonial
      };
      siteData.testimonials.push(newTestimonial);
      await siteData.save();
      broadcastUpdate('testimonials', siteData.testimonials);
    }
    
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/testimonials/submissions/:id', async (req, res) => {
  try {
    await TestimonialSubmission.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ success: true, user: { id: user._id, username: user.username, role: user.role } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// File upload endpoint (for images/videos/general files)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename, size: req.file.size, mimeType: req.file.mimetype });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

// Endpoint to handle download file link (MediaFire/MEGA)
app.post('/api/upload/link', async (req, res) => {
  const { link, filename } = req.body;
  if (!link || !filename) {
    return res.status(400).json({ error: 'Link and filename are required' });
  }
  
  // In a real-world scenario, you might want to validate the link format 
  // or even download the file to check its integrity/size.
  // For this task, we will simply store the link as the "file URL".
  
  // We will assume the link is the final download URL.
  // The frontend will handle the direct download logic.
  
  // For the purpose of this API, we return the link as the "url"
  res.json({ url: link, filename: filename, isExternal: true });
});

// Serve static files from dist folder (production build)
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log('Serving static files from dist/');
} else {
  // Fallback to current directory for development
  app.use(express.static(__dirname));
  console.log('Serving static files from root directory');
}

// ===== CHATBOT API =====

// Get chatbot settings
app.get('/api/chatbot/settings', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    res.json(siteData.chatbot || { enabled: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update chatbot settings
app.put('/api/chatbot/settings', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    siteData.chatbot = { ...siteData.chatbot, ...req.body };
    await siteData.save();
    broadcastUpdate('chatbot', siteData.chatbot);
    res.json(siteData.chatbot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chatbot message endpoint with AI Agent (SMART)
const { spawn } = require('child_process');
const chatSessions = new Map();

app.post('/api/chatbot/message', async (req, res) => {
  try {
    const { message, sessionId, imageUrl, conversationHistory } = req.body;
    const startTime = Date.now();
    
    // Check if chatbot is enabled
    const siteData = await SiteData.findOne();
    if (!siteData.chatbot || !siteData.chatbot.enabled) {
      return res.json({ response: 'عذراً، الشات بوت غير متاح حالياً.' });
    }

    // Prepare conversation history for AI agent
    let historyJson = null;
    if (conversationHistory && conversationHistory.length > 0) {
      // Convert conversation history to the format expected by AI agent
      historyJson = JSON.stringify(conversationHistory);
    }

    // Use AI Agent with conversation history and image data
    const python = spawn('python3.11', [path.join(__dirname, 'ai_agent_cli.py')]);
    
    const inputData = {
      message: message,
      conversationHistory: conversationHistory || [],
      imageUrl: imageUrl || null
    };
    
    python.stdin.write(JSON.stringify(inputData));
    python.stdin.end();

    let dataString = '';
    let errorString = '';

    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    python.on('close', async (code) => {
      const responseTime = Date.now() - startTime;
      let botResponse = '';
      
      if (code === 0 && dataString) {
        try {
          const result = JSON.parse(dataString);
          botResponse = result.response;
        } catch (e) {
          botResponse = dataString.trim();
        }
      } else {
        console.error('AI Agent error:', errorString);
        botResponse = 'عذراً، أنا غير قادر على الإجابة في الوقت الحالي. يرجى الاتصال بالجامعة على الرقم 0798877440 للمساعدة.';
      }

      // Save conversation to database
      try {
        console.log('Attempting to save conversation...');
        const conversation = new ChatbotConversation({
          userMessage: message,
          botResponse: botResponse,
          imageUrl: imageUrl || null,
          imageAnalysis: imageUrl ? 'Image uploaded and analyzed' : null,
          sessionId: sessionId || null,
          responseTime: responseTime,
          ipAddress: req.ip || req.connection.remoteAddress,
          conversationContext: conversationHistory || [],
          metadata: {
            browser: req.headers['user-agent'] || 'Unknown',
            language: req.headers['accept-language'] || 'ar',
            source: 'website',
            hasImage: !!imageUrl
          }
        });
        await conversation.save();
        console.log('Conversation saved successfully!');
      } catch (dbError) {
        console.error('Error saving conversation:', dbError);
        console.error('Conversation object that failed to save:', JSON.stringify(conversation, null, 2));
      }

      res.json({ response: botResponse, sessionId: sessionId, conversationHistory: conversationHistory || [] });
    });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.json({
      response: 'عذراً، أنا غير قادر على الإجابة في الوقت الحالي. يرجى الاتصال بالجامعة على الرقم 0798877440 للمساعدة.',
    });
  }
});

// ===== LIVE NOTIFICATIONS API =====

// Get active live notifications
app.get('/api/notifications/active', async (req, res) => {
  try {
    const now = new Date();
    const notifications = await LiveNotification.find({
      active: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching active notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get all live notifications (Dashboard)
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await LiveNotification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Create a new live notification
app.post('/api/notifications', async (req, res) => {
  try {
    const notification = new LiveNotification(req.body);
    await notification.save();
    res.json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Update a live notification
app.put('/api/notifications/:id', async (req, res) => {
  try {
    const notification = await LiveNotification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Delete a live notification
app.delete('/api/notifications/:id', async (req, res) => {
  try {
    await LiveNotification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Fallback for all other routes to serve the index.html (for client-side routing)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
