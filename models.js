import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Live Notification Schema
const LiveNotificationSchema = new Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ["info", "success", "warning", "announcement"], default: "info" },
  link: String,
  active: { type: Boolean, default: false },
  startDate: Date,
  endDate: Date,
}, { timestamps: true });


// Site Data Schema - stores all site configuration
const SiteDataSchema = new Schema({
  intro: {
    enabled: { type: Boolean, default: true },
    videoUrl: { type: String, default: '/intro.mp4' },
    posterUrl: { type: String, default: '' },
    autoplay: { type: Boolean, default: true },
    loop: { type: Boolean, default: true }
  },
  home: {
    hero: {
      title: String,
      subtitle: String,
      videoUrl: String,
      cta1: String,
      cta2: String
    },
    whatWeDo: [{
      id: String,
      title: String,
      description: String,
      icon: String
    }],
    vision: {
      title: String,
      text: String
    },
    partners: [{
      id: String,
      name: String,
      logoUrl: String
    }]
  },
  about: {
    story: {
      title: String,
      text: String
    },
    team: [{
      id: String,
      name: String,
      role: String,
      bio: String,
      photoUrl: String,
      linkedin: String,
      github: String
    }],
    values: [{
      id: String,
      title: String,
      description: String
    }]
  },
  contact: {
    message: String,
    email: String,
    discord: String,
    location: String,

    socials: {
      facebook: { type: String, default: 'https://facebook.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      discord: String,
      github: String,
      youtube: String
    },
    faq: [{
      id: String,
      question: String,
      answer: String
    }]
  },
  join: {
    hero: {
      title: String,
      subtitle: String
    },
    whyJoinUs: [{
      id: String,
      title: String,
      description: String
    }],
    positions: [{
      id: String,
      title: String,
      description: String,
      requirements: String
    }]
  },
  statistics: [{
    id: String,
    icon: String,
    value: Number,
    suffix: String,
    label: String,
    color: String
  }],
  testimonials: [{
    id: String,
    name: String,
    role: String,
    image: String,
    rating: Number,
    text: String
  }],
  technologies: [{
    id: String,
    category: String,
    icon: String,
    items: [String]
  }],
  blog: [{
    id: String,
    title: String,
    excerpt: String,
    content: String,
    image: String,
    mediaGallery: [{
      type: { type: String, enum: ['image', 'video'] },
      url: String,
      caption: String
    }],
    author: String,
    date: String,
    category: String,
    tags: [String]
  }],
  seo: {
    home: { title: String, description: String, ogImage: String },
    projects: { title: String, description: String, ogImage: String },
    about: { title: String, description: String, ogImage: String },
    contact: { title: String, description: String, ogImage: String },
    join: { title: String, description: String, ogImage: String }
  },
  chatbot: {
    enabled: { type: Boolean, default: true },
    name: { type: String, default: 'Tec' },
    welcomeMessage: { type: String, default: 'مرحباً! أنا Tec 🤖، مساعدك الذكي في جامعة عمان العربية. كيف يمكنني مساعدتك اليوم؟' }
  }
}, { timestamps: true });

// Project Schema
const ProjectSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  tags: [String],
  description: String,
  thumbnailUrl: String,
  coverUrl: String,
  features: [String],
  technologies: [String],
  releaseDate: String,
  platforms: [String],
  gallery: [String],
  mediaGallery: [{
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true },
    caption: String
  }],
  downloadLink: String,
  videoLink: String,
  // Rating system
  ratings: {
    total: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    average: { type: Number, default: 0 },
    breakdown: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  }
}, { timestamps: true });

// Message Schema
const MessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Application Schema
const ApplicationSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
  portfolio: String,
  message: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Project Submission Schema
const ProjectSubmissionSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  projectName: { type: String, required: true },
  description: String,
  links: [String],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// User Schema
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Admin' }
}, { timestamps: true });

