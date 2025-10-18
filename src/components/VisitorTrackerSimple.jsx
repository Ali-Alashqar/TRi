import { useEffect } from 'react';

const VisitorTrackerSimple = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Generate session ID
        let sessionId = sessionStorage.getItem('visitor_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('visitor_session_id', sessionId);
        }

        // Simple visitor data
        const visitorData = {
          sessionId,
          page: window.location.pathname,
          referrer: document.referrer || 'direct',
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenResolution: `${screen.width}x${screen.height}`,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          platform: navigator.platform,
          cookiesEnabled: navigator.cookieEnabled,
          doNotTrack: navigator.doNotTrack === '1',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          timezoneOffset: new Date().getTimezoneOffset()
        };

        // Send to backend
        await fetch('/api/track-visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(visitorData)
        });

      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    trackVisitor();
  }, []);

  return null;
};

export default VisitorTrackerSimple;

