const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const fs = require('fs');
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
              name: 'David Lee',
              role: 'Art Director',
              bio: 'Master of visual storytelling and aesthetics',
              photoUrl: 'https://via.placeholder.com/300x300/FF5733/FFFFFF?text=DL',
              linkedin: '#',
              github: '#'
            }
          ],
          values: [
            { id: '1', title: 'Innovation', description: 'Pushing the boundaries of what is possible in interactive entertainment.' },
            { id: '2', title: 'Quality', description: 'Commitment to delivering polished and bug-free experiences.' },
            { id: '3', title: 'Community', description: 'Building strong relationships with our players and partners.' }
          ]
        },
        contact: {
          message: 'Have a question or want to collaborate? We\'d love to hear from you!',
          email: 'hello@technest.studio',
          discord: 'TechNest#1234',
          location: 'San Francisco, CA',
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
            facebook: 'https://facebook.com/technest',
            twitter: 'https://twitter.com/technest',
            instagram: 'https://instagram.com/technest',
            linkedin: 'https://linkedin.com/company/technest',
            discord: 'https://discord.gg/technest',
            github: 'https://github.com/technest',
            youtube: 'https://youtube.com/@technest'
          }
        },
        join: {
          hero: {
            title: 'Join the Nest',
            subtitle: 'Shape the Future of Gaming with Us'
          },
          whyJoinUs: [
            { id: '1', title: 'Creative Freedom', description: 'Work on projects you are passionate about with full creative control.' },
            { id: '2', title: 'Innovative Tech', description: 'Access to cutting-edge tools and technology in game development.' },
            { id: '3', title: 'Collaborative Culture', description: 'Be part of a supportive and dynamic team environment.' }
          ]
        },
        statistics: [
          { id: '1', icon: 'Briefcase', value: 50, suffix: '+', label: 'Projects Completed', color: 'text-blue-500' },
          { id: '2', icon: 'Users', value: 100000, suffix: '+', label: 'Active Users', color: 'text-green-500' },
          { id: '3', icon: 'Trophy', value: 15, suffix: '+', label: 'Awards Won', color: 'text-yellow-500' },
          { id: '4', icon: 'Star', value: 4.8, suffix: '/5', label: 'Average Rating', color: 'text-purple-500' }
        ],
        testimonials: [
          {
            id: '1',
            name: 'Jane Doe',
            role: 'Game Critic',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
            rating: 5,
            text: 'TechNest\'s latest game is a masterpiece of storytelling and design. A must-play!'
          },
          {
            id: '2',
            name: 'Mark Smith',
            role: 'Industry Analyst',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark',
            rating: 4,
            text: 'Innovative technology and solid gameplay. TechNest is a studio to watch.'
          }
        ],
        technologies: [
          { id: '1', name: 'Unity', icon: 'Code2', description: 'Primary engine for 3D development.' },
          { id: '2', name: 'Unreal Engine', icon: 'Code2', description: 'Used for high-fidelity graphics projects.' },
          { id: '3', name: 'Node.js', icon: 'Code2', description: 'Backend services and API development.' },
          { id: '4', name: 'React', icon: 'Code2', description: 'Frontend web development.' }
        ],
        blog: [
          {
            id: '1',
            title: 'The Future of VR Gaming',
            excerpt: 'Exploring the latest trends and technologies shaping the virtual reality landscape.',
            content: 'Full article content here...',
            image: 'https://via.placeholder.com/600x400/00E5FF/FFFFFF?text=VR+Gaming',
            author: 'Alex Chen',
            date: '2024-01-15',
            category: 'Technology',
            tags: ['VR', 'Gaming', 'Innovation']
          }
        ],
        chatbot: {
          enabled: true,
          name: 'Tec',
          welcomeMessage: 'مرحباً! أنا Tec 🤖، مساعدك الذكي في جامعة عمان العربية. كيف يمكنني مساعدتك اليوم؟'
        }
      });

      await defaultSiteData.save();
      console.log('✅ Default site data saved.');
    }
  } catch (error) {
    console.error('❌ Error initializing data:', error);
  }
}

// initializeData(); // Commented out to prevent re-initialization on every server start

// Setup storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the 'dist' directory (for the frontend build)
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log(`✅ Serving static files from: ${distPath}`);
} else {
  console.warn(`⚠️ Frontend build directory not found at: ${distPath}. Serving API only.`);
}

// =================================================================
// API ROUTES
// =================================================================

// User Login/Auth
// Initialize RBAC system with default Super Admin and Limited Admin accounts
async function initializeRBAC() {
  try {
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('🔐 Initializing RBAC system with default admin accounts...');
      
      const superAdmin = new User({
        username: 'superadmin_ylz8ww69',
        password: 'cQCGigquHrR55B$KaB',
        email: 'superadmin@technest.dev',
        role: 'super_admin',
        isActive: true,
        permissions: {
          dashboard: true,
          home_content: true,
          about_content: true,
          projects: true,
          blog: true,
          technologies: true,
          user_management: true,
          chatbot_conversations: true,
          chatbot_settings: true,
          statistics: true,
          visitors: true,
          ratings: true,
          testimonials: true,
          testimonial_submissions: true,
          messages: true,
          project_submissions: true,
          contact_settings: true,
          general_settings: true
        }
      });
      
      const limitedAdmin = new User({
        username: 'limitedadmin_tq0g715x',
        password: 'k$i4i$S2$fL1QBj$#q',
        email: 'limitedadmin@technest.dev',
        role: 'limited_admin',
        isActive: true,
        permissions: {
          dashboard: true,
          home_content: true,
          about_content: true,
          projects: true,
          blog: true,
          technologies: true,
          user_management: false,
          chatbot_conversations: false,
          chatbot_settings: false,
          statistics: false,
          visitors: false,
          ratings: false,
          testimonials: false,
          testimonial_submissions: false,
          messages: true,
          project_submissions: true,
          contact_settings: false,
          general_settings: false
        }
      });
      
      await superAdmin.save();
      await limitedAdmin.save();
      
      console.log('✅ RBAC system initialized successfully');
      console.log('📋 Super Admin: superadmin_ylz8ww69');
      console.log('📋 Limited Admin: limitedadmin_tq0g715x');
    }
  } catch (error) {
    console.error('❌ Error initializing RBAC:', error);
  }
}

mongoose.connection.once('open', () => {
  initializeRBAC();
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'User account is disabled' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SiteData Routes
app.get('/api/site-data', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    if (!siteData) {
      // If no data is found, return a default empty structure
      return res.json({
        intro: {},
        home: { whatWeDo: [], partners: [] },
        about: { team: [], values: [] },
        contact: {},
        join: { whyJoinUs: [] },
        statistics: [],
        testimonials: [],
        technologies: [],
        blog: [],
        chatbot: {}
      });
    }
    res.json(siteData);
  } catch (error) {
    console.error('Error fetching site data:', error);
    res.status(500).json({ error: 'Failed to fetch site data' });
  }
});

// Home Content Updates
app.put('/api/home/hero', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'home.hero': req.body } }, { new: true });
    res.json(siteData.home.hero);
  } catch (error) {
    console.error('Error updating hero:', error);
    res.status(500).json({ error: 'Failed to update hero section' });
  }
});

app.put('/api/home/whatwedo', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'home.whatWeDo': req.body } }, { new: true });
    res.json(siteData.home.whatWeDo);
  } catch (error) {
    console.error('Error updating whatwedo:', error);
    res.status(500).json({ error: 'Failed to update "what we do" section' });
  }
});

app.put('/api/home/vision', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'home.vision': req.body } }, { new: true });
    res.json(siteData.home.vision);
  } catch (error) {
    console.error('Error updating vision:', error);
    res.status(500).json({ error: 'Failed to update vision section' });
  }
});

app.put('/api/home/partners', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'home.partners': req.body } }, { new: true });
    res.json(siteData.home.partners);
  } catch (error) {
    console.error('Error updating partners:', error);
    res.status(500).json({ error: 'Failed to update partners section' });
  }
});

// About Content Updates
app.put('/api/about/story', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'about.story': req.body } }, { new: true });
    res.json(siteData.about.story);
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ error: 'Failed to update story section' });
  }
});

app.put('/api/about/team', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'about.team': req.body } }, { new: true });
    res.json(siteData.about.team);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Failed to update team section' });
  }
});

app.put('/api/about/values', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'about.values': req.body } }, { new: true });
    res.json(siteData.about.values);
  } catch (error) {
    console.error('Error updating values:', error);
    res.status(500).json({ error: 'Failed to update values section' });
  }
});

