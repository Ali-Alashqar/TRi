import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Get visitor information
        const visitorData = {
          page: window.location.pathname + window.location.search,
          referrer: document.referrer || 'Direct',
          userAgent: navigator.userAgent,
          language: navigator.language,
          languages: navigator.languages || [navigator.language],
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          
          // Device detection
          isMobile: /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
          isTablet: /Tablet|iPad/i.test(navigator.userAgent),
          isDesktop: !/Mobile|Android|iPhone|iPad|iPod|Tablet/i.test(navigator.userAgent),
          
          // Browser detection
          browser: getBrowser(),
          browserVersion: getBrowserVersion(),
          
          // OS detection
          os: getOS(),
          osVersion: getOSVersion(),
          
          // Device type
          deviceType: getDeviceType(),
          device: getDeviceInfo(),
          
          // Bot detection
          isBot: /bot|crawler|spider|crawling/i.test(navigator.userAgent)
        };

        // Try to get geolocation data from IP
        try {
          const geoResponse = await fetch('https://ipapi.co/json/');
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            visitorData.country = geoData.country_name;
            visitorData.countryCode = geoData.country_code;
            visitorData.region = geoData.region;
            visitorData.city = geoData.city;
            visitorData.latitude = geoData.latitude;
            visitorData.longitude = geoData.longitude;
            visitorData.isp = geoData.org;
          }
        } catch (geoError) {
          console.log('Could not fetch geo data:', geoError);
        }

        // Send visitor data to backend
        await fetch(`${window.location.origin}/api/track-visitor`, {
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

    // Track on page load and route change
    trackVisitor();
  }, [location]);

  return null;
}

// Helper functions for browser/OS detection
function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Unknown';
}

function getBrowserVersion() {
  const ua = navigator.userAgent;
  const match = ua.match(/(Firefox|Chrome|Safari|Edg|Opera|OPR)\/(\d+)/);
  return match ? match[2] : 'Unknown';
}

function getOS() {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Unknown';
}

function getOSVersion() {
  const ua = navigator.userAgent;
  const match = ua.match(/(Windows NT|Mac OS X|Android|iOS) ([\d._]+)/);
  return match ? match[2].replace(/_/g, '.') : 'Unknown';
}

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/Tablet|iPad/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iPhone|iPod/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

function getDeviceInfo() {
  const ua = navigator.userAgent;
  
  // Try to extract device model
  if (ua.includes('iPhone')) {
    const match = ua.match(/iPhone OS ([\d_]+)/);
    return match ? `iPhone (iOS ${match[1].replace(/_/g, '.')})` : 'iPhone';
  }
  if (ua.includes('iPad')) {
    return 'iPad';
  }
  if (ua.includes('Android')) {
    const match = ua.match(/Android ([\d.]+);.*?([^;]+) Build/);
    return match ? `${match[2].trim()} (Android ${match[1]})` : 'Android Device';
  }
  
  return getOS();
}