// Visitor Schema - Track all visitor information
const VisitorSchema = new Schema({
  ip: String,
  country: String,
  countryCode: String,
  region: String,
  city: String,
  latitude: Number,
  longitude: Number,
  timezone: String,
  isp: String,
  browser: String,
  browserVersion: String,
  os: String,
  osVersion: String,
  device: String,
  deviceType: String,
  screenResolution: String,
  language: String,
  languages: [String],
  page: String,
  referrer: String,
  userAgent: String,
  visitTime: { type: Date, default: Date.now },
  sessionDuration: Number,
  isBot: Boolean,
  isMobile: Boolean,
  isTablet: Boolean,  isDesktop: Boolean,
  connectionType: String,
  effectiveType: String,
  rtt: Number,
  downlink: Number,
  cpuCores: Number,
  deviceMemory: Number,
  batteryLevel: Number,
  batteryCharging: Boolean,
  webglVendor: String,
  webglRenderer: String,
  plugins: [String],
  postalCode: String,
  regionCode: String,
  localTime: String,
  timeZoneOffset: Number,
  pagesVisited: [String],
  scrollDepth: Number,
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,
  utmTerm: String,
  utmContent: String,
  sessionId: String,
  isReturningVisitor: Boolean,
  initialReferrer: String,
  screenOrientation: String,
  touchSupport: Boolean,
  hardwareConcurrency: Number,
  javaEnabled: Boolean,
  doNotTrack: Boolean,
  adBlocker: Boolean,
  viewportWidth: Number,
  viewportHeight: Number,
  pixelRatio: Number,
  colorDepth: Number,
  cookiesEnabled: Boolean,
  localStorageEnabled: Boolean,
  sessionStorageEnabled: Boolean,
  webSocketEnabled: Boolean,
  webRTCEnabled: Boolean,
  canvasFingerprint: String,
  audioFingerprint: String,
  fontFingerprint: String,
  timezoneOffset: Number,
  timezoneName: String,
  networkSpeed: String,
  connectionEffectiveType: String,
  connectionRtt: Number,
  connectionDownlink: Number,
  connectionSaveData: Boolean,
  cpuLogicalCores: Number,
  deviceMemoryGb: Number,
  batteryStatusCharging: Boolean,
  batteryStatusLevel: Number,
  batteryStatusChargingTime: Number,
  batteryStatusDischargingTime: Number,
  gpuVendor: String,
  gpuRenderer: String,
  pluginsList: [String],
  screenOrientationType: String,
  screenOrientationAngle: Number,
  maxTouchPoints: Number,
  platform: String,
  product: String,
  vendor: String,
  vendorSub: String,
  productSub: String,
  buildID: String,
  oscpu: String,
  appCodeName: String,
  appName: String,
  appVersion: String,
  languageList: [String],
  hardwareConcurrencyCount: Number,
  devicePixelRatio: Number,
  maxTouchPointsCount: Number,
  memoryUsed: Number,
  memoryTotal: Number,
  memoryLimit: Number,
  memoryJsHeapSizeLimit: Number,
  memoryJsHeapSizeUsed: Number,
  memoryJsHeapSizeTotal: Number,
  memoryDeviceMemory: Number,
  memoryHardwareConcurrency: Number,
  memoryUserAgent: String,
  memoryVendor: String,
  memoryPlatform: String,
  memoryProduct: String,
  memoryProductSub: String,
  memoryVendorSub: String,
  memoryBuildID: String,
  memoryOscpu: String,
  memoryAppCodeName: String,
  memoryAppName: String,
  memoryAppVersion: String,
  memoryLanguage: String,
  memoryLanguages: [String],
  memoryScreenResolution: String,
  memoryColorDepth: Number,
  memoryPixelDepth: Number,
  memoryDevicePixelRatio: Number,
  memoryMaxTouchPoints: Number,
  memoryGeolocation: Object,
  memoryTimezone: String,
  memoryTimezoneOffset: Number,
  memoryNetwork: Object,
  memoryBattery: Object,
  memoryWebGL: Object,
  memoryPlugins: [String],
  memoryFonts: [String],
  memoryCanvas: String,
  memoryAudio: String,
  memoryWebRTC: Object,
  memoryDoNotTrack: Boolean,
  memoryAdBlocker: Boolean,
  memoryLocalStorage: Boolean,
  memorySessionStorage: Boolean,
  memoryCookies: Boolean,
  memoryJava: Boolean,
  memoryFlash: Boolean,
  memorySilverlight: Boolean,
  memorySilverlight: Boolean,
  memoryQuickTime: Boolean,
  memoryRealPlayer: Boolean,
  memoryWindowsMediaPlayer: Boolean,
  memoryVLC: Boolean,
  memoryPDF: Boolean,
  memoryGoogleGears: Boolean,
  memoryActiveX: Boolean,
  memoryMimeTypes: [String],
  memoryUserAgentData: Object,
  memoryUserAgentClientHints: Object,
  memoryUserAgentPlatform: String,
  memoryUserAgentPlatformVersion: String,
  memoryUserAgentArchitecture: String,
  memoryUserAgentModel: String,
  memoryUserAgentMobile: Boolean,
  memoryUserAgentBitness: String,
  memoryUserAgentFullVersionList: [Object],
  memoryUserAgentBrands: [Object],
  memoryUserAgentHighEntropyValues: Object,
  memoryUserAgentLowEntropyValues: Object,
  memoryUserAgentGreased: Boolean,
  memoryUserAgentFrozen: Boolean,
  memoryUserAgentSecChUa: String,
  memoryUserAgentSecChUaArch: String,
  memoryUserAgentSecChUaBitness: String,
  memoryUserAgentSecChUaFullVersion: String,
  memoryUserAgentSecChUaFullVersionList: [Object],
  memoryUserAgentSecChUaMobile: Boolean,
  memoryUserAgentSecChUaModel: String,
  memoryUserAgentSecChUaPlatform: String,
  memoryUserAgentSecChUaPlatformVersion: String,
  memoryUserAgentSecChUaWow64: Boolean,
  memoryUserAgentSecChUaBrand: String,
  memoryUserAgentSecChUaBrandVersion: String,
  memoryUserAgentSecChUaBrandFullVersion: String,
  memoryUserAgentSecChUaBrandFullVersionList: [Object],
  memoryUserAgentSecChUaBrandMobile: Boolean,
  memoryUserAgentSecChUaBrandModel: String,
  memoryUserAgentSecChUaBrandPlatform: String,
  memoryUserAgentSecChUaBrandPlatformVersion: String,
  memoryUserAgentSecChUaBrandWow64: Boolean,
  memoryUserAgentSecChUaBrandArchitecture: String,
  memoryUserAgentSecChUaBrandBitness: String,
  memoryUserAgentSecChUaBrandGreased: Boolean,
  memoryUserAgentSecChUaBrandFrozen: Boolean,
  memoryUserAgentSecChUaBrandSecChUa: String,
  memoryUserAgentSecChUaBrandSecChUaArch: String,
  memoryUserAgentSecChUaBrandSecChUaBitness: String,
  memoryUserAgentSecChUaBrandSecChUaFullVersion: String,
  memoryUserAgentSecChUaBrandSecChUaFullVersionList: [Object],
  memoryUserAgentSecChUaBrandSecChUaMobile: Boolean,
  memoryUserAgentSecChUaBrandSecChUaModel: String,
  memoryUserAgentSecChUaBrandSecChUaPlatform: String,
  memoryUserAgentSecChUaBrandSecChUaPlatformVersion: String,
  memoryUserAgentSecChUaBrandSecChUaWow64: Boolean,
  memoryUserAgentSecChUaBrandSecChUaBrand: String,
  memoryUserAgentSecChUaBrandSecChUaBrandVersion: String,
  memoryUserAgentSecChUaBrandSecChUaBrandFullVersion: String,
  memoryUserAgentSecChUaBrandSecChUaBrandFullVersionList: [Object],
  memoryUserAgentSecChUaBrandSecChUaBrandMobile: Boolean,
  memoryUserAgentSecChUaBrandSecChUaBrandModel: String,
  memoryUserAgentSecChUaBrandSecChUaBrandPlatform: String,
  memoryUserAgentSecChUaBrandSecChUaBrandPlatformVersion: String,
  memoryUserAgentSecChUaBrandSecChUaBrandWow64: Boolean,
  memoryUserAgentSecChUaBrandSecChUaBrandArchitecture: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandBitness: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandGreased: Boolean,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandFrozen: Boolean,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUa: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaArch: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBitness: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaFullVersion: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaFullVersionList: [Object],
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaMobile: Boolean,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaModel: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaPlatform: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaPlatformVersion: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaWow64: Boolean,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBrand: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBrandVersion: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBrandFullVersion: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBrandFullVersionList: [Object],
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBrandMobile: Boolean,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBrandModel: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBrandPlatform: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBrandPlatformVersion: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBrandWow64: Boolean,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBrandArchitecture: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBrandBitness: String,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBrandGreased: Boolean,
  memoryUserAgentSecChUaBrandSecChUaBrandSecChUaBrandSecChUaBrandFrozen: Boolean
}, { timestamps: true });

// Rating Schema - Track individual ratings with user info
const RatingSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  userIp: String,
  approved: { type: Boolean, default: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Testimonial Submission Schema - For client testimonials
const TestimonialSubmissionSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  company: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  testimonial: { type: String, required: true },
  approved: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Export models
export const SiteData = mongoose.model('SiteData', SiteDataSchema);
export const Project = mongoose.model('Project', ProjectSchema);
export const Message = mongoose.model('Message', MessageSchema);
export const Application = mongoose.model('Application', ApplicationSchema);
export const ProjectSubmission = mongoose.model('ProjectSubmission', ProjectSubmissionSchema);
export const User = mongoose.model('User', UserSchema);
export const Visitor = mongoose.model('Visitor', VisitorSchema);
export const Rating = mongoose.model('Rating', RatingSchema);
export const TestimonialSubmission = mongoose.model('TestimonialSubmission', TestimonialSubmissionSchema);
export const LiveNotification = mongoose.model('LiveNotification', LiveNotificationSchema);