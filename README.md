# TechNest - Game Development Studio Website

A modern, full-featured website for TechNest game development studio with real-time admin dashboard and CMS capabilities.

## Features

- 🎮 **Modern Design**: Sleek, professional design with smooth animations
- 📱 **Responsive**: Works perfectly on all devices
- 🎬 **Intro Video**: Optional fullscreen intro video on first visit
- 🎨 **Dynamic Content**: Real-time content management system
- 🔐 **Admin Dashboard**: Secure admin panel for content management
- 📊 **Real-time Updates**: WebSocket-based live updates
- 📝 **Contact Forms**: Contact and job application forms
- 🎯 **Project Showcase**: Beautiful project portfolio with filtering
- 👥 **Team Section**: Meet the team with social links
- 🔍 **SEO Optimized**: Customizable meta tags for each page

## Tech Stack

### Frontend
- React 19.1.0
- React Router DOM 7.6.1
- Tailwind CSS 4.1.7
- Framer Motion (animations)
- Radix UI (components)
- Socket.io Client (real-time updates)

### Backend
- Node.js + Express 5.1.0
- Socket.io (WebSocket server)
- Multer (file uploads)
- JSON file storage

## Deployment on Render.com

### Quick Deploy

1. **Create a New Web Service** on Render.com
2. **Connect your repository** or upload the files
3. **Configure the service**:
   - **Name**: technest (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter

4. **Click "Create Web Service"**

### Environment Variables (Optional)

- `PORT`: Automatically set by Render (default: 3000)
- `NODE_ENV`: Set to `production`

### Important Notes

- ✅ The build process takes 2-5 minutes
- ✅ First deployment may take longer
- ✅ Free tier sleeps after 15 minutes of inactivity
- ✅ Uploaded files and data persist in the instance

## Local Development

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development URLs

- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:3000 (Express server)

## Admin Access

### Default Credentials

- **Username**: `technest_admin_2025`
- **Password**: `TN@SecurePass#2025!Admin`

⚠️ **Important**: Change these credentials after first login!

### Admin Dashboard Features

- ✏️ Edit all page content
- 🖼️ Upload images and files
- 📋 Manage projects
- 👥 Manage team members
- 📧 View contact messages
- 💼 View job applications
- 🎯 Manage SEO settings
- 🎬 Configure intro video

## Project Structure

```
technest/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   └── main.jsx        # App entry point
├── public/             # Static assets
├── server.js           # Express backend server
├── package.json        # Dependencies and scripts
└── index.html          # HTML template
```

## API Endpoints

### Public Endpoints
- `GET /api/data` - Get all site data
- `POST /api/contact/messages` - Submit contact form
- `POST /api/join/applications` - Submit job application
- `POST /api/auth/login` - Admin login

### Admin Endpoints (require authentication)
- `PUT /api/intro` - Update intro settings
- `PUT /api/home/*` - Update home page sections
- `GET/POST/PUT/DELETE /api/projects/*` - Manage projects
- `PUT /api/about/*` - Update about page
- `PUT /api/contact` - Update contact info
- `PUT /api/join/*` - Update careers page
- `POST /api/upload` - Upload files

## Customization

### Changing Colors

Edit `src/App.css` to change the color scheme:

```css
:root {
  --primary: 186 100% 50%;      /* Cyan */
  --secondary: 262 52% 47%;     /* Purple */
}
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/Navigation.jsx`

### Modifying Content

- **Via Admin Dashboard**: Login and use the CMS
- **Via Code**: Edit default data in `server.js`

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Change port in server.js or set environment variable
PORT=3001 npm start
```

### WebSocket Connection Issues

- Ensure firewall allows WebSocket connections
- Check CORS settings in `server.js`

## Support

For issues or questions:
- 📧 Email: hello@technest.studio
- 💬 Discord: TechNest#1234

## License

© 2025 TechNest. All rights reserved.

