import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import { io } from 'socket.io-client';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

// Lazy load pages for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Components
import MainLayout from './components/MainLayout';
import BackToTop from './components/BackToTop';
import VisitorTrackerSimple from './components/VisitorTrackerSimple';
import TecChatbot from './components/chatbot/TecChatbot';

// Use same origin for API in production
const API_URL = window.location.origin;

function App() {
  const [socket, setSocket] = useState(null);
  const [siteData, setSiteData] = useState(null);

  useEffect(() => {
    // Fetch initial data
    fetch(`${API_URL}/api/data`)
      .then(res => res.json())
      .then(data => {
        setSiteData(data);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });

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

  // Show loading spinner while data is being fetched
  if (!siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }



  return (
    <HelmetProvider>
      <Router>
        <VisitorTrackerSimple />
        <div className="min-h-screen bg-background text-foreground">
          <BackToTop />
          <TecChatbot apiUrl={API_URL} isEnabled={siteData?.chatbot?.enabled !== false} />
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard/*" element={<DashboardPage siteData={siteData} apiUrl={API_URL} />} />
              <Route path="/*" element={<MainLayout siteData={siteData} apiUrl={API_URL} />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
