import { useEffect } from 'react';

const VisitorTrackerEnhanced = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Generate or retrieve session ID
        let sessionId = sessionStorage.getItem('visitor_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('visitor_session_id', sessionId);
        }

        // Check if returning visitor
        const isReturningVisitor = localStorage.getItem('visitor_has_visited') === 'true';
        if (!isReturningVisitor) {
          localStorage.setItem('visitor_has_visited', 'true');
        }

        // Basic browser info
        const userAgent = navigator.userAgent;
        const language = navigator.language;
        const languages = navigator.languages || [language];
        const platform = navigator.platform;
        const vendor = navigator.vendor || '';
        const product = navigator.product || '';
        const productSub = navigator.productSub || '';
        const vendorSub = navigator.vendorSub || '';
        const buildID = navigator.buildID || '';
        const oscpu = navigator.oscpu || '';
        const appCodeName = navigator.appCodeName || '';
        const appName = navigator.appName || '';
        const appVersion = navigator.appVersion || '';

        // Screen info
        const screenResolution = `${screen.width}x${screen.height}`;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const colorDepth = screen.colorDepth;
        const pixelDepth = screen.pixelDepth || colorDepth;
        const pixelRatio = window.devicePixelRatio || 1;

        // Device info
        const maxTouchPoints = navigator.maxTouchPoints || 0;
        const touchSupport = 'ontouchstart' in window || maxTouchPoints > 0;
        const hardwareConcurrency = navigator.hardwareConcurrency || 0;
        const deviceMemory = navigator.deviceMemory || 0;

        // Orientation
        const screenOrientation = screen.orientation?.type || '';
        const screenOrientationAngle = screen.orientation?.angle || 0;

        // Features detection
        const cookiesEnabled = navigator.cookieEnabled;
        const doNotTrack = navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes';
        const javaEnabled = navigator.javaEnabled ? navigator.javaEnabled() : false;

        // Storage detection
        let localStorageEnabled = false;
        let sessionStorageEnabled = false;
        try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          localStorageEnabled = true;
        } catch (e) {}
        try {
          sessionStorage.setItem('test', 'test');
          sessionStorage.removeItem('test');
          sessionStorageEnabled = true;
        } catch (e) {}

        // WebSocket detection
        const webSocketEnabled = 'WebSocket' in window;

        // WebRTC detection
        const webRTCEnabled = !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);

        // Network info
        let connectionType = '';
        let effectiveType = '';
        let rtt = 0;
        let downlink = 0;
        let saveData = false;
        if (navigator.connection || navigator.mozConnection || navigator.webkitConnection) {
          const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
          connectionType = conn.type || '';
          effectiveType = conn.effectiveType || '';
          rtt = conn.rtt || 0;
          downlink = conn.downlink || 0;
          saveData = conn.saveData || false;
        }

        // Battery info
        let batteryLevel = 0;
        let batteryCharging = false;
        let batteryChargingTime = 0;
        let batteryDischargingTime = 0;
        if (navigator.getBattery) {
          try {
            const battery = await navigator.getBattery();
            batteryLevel = Math.round(battery.level * 100);
            batteryCharging = battery.charging;
            batteryChargingTime = battery.chargingTime;
            batteryDischargingTime = battery.dischargingTime;
          } catch (e) {}
        }

        // WebGL info
        let webglVendor = '';
        let webglRenderer = '';
        try {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
              webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
              webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
          }
        } catch (e) {}

        // Plugins
        const plugins = [];
        if (navigator.plugins) {
          for (let i = 0; i < navigator.plugins.length; i++) {
            plugins.push(navigator.plugins[i].name);
          }
        }

        // Canvas fingerprint
        let canvasFingerprint = '';
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          ctx.textBaseline = 'top';
          ctx.font = '14px Arial';
          ctx.textBaseline = 'alphabetic';
          ctx.fillStyle = '#f60';
          ctx.fillRect(125, 1, 62, 20);
          ctx.fillStyle = '#069';
          ctx.fillText('TechNest Tracker', 2, 15);
          ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
          ctx.fillText('TechNest Tracker', 4, 17);
          canvasFingerprint = canvas.toDataURL().substring(0, 100);
        } catch (e) {}

        // Audio fingerprint
        let audioFingerprint = '';
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const context = new AudioContext();
            const oscillator = context.createOscillator();
            const analyser = context.createAnalyser();
            const gainNode = context.createGain();
            const scriptProcessor = context.createScriptProcessor(4096, 1, 1);

            gainNode.gain.value = 0;
            oscillator.type = 'triangle';
            oscillator.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(gainNode);
            gainNode.connect(context.destination);

            scriptProcessor.onaudioprocess = function(event) {
              const output = event.outputBuffer.getChannelData(0);
              audioFingerprint = Array.from(output.slice(0, 10)).join(',');
            };

            oscillator.start(0);
            context.close();
          }
        } catch (e) {}

        // Font detection
        const fontFingerprint = '';
        // Font detection is complex and may not be reliable

        // Timezone
        const timezoneOffset = new Date().getTimezoneOffset();
        const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localTime = new Date().toISOString();

        // UTM parameters
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source') || '';
        const utmMedium = urlParams.get('utm_medium') || '';
        const utmCampaign = urlParams.get('utm_campaign') || '';
        const utmTerm = urlParams.get('utm_term') || '';
        const utmContent = urlParams.get('utm_content') || '';

        // Page info
        const page = window.location.pathname;
        const referrer = document.referrer;
        const initialReferrer = sessionStorage.getItem('initial_referrer') || referrer;
        if (!sessionStorage.getItem('initial_referrer')) {
          sessionStorage.setItem('initial_referrer', referrer);
        }

        // Pages visited
        let pagesVisited = JSON.parse(sessionStorage.getItem('pages_visited') || '[]');
        if (!pagesVisited.includes(page)) {
          pagesVisited.push(page);
          sessionStorage.setItem('pages_visited', JSON.stringify(pagesVisited));
        }

        // Scroll depth tracking
        let maxScrollDepth = 0;
        const trackScrollDepth = () => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
          maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
        };
        window.addEventListener('scroll', trackScrollDepth);

        // Ad blocker detection
        let adBlocker = false;
        try {
          const testAd = document.createElement('div');
          testAd.innerHTML = '&nbsp;';
          testAd.className = 'adsbox';
          document.body.appendChild(testAd);
          adBlocker = testAd.offsetHeight === 0;
          document.body.removeChild(testAd);
        } catch (e) {}

        // Memory info
        let memoryJsHeapSizeLimit = 0;
        let memoryJsHeapSizeUsed = 0;
        let memoryJsHeapSizeTotal = 0;
        if (performance.memory) {
          memoryJsHeapSizeLimit = performance.memory.jsHeapSizeLimit;
          memoryJsHeapSizeUsed = performance.memory.usedJSHeapSize;
          memoryJsHeapSizeTotal = performance.memory.totalJSHeapSize;
        }

        // User Agent Client Hints (if available)
        let userAgentData = {};
        if (navigator.userAgentData) {
          userAgentData = {
            brands: navigator.userAgentData.brands || [],
            mobile: navigator.userAgentData.mobile || false,
            platform: navigator.userAgentData.platform || ''
          };

          // Try to get high entropy values
          if (navigator.userAgentData.getHighEntropyValues) {
            try {
              const highEntropyValues = await navigator.userAgentData.getHighEntropyValues([
                'architecture',
                'bitness',
                'model',
                'platformVersion',
                'uaFullVersion',
                'fullVersionList',
                'wow64'
              ]);
              userAgentData = { ...userAgentData, ...highEntropyValues };
            } catch (e) {}
          }
        }

        // Collect all data
        const visitorData = {
          // Session info
          sessionId,
          isReturningVisitor,
          initialReferrer,
          pagesVisited,
          scrollDepth: maxScrollDepth,

          // Page info
          page,
          referrer,

          // UTM parameters
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,

          // Browser info
          userAgent,
          language,
          languages,
          platform,
          vendor,
          product,
          productSub,
          vendorSub,
          buildID,
          oscpu,
          appCodeName,
          appName,
          appVersion,

          // Screen info
          screenResolution,
          viewportWidth,
          viewportHeight,
          colorDepth,
          pixelDepth,
          pixelRatio,

          // Device info
          maxTouchPoints,
          touchSupport,
          hardwareConcurrency,
          deviceMemory,

          // Orientation
          screenOrientation,
          screenOrientationAngle,

          // Features
          cookiesEnabled,
          doNotTrack,
          javaEnabled,
          localStorageEnabled,
          sessionStorageEnabled,
          webSocketEnabled,
          webRTCEnabled,
          adBlocker,

          // Network
          connectionType,
          effectiveType,
          rtt,
          downlink,
          connectionSaveData: saveData,

          // Battery
          batteryLevel,
          batteryCharging,
          batteryStatusChargingTime: batteryChargingTime,
          batteryStatusDischargingTime: batteryDischargingTime,

          // WebGL
          webglVendor,
          webglRenderer,

          // Plugins
          plugins,

          // Fingerprints
          canvasFingerprint,
          audioFingerprint,
          fontFingerprint,

          // Timezone
          timezoneOffset,
          timezoneName,
          localTime,

          // Memory
          memoryJsHeapSizeLimit,
          memoryJsHeapSizeUsed,
          memoryJsHeapSizeTotal,

          // User Agent Data
          memoryUserAgentData: userAgentData
        };

        // Send to backend
        await fetch('/api/track-visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(visitorData)
        });

        // Track session duration on page unload
        const sessionStart = Date.now();
        window.addEventListener('beforeunload', async () => {
          const sessionDuration = Math.round((Date.now() - sessionStart) / 1000);
          await fetch('/api/update-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              sessionId,
              sessionDuration,
              scrollDepth: maxScrollDepth
            })
          });
        });

      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    trackVisitor();
  }, []);

  return null;
};

export default VisitorTrackerEnhanced;

