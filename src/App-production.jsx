import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import JoinPage from './pages/JoinPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

// Components
import IntroVideo from './components/IntroVideo';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Use same origin for API in production
const API_URL = window.location.origin;

function App() {
  const [socket, setSocket] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [introWatched, setIntroWatched] = useState(false);

  useEffect(() => {
    // Check if intro was already watched in this session
    const watched = sessionStorage.getItem('introWatched');
    if (watched) {
      setShowIntro(false);
      setIntroWatched(true);
    }

    // Fetch initial data
    fetch(`${API_URL}/api/data`)
      .then(res => res.json())
      .then(data => setSiteData(data))
      .catch(err => console.error('Error fetching data:', err));

    // Connect to WebSocket
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('data-update', ({ type, data }) => {
      console.log('Data update received:', type);
      setSiteData(prevData => {
        const newData = { ...prevData };
        const keys = type.split('.');
        
        if (keys.length === 1) {
          newData[keys[0]] = data;
        } else if (keys.length === 2) {
          newData[keys[0]][keys[1]] = data;
        }
        
        return newData;
      });
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleIntroEnd = () => {
    setShowIntro(false);
    setIntroWatched(true);
    sessionStorage.setItem('introWatched', 'true');
  };

  const handleSkipIntro = () => {
    setShowIntro(false);
    setIntroWatched(true);
    sessionStorage.setItem('introWatched', 'true');
  };

  if (!siteData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-2xl animate-pulse">Loading TechNest...</div>
      </div>
    );
  }

  if (showIntro && siteData.intro.enabled && !introWatched) {
    return (
      <IntroVideo
        videoUrl={siteData.intro.videoUrl}
        posterUrl={siteData.intro.posterUrl}
        onEnd={handleIntroEnd}
        onSkip={handleSkipIntro}
      />
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/*" element={<DashboardPage siteData={siteData} apiUrl={API_URL} />} />
          <Route
            path="/*"
            element={
              <>
                <Navigation />
                <Routes>
                  <Route path="/" element={<HomePage data={siteData.home} />} />
                  <Route path="/projects" element={<ProjectsPage projects={siteData.projects} />} />
                  <Route path="/about" element={<AboutPage data={siteData.about} />} />
                  <Route path="/contact" element={<ContactPage data={siteData.contact} apiUrl={API_URL} />} />
                  <Route path="/join" element={<JoinPage data={siteData.join} apiUrl={API_URL} />} />
                </Routes>
                <Footer contact={siteData.contact} />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

