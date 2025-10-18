import { useEffect } from 'react';

const VisitorTrackerUltra = () => {
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
        const visitCount = parseInt(localStorage.getItem('visit_count') || '0') + 1;
        localStorage.setItem('visitor_has_visited', 'true');
        localStorage.setItem('visit_count', visitCount.toString());
        const firstVisit = localStorage.getItem('first_visit') || new Date().toISOString();
        if (!localStorage.getItem('first_visit')) {
          localStorage.setItem('first_visit', firstVisit);
        }

        // ==================== BASIC INFO ====================
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

        // ==================== SCREEN INFO ====================
        const screenWidth = screen.width;
        const screenHeight = screen.height;
        const screenResolution = `${screenWidth}x${screenHeight}`;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const colorDepth = screen.colorDepth;
        const pixelDepth = screen.pixelDepth || colorDepth;
        const pixelRatio = window.devicePixelRatio || 1;
        const screenAvailWidth = screen.availWidth;
        const screenAvailHeight = screen.availHeight;
        const screenLeft = window.screenLeft || window.screenX || 0;
        const screenTop = window.screenTop || window.screenY || 0;

        // ==================== DEVICE INFO ====================
        const maxTouchPoints = navigator.maxTouchPoints || 0;
        const touchSupport = 'ontouchstart' in window || maxTouchPoints > 0;
        const hardwareConcurrency = navigator.hardwareConcurrency || 0;
        const deviceMemory = navigator.deviceMemory || 0;
        const devicePixelRatio = window.devicePixelRatio || 1;

        // ==================== ORIENTATION ====================
        const screenOrientation = screen.orientation?.type || window.orientation || '';
        const screenOrientationAngle = screen.orientation?.angle || window.orientation || 0;

        // ==================== FEATURES DETECTION ====================
        const cookiesEnabled = navigator.cookieEnabled;
        const doNotTrack = navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes' || window.doNotTrack === '1';
        const javaEnabled = navigator.javaEnabled ? navigator.javaEnabled() : false;

        // Storage detection
        let localStorageEnabled = false;
        let sessionStorageEnabled = false;
        let indexedDBEnabled = false;
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
        try {
          indexedDBEnabled = !!window.indexedDB;
        } catch (e) {}

        // Web APIs detection
        const webSocketEnabled = 'WebSocket' in window;
        const webRTCEnabled = !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
        const webWorkersEnabled = typeof Worker !== 'undefined';
        const serviceWorkerEnabled = 'serviceWorker' in navigator;
        const notificationsEnabled = 'Notification' in window;
        const geolocationEnabled = 'geolocation' in navigator;
        const webGLEnabled = (() => {
          try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
          } catch (e) {
            return false;
          }
        })();
        const webGL2Enabled = (() => {
          try {
            const canvas = document.createElement('canvas');
            return !!canvas.getContext('webgl2');
          } catch (e) {
            return false;
          }
        })();

        // ==================== NETWORK INFO ====================
        let connectionType = '';
        let effectiveType = '';
        let rtt = 0;
        let downlink = 0;
        let saveData = false;
        let onlineStatus = navigator.onLine;
        if (navigator.connection || navigator.mozConnection || navigator.webkitConnection) {
          const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
          connectionType = conn.type || '';
          effectiveType = conn.effectiveType || '';
          rtt = conn.rtt || 0;
          downlink = conn.downlink || 0;
          saveData = conn.saveData || false;
        }

        // ==================== BATTERY INFO ====================
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

        // ==================== WEBGL INFO ====================
        let webglVendor = '';
        let webglRenderer = '';
        let webglVersion = '';
        let webglShadingLanguageVersion = '';
        let webglMaxTextureSize = 0;
        let webglMaxVertexAttribs = 0;
        let webglMaxVaryingVectors = 0;
        let webglMaxFragmentUniformVectors = 0;
        let webglMaxVertexUniformVectors = 0;
        try {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
              webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
              webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
            webglVersion = gl.getParameter(gl.VERSION);
            webglShadingLanguageVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
            webglMaxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            webglMaxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
            webglMaxVaryingVectors = gl.getParameter(gl.MAX_VARYING_VECTORS);
            webglMaxFragmentUniformVectors = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
            webglMaxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
          }
        } catch (e) {}

        // ==================== PLUGINS ====================
        const plugins = [];
        const mimeTypes = [];
        if (navigator.plugins) {
          for (let i = 0; i < navigator.plugins.length; i++) {
            plugins.push({
              name: navigator.plugins[i].name,
              description: navigator.plugins[i].description,
              filename: navigator.plugins[i].filename
            });
          }
        }
        if (navigator.mimeTypes) {
          for (let i = 0; i < navigator.mimeTypes.length; i++) {
            mimeTypes.push({
              type: navigator.mimeTypes[i].type,
              description: navigator.mimeTypes[i].description,
              suffixes: navigator.mimeTypes[i].suffixes
            });
          }
        }

        // ==================== CANVAS FINGERPRINT ====================
        let canvasFingerprint = '';
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 200;
          canvas.height = 50;
          ctx.textBaseline = 'top';
          ctx.font = '14px Arial';
          ctx.textBaseline = 'alphabetic';
          ctx.fillStyle = '#f60';
          ctx.fillRect(125, 1, 62, 20);
          ctx.fillStyle = '#069';
          ctx.fillText('TechNest Tracker 🚀', 2, 15);
          ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
          ctx.fillText('TechNest Tracker 🚀', 4, 17);
          canvasFingerprint = canvas.toDataURL();
        } catch (e) {}

        // ==================== AUDIO FINGERPRINT ====================
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
            oscillator.frequency.value = 10000;
            oscillator.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(gainNode);
            gainNode.connect(context.destination);

            scriptProcessor.onaudioprocess = function(event) {
              const output = event.outputBuffer.getChannelData(0);
              audioFingerprint = Array.from(output.slice(0, 30)).map(v => v.toFixed(6)).join(',');
            };

            oscillator.start(0);
            setTimeout(() => {
              oscillator.stop();
              context.close();
            }, 100);
          }
        } catch (e) {}

        // ==================== FONT DETECTION ====================
        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testFonts = [
          'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Palatino',
          'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Impact', 'Lucida Sans',
          'Tahoma', 'Lucida Console', 'Monaco', 'Bradley Hand', 'Brush Script MT',
          'Luminari', 'Comic Sans', 'Apple Chancery', 'Zapfino', 'Webdings', 'Wingdings'
        ];
        const detectedFonts = [];
        const testString = 'mmmmmmmmmmlli';
        const testSize = '72px';
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const getWidth = (font) => {
          ctx.font = testSize + ' ' + font;
          return ctx.measureText(testString).width;
        };

        const baseWidths = {};
        baseFonts.forEach(baseFont => {
          baseWidths[baseFont] = getWidth(baseFont);
        });

        testFonts.forEach(testFont => {
          let detected = false;
          baseFonts.forEach(baseFont => {
            const width = getWidth(`'${testFont}', ${baseFont}`);
            if (width !== baseWidths[baseFont]) {
              detected = true;
            }
          });
          if (detected) {
            detectedFonts.push(testFont);
          }
        });

        // ==================== TIMEZONE ====================
        const timezoneOffset = new Date().getTimezoneOffset();
        const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localTime = new Date().toISOString();
        const localTimeString = new Date().toString();

        // ==================== UTM PARAMETERS ====================
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source') || '';
        const utmMedium = urlParams.get('utm_medium') || '';
        const utmCampaign = urlParams.get('utm_campaign') || '';
        const utmTerm = urlParams.get('utm_term') || '';
        const utmContent = urlParams.get('utm_content') || '';

        // ==================== PAGE INFO ====================
        const page = window.location.pathname;
        const fullUrl = window.location.href;
        const referrer = document.referrer;
        const initialReferrer = sessionStorage.getItem('initial_referrer') || referrer;
        if (!sessionStorage.getItem('initial_referrer')) {
          sessionStorage.setItem('initial_referrer', referrer);
        }
        const pageTitle = document.title;
        const documentCharset = document.characterSet;

        // Pages visited
        let pagesVisited = JSON.parse(sessionStorage.getItem('pages_visited') || '[]');
        if (!pagesVisited.includes(page)) {
          pagesVisited.push(page);
          sessionStorage.setItem('pages_visited', JSON.stringify(pagesVisited));
        }

        // ==================== SCROLL DEPTH TRACKING ====================
        let maxScrollDepth = 0;
        const trackScrollDepth = () => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
          maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
        };
        window.addEventListener('scroll', trackScrollDepth);

        // ==================== AD BLOCKER DETECTION ====================
        let adBlocker = false;
        try {
          const testAd = document.createElement('div');
          testAd.innerHTML = '&nbsp;';
          testAd.className = 'adsbox ad-placement ad-placeholder adbadge BannerAd';
          testAd.style.height = '1px';
          document.body.appendChild(testAd);
          setTimeout(() => {
            adBlocker = testAd.offsetHeight === 0;
            document.body.removeChild(testAd);
          }, 100);
        } catch (e) {}

        // ==================== MEMORY INFO ====================
        let memoryJsHeapSizeLimit = 0;
        let memoryJsHeapSizeUsed = 0;
        let memoryJsHeapSizeTotal = 0;
        if (performance.memory) {
          memoryJsHeapSizeLimit = performance.memory.jsHeapSizeLimit;
          memoryJsHeapSizeUsed = performance.memory.usedJSHeapSize;
          memoryJsHeapSizeTotal = performance.memory.totalJSHeapSize;
        }

        // ==================== PERFORMANCE INFO ====================
        const performanceTiming = performance.timing || {};
        const navigationStart = performanceTiming.navigationStart || 0;
        const loadTime = performanceTiming.loadEventEnd ? performanceTiming.loadEventEnd - navigationStart : 0;
        const domReadyTime = performanceTiming.domContentLoadedEventEnd ? performanceTiming.domContentLoadedEventEnd - navigationStart : 0;
        const connectTime = performanceTiming.connectEnd ? performanceTiming.connectEnd - performanceTiming.connectStart : 0;

        // ==================== USER AGENT CLIENT HINTS ====================
        let userAgentData = {};
        if (navigator.userAgentData) {
          userAgentData = {
            brands: navigator.userAgentData.brands || [],
            mobile: navigator.userAgentData.mobile || false,
            platform: navigator.userAgentData.platform || ''
          };

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

        // ==================== MEDIA DEVICES ====================
        let mediaDevices = [];
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            mediaDevices = devices.map(device => ({
              kind: device.kind,
              label: device.label || 'Unknown',
              deviceId: device.deviceId ? 'present' : 'none'
            }));
          } catch (e) {}
        }

        // ==================== PERMISSIONS ====================
        let permissions = {};
        if (navigator.permissions) {
          const permissionNames = ['geolocation', 'notifications', 'camera', 'microphone'];
          for (const name of permissionNames) {
            try {
              const result = await navigator.permissions.query({ name });
              permissions[name] = result.state;
            } catch (e) {
              permissions[name] = 'unknown';
            }
          }
        }

        // ==================== GEOLOCATION (if permitted) ====================
        let geolocation = null;
        if (navigator.geolocation && permissions.geolocation === 'granted') {
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            geolocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed
            };
          } catch (e) {}
        }

        // ==================== MOUSE/TOUCH TRACKING ====================
        let mouseMovements = 0;
        let clicks = 0;
        let touches = 0;
        const trackMouse = () => mouseMovements++;
        const trackClick = () => clicks++;
        const trackTouch = () => touches++;
        document.addEventListener('mousemove', trackMouse);
        document.addEventListener('click', trackClick);
        document.addEventListener('touchstart', trackTouch);

        // ==================== KEYBOARD DETECTION ====================
        let keyPresses = 0;
        const trackKeyPress = () => keyPresses++;
        document.addEventListener('keypress', trackKeyPress);

        // ==================== COLLECT ALL DATA ====================
        const visitorData = {
          // Session info
          sessionId,
          isReturningVisitor,
          visitCount,
          firstVisit,
          initialReferrer,
          pagesVisited,
          scrollDepth: maxScrollDepth,

          // Page info
          page,
          fullUrl,
          referrer,
          pageTitle,
          documentCharset,

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
          screenWidth,
          screenHeight,
          screenResolution,
          viewportWidth,
          viewportHeight,
          colorDepth,
          pixelDepth,
          pixelRatio,
          screenAvailWidth,
          screenAvailHeight,
          screenLeft,
          screenTop,

          // Device info
          maxTouchPoints,
          touchSupport,
          hardwareConcurrency,
          deviceMemory,
          devicePixelRatio,

          // Orientation
          screenOrientation,
          screenOrientationAngle,

          // Features
          cookiesEnabled,
          doNotTrack,
          javaEnabled,
          localStorageEnabled,
          sessionStorageEnabled,
          indexedDBEnabled,
          webSocketEnabled,
          webRTCEnabled,
          webWorkersEnabled,
          serviceWorkerEnabled,
          notificationsEnabled,
          geolocationEnabled,
          webGLEnabled,
          webGL2Enabled,
          adBlocker,
          onlineStatus,

          // Network
          connectionType,
          effectiveType,
          rtt,
          downlink,
          connectionSaveData: saveData,

          // Battery
          batteryLevel,
          batteryCharging,
          batteryChargingTime,
          batteryDischargingTime,

          // WebGL
          webglVendor,
          webglRenderer,
          webglVersion,
          webglShadingLanguageVersion,
          webglMaxTextureSize,
          webglMaxVertexAttribs,
          webglMaxVaryingVectors,
          webglMaxFragmentUniformVectors,
          webglMaxVertexUniformVectors,

          // Plugins & MIME Types
          plugins,
          mimeTypes,

          // Fingerprints
          canvasFingerprint: canvasFingerprint.substring(0, 200),
          audioFingerprint: audioFingerprint.substring(0, 200),
          detectedFonts,

          // Timezone
          timezoneOffset,
          timezoneName,
          localTime,
          localTimeString,

          // Memory
          memoryJsHeapSizeLimit,
          memoryJsHeapSizeUsed,
          memoryJsHeapSizeTotal,

          // Performance
          loadTime,
          domReadyTime,
          connectTime,

          // User Agent Data
          userAgentData,

          // Media Devices
          mediaDevices,

          // Permissions
          permissions,

          // Geolocation
          geolocation,

          // Interaction tracking
          mouseMovements: 0,
          clicks: 0,
          touches: 0,
          keyPresses: 0
        };

        // Send to backend
        const response = await fetch('/api/track-visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(visitorData)
        });

        if (!response.ok) {
          console.error('Failed to track visitor');
        }

        // Track session duration and interactions on page unload
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
              scrollDepth: maxScrollDepth,
              mouseMovements,
              clicks,
              touches,
              keyPresses
            }),
            keepalive: true
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

export default VisitorTrackerUltra;