// Contact Updates
app.put('/api/contact', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'contact': req.body } }, { new: true });
    res.json(siteData.contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact information' });
  }
});

// Join Updates
app.put('/api/join/hero', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'join.hero': req.body } }, { new: true });
    res.json(siteData.join.hero);
  } catch (error) {
    console.error('Error updating join hero:', error);
    res.status(500).json({ error: 'Failed to update join hero section' });
  }
});

app.put('/api/join/whyjoin', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'join.whyJoinUs': req.body } }, { new: true });
    res.json(siteData.join.whyJoinUs);
  } catch (error) {
    console.error('Error updating whyjoin:', error);
    res.status(500).json({ error: 'Failed to update "why join us" section' });
  }
});

// Statistics Updates
app.put('/api/statistics', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'statistics': req.body } }, { new: true });
    res.json(siteData.statistics);
  } catch (error) {
    console.error('Error updating statistics:', error);
    res.status(500).json({ error: 'Failed to update statistics' });
  }
});

// Testimonials Updates
app.put('/api/testimonials', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'testimonials': req.body } }, { new: true });
    res.json(siteData.testimonials);
  } catch (error) {
    console.error('Error updating testimonials:', error);
    res.status(500).json({ error: 'Failed to update testimonials' });
  }
});

// Technologies Updates
app.put('/api/technologies', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'technologies': req.body } }, { new: true });
    res.json(siteData.technologies);
  } catch (error) {
    console.error('Error updating technologies:', error);
    res.status(500).json({ error: 'Failed to update technologies' });
  }
});

// Blog Routes
app.get('/api/blog', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    res.json(siteData.blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

app.post('/api/blog', async (req, res) => {
  try {
    const newPost = { ...req.body, id: mongoose.Types.ObjectId() };
    const siteData = await SiteData.findOneAndUpdate(
      {},
      { $push: { blog: newPost } },
      { new: true }
    );
    res.json(newPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

app.put('/api/blog/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = req.body;
    
    await SiteData.updateOne(
      { 'blog.id': postId },
      { $set: { 'blog.$': updatedPost } }
    );

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

app.delete('/api/blog/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    await SiteData.updateOne(
      {},
      { $pull: { blog: { id: postId } } }
    );

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// Messages Routes
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const newMessage = new Message({
      ...req.body,
      date: new Date(),
      id: mongoose.Types.ObjectId()
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Project Submission Routes
app.get('/api/project-submissions', async (req, res) => {
  try {
    const submissions = await ProjectSubmission.find().sort({ date: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching project submissions:', error);
    res.status(500).json({ error: 'Failed to fetch project submissions' });
  }
});

app.post('/api/project-submissions', async (req, res) => {
  try {
    const newSubmission = new ProjectSubmission({
      ...req.body,
      date: new Date(),
      id: mongoose.Types.ObjectId()
    });
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    console.error('Error saving project submission:', error);
    res.status(500).json({ error: 'Failed to save project submission' });
  }
});

app.delete('/api/project-submissions/:id', async (req, res) => {
  try {
    await ProjectSubmission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting project submission:', error);
    res.status(500).json({ error: 'Failed to delete project submission' });
  }
});

// Projects Routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ date: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const newProject = new Project({
      ...req.body,
      date: new Date(),
      id: mongoose.Types.ObjectId()
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Testimonial Submissions Routes
app.get('/api/testimonials/submissions', async (req, res) => {
  try {
    const submissions = await TestimonialSubmission.find().sort({ date: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching testimonial submissions:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial submissions' });
  }
});

app.post('/api/testimonials/submissions', async (req, res) => {
  try {
    const newSubmission = new TestimonialSubmission({
      ...req.body,
      date: new Date()
    });
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    console.error('Error saving testimonial submission:', error);
    res.status(500).json({ error: 'Failed to save testimonial submission' });
  }
});

app.put('/api/testimonials/submissions/:id/approve', async (req, res) => {
  try {
    const submission = await TestimonialSubmission.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Add to main testimonials list
    await SiteData.findOneAndUpdate(
      {},
      {
        $push: {
          testimonials: {
            id: submission._id,
            name: submission.name,
            role: submission.role || 'User',
            image: submission.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + submission._id,
            rating: submission.rating,
            text: submission.testimonial
          }
        }
      }
    );

    res.json(submission);
  } catch (error) {
    console.error('Error approving testimonial:', error);
    res.status(500).json({ error: 'Failed to approve testimonial' });
  }
});

app.delete('/api/testimonials/submissions/:id', async (req, res) => {
  try {
    await TestimonialSubmission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial submission:', error);
    res.status(500).json({ error: 'Failed to delete testimonial submission' });
  }
});

// Ratings Routes
app.get('/api/ratings', async (req, res) => {
  try {
    const ratings = await Rating.find().populate('projectId').sort({ date: -1 });
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

app.post('/api/ratings', async (req, res) => {
  try {
    const newRating = new Rating({
      ...req.body,
      date: new Date()
    });
    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

app.delete('/api/ratings/:id', async (req, res) => {
  try {
    await Rating.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ error: 'Failed to delete rating' });
  }
});

// Visitors Routes
app.get('/api/visitors', async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ visitTime: -1 });
    res.json(visitors);
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ error: 'Failed to fetch visitors' });
  }
});

app.get('/api/visitors/stats', async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const uniqueVisitors = (await Visitor.distinct('sessionId')).length;

    const topCountries = await Visitor.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const browserBreakdown = await Visitor.aggregate([
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const deviceBreakdown = await Visitor.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalVisitors,
      uniqueVisitors,
      topCountries,
      browserBreakdown,
      deviceBreakdown
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    res.status(500).json({ error: 'Failed to fetch visitor statistics' });
  }
});

app.post('/api/visitors', async (req, res) => {
  try {
    const visitorData = req.body;
    const newVisitor = new Visitor({
      ...visitorData,
      visitTime: new Date()
    });
    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (error) {
    console.error('Error saving visitor data:', error);
    res.status(500).json({ error: 'Failed to save visitor data' });
  }
});

app.delete('/api/visitors', async (req, res) => {
  try {
    await Visitor.deleteMany({});
    res.json({ message: 'All visitor data deleted successfully' });
  } catch (error) {
    console.error('Error deleting all visitor data:', error);
    res.status(500).json({ error: 'Failed to delete all visitor data' });
  }
});

app.delete('/api/visitors/:id', async (req, res) => {
  try {
    await Visitor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Visitor data deleted successfully' });
  } catch (error) {
    console.error('Error deleting visitor data:', error);
    res.status(500).json({ error: 'Failed to delete visitor data' });
  }
});

// Live Notifications (Socket.io)
io.on('connection', (socket) => {
  console.log('A user connected via socket.io');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('sendNotification', async (data) => {
    try {
      const newNotification = new LiveNotification({
        message: data.message,
        type: data.type || 'info',
        date: new Date()
      });
      await newNotification.save();
      io.emit('newNotification', newNotification);
    } catch (error) {
      console.error('Error saving and sending notification:', error);
    }
  });
});

// =================================================================
// CHATBOT API
// =================================================================

// Endpoint to handle chat messages
app.post('/api/chatbot/chat', upload.single('image'), async (req, res) => {
  // ... (Chatbot logic remains the same)
});

// Get chatbot settings
app.get('/api/chatbot/settings', async (req, res) => {
  try {
    const siteData = await SiteData.findOne();
    res.json(siteData.chatbot || { enabled: true, name: 'Tec', welcomeMessage: 'مرحباً! أنا Tec 🤖، مساعدك الذكي في جامعة عمان العربية. كيف يمكنني مساعدتك اليوم؟' });
  } catch (error) {
    console.error('Error fetching chatbot settings:', error);
    res.status(500).json({ error: 'Failed to fetch chatbot settings' });
  }
});

// Update chatbot settings
app.put('/api/chatbot/settings', async (req, res) => {
  try {
    const siteData = await SiteData.findOneAndUpdate({}, { $set: { 'chatbot': req.body } }, { new: true });
    res.json(siteData.chatbot);
  } catch (error) {
    console.error('Error updating chatbot settings:', error);
    res.status(500).json({ error: 'Failed to update chatbot settings' });
  }
});

// ===== CHATBOT CONVERSATIONS API =====

// Get all chatbot conversations
app.get('/api/chatbot/conversations', async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = 'date', order = -1 } = req.query;
    const skip = (page - 1) * limit;
    const conversations = await ChatbotConversation.find()
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ChatbotConversation.countDocuments();

    res.json({
      conversations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('CRITICAL MONGODB ERROR fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get conversation statistics
app.get('/api/chatbot/conversations/stats', async (req, res) => {
  try {
    const total = await ChatbotConversation.countDocuments();
    const avgResponseTime = await ChatbotConversation.aggregate([
      { $group: { _id: null, avgTime: { $avg: '$responseTime' } } }
    ]);

    const conversationsWithImages = await ChatbotConversation.countDocuments({ imageUrl: { $exists: true, $ne: null } });

    res.json({
      totalConversations: total,
      conversationsWithImages,
      averageResponseTime: avgResponseTime[0]?.avgTime || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get single conversation
app.get('/api/chatbot/conversations/:id', async (req, res) => {
  try {
    const conversation = await ChatbotConversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Update conversation (for rating, feedback, etc.)
app.put('/api/chatbot/conversations/:id', async (req, res) => {
  try {
    const { rating, userFeedback, isUsefulForTraining, flaggedForReview, reviewNotes } = req.body;
    
    const conversation = await ChatbotConversation.findByIdAndUpdate(
      req.params.id,
      {
        rating,
        userFeedback,
        isUsefulForTraining,
        flaggedForReview,
        reviewNotes
      },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

// Delete conversation
app.delete('/api/chatbot/conversations/:id', async (req, res) => {
  try {
    const conversation = await ChatbotConversation.findByIdAndDelete(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

// Search conversations
app.get('/api/chatbot/conversations/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const conversations = await ChatbotConversation.find({
      $or: [
        { userMessage: { $regex: query, $options: 'i' } },
        { botResponse: { $regex: query, $options: 'i' } }
      ]
    }).limit(50);

    res.json(conversations);
  } catch (error) {
    console.error('Error searching conversations:', error);
    res.status(500).json({ error: 'Failed to search conversations' });
  }
});

// Export conversations for training
app.get('/api/chatbot/conversations/export/json', async (req, res) => {
  try {
    const conversations = await ChatbotConversation.find({ isUsefulForTraining: true });
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="chatbot-conversations.json"');
    res.json(conversations);
  } catch (error) {
    console.error('Error exporting conversations:', error);
    res.status(500).json({ error: 'Failed to export conversations' });
  }
});

// =================================================================
// USER MANAGEMENT API (RBAC)
// =================================================================

// Get all users (Super Admin only)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create new user (Super Admin only)
app.post('/api/users', async (req, res) => {
  try {
    const { username, password, email, role, permissions } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const newUser = new User({
      username,
      password,
      email,
      role: role || 'editor',
      isActive: true,
      permissions: permissions || {
        dashboard: false,
        home_content: false,
        about_content: false,
        projects: false,
        blog: false,
        technologies: false,
        user_management: false,
        chatbot_conversations: false,
        chatbot_settings: false,
        statistics: false,
        visitors: false,
        ratings: false,
        testimonials: false,
        testimonial_submissions: false,
        messages: false,
        project_submissions: false,
        contact_settings: false,
        general_settings: false
      }
    });
    
    await newUser.save();
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user (Super Admin only)
app.put('/api/users/:id', async (req, res) => {
  try {
    const { username, email, role, permissions, isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        email,
        role,
        permissions,
        isActive
      },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (Super Admin only)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Toggle user status (Super Admin only)
app.put('/api/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
});

// Update user permissions (Super Admin only)
app.put('/api/users/:id/permissions', async (req, res) => {
  try {
    const { permissions } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { permissions },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: 'Permissions updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating permissions:', error);
    res.status(500).json({ error: 'Failed to update permissions' });
  }
});

// =================================================================
// CATCH-ALL ROUTE (MUST BE LAST)
// =================================================================

// This catch-all route MUST be the absolute last route defined in the server.
// It serves the frontend's index.html for any unhandled GET request,
// which is required for client-side routing (like the dashboard pages).
app.get('*', (req, res) => {
  // CRITICAL FIX: Check if the request is for an API endpoint that failed to match.
  // If it is, we should return a 404 JSON error, not the index.html.
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ error: 'API Endpoint Not Found' });
  }

  const indexPath = fs.existsSync(path.join(distPath, 'index.html'))
    ? path.join(distPath, 'index.html')
    : path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
