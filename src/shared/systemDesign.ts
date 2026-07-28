export interface SystemDesignPrompt {
  id: string;
  title: string;
  category: string;
  brief: string;
  functional: string[];
  constraints: string[];
  deepDiveIdeas: string[];
}

export const systemDesignPrompts: SystemDesignPrompt[] = [
  {
    id: "realtime-chat",
    title: "Realtime Chat",
    category: "Messaging",
    brief: "Design a chat product for one-to-one and small-group conversations across web and mobile clients.",
    functional: ["send and receive messages", "show online/offline state", "load conversation history", "support push notifications"],
    constraints: ["low message latency", "mobile clients reconnect often", "users expect messages not to disappear"],
    deepDiveIdeas: ["websocket fanout", "message ordering", "offline delivery", "hot group conversations"]
  },
  {
    id: "video-feed",
    title: "Short Video Feed",
    category: "Feed",
    brief: "Design a personalized short-video feed with uploads, playback, ranking, and moderation hooks.",
    functional: ["upload videos", "transcode media", "serve feed", "track watch events", "remove unsafe content"],
    constraints: ["read-heavy traffic", "large media files", "ranking changes frequently"],
    deepDiveIdeas: ["media pipeline", "feed ranking", "CDN strategy", "event ingestion"]
  },
  {
    id: "url-shortener",
    title: "URL Shortener",
    category: "Core Infra",
    brief: "Design a URL shortener that creates short links and redirects users quickly.",
    functional: ["create short links", "redirect short links", "expire links", "track click analytics"],
    constraints: ["redirects must be fast", "read volume greatly exceeds write volume", "links should be hard to guess"],
    deepDiveIdeas: ["ID generation", "cache strategy", "analytics pipeline", "abuse prevention"]
  },
  {
    id: "notification-system",
    title: "Notification System",
    category: "Platform",
    brief: "Design a platform that sends email, SMS, push, and in-app notifications for many product teams.",
    functional: ["accept notification requests", "route by channel", "respect user preferences", "retry failed sends"],
    constraints: ["third-party providers fail", "some messages are urgent", "users can opt out"],
    deepDiveIdeas: ["queue design", "rate limiting", "deduplication", "provider failover"]
  },
  {
    id: "collaborative-docs",
    title: "Collaborative Documents",
    category: "Collaboration",
    brief: "Design a document editor where multiple users can edit the same document at the same time.",
    functional: ["edit documents", "see collaborators", "sync changes", "view revision history"],
    constraints: ["conflicting edits happen constantly", "latency must feel low", "documents can be very large"],
    deepDiveIdeas: ["conflict resolution", "presence", "snapshotting", "permission checks"]
  },
  {
    id: "metrics-dashboard",
    title: "Metrics Dashboard",
    category: "Analytics",
    brief: "Design a dashboard for product teams to query time-series metrics and create alerting views.",
    functional: ["ingest events", "aggregate metrics", "query dashboards", "trigger alerts"],
    constraints: ["writes are high-volume", "queries need recent data", "old data can be downsampled"],
    deepDiveIdeas: ["stream processing", "time-series storage", "rollups", "alert correctness"]
  },
  {
    id: "ride-matching",
    title: "Ride Matching",
    category: "Marketplace",
    brief: "Design a ride-hailing matcher that pairs riders with nearby drivers.",
    functional: ["track driver location", "request rides", "match nearby drivers", "handle trip state"],
    constraints: ["location changes every few seconds", "matching must be fast", "drivers can reject rides"],
    deepDiveIdeas: ["geospatial indexing", "matching flow", "surge traffic", "state transitions"]
  },
  {
    id: "file-sync",
    title: "File Sync",
    category: "Storage",
    brief: "Design a desktop and mobile file sync product with sharing and version history.",
    functional: ["upload files", "sync file changes", "share folders", "restore previous versions"],
    constraints: ["files can be huge", "clients go offline", "conflicts need resolution"],
    deepDiveIdeas: ["chunking", "metadata storage", "delta sync", "conflict handling"]
  }
];

export const systemDesignSteps = [
  { key: "requirements", label: "Requirements", minutes: "0-5" },
  { key: "scale", label: "Scale", minutes: "5-10" },
  { key: "api", label: "API", minutes: "10-15" },
  { key: "dataModel", label: "Data", minutes: "15-20" },
  { key: "architecture", label: "Design", minutes: "20-32" },
  { key: "deepDives", label: "Deep Dives", minutes: "32-42" },
  { key: "risks", label: "Risks", minutes: "42-45" }
];

export const systemDesignLevelGuidance: Record<"Early" | "Mid" | "Senior" | "Staff", string> = {
  Early:
    "Focus on a clear product scope, simple APIs, core entities, a readable high-level diagram, and basic trade-offs. You do not need perfect distributed systems depth.",
  Mid:
    "Show a complete end-to-end design, reasonable scale estimates, sensible storage choices, and at least one meaningful bottleneck or failure-mode discussion.",
  Senior:
    "Drive trade-offs, identify bottlenecks early, justify data and scaling choices, and go deep on reliability, consistency, observability, and operational risks.",
  Staff:
    "Frame the problem strategically, compare multiple architectures, reason about long-term evolution, and expose hard cross-team or platform-level trade-offs."
};

export const systemDesignChecklist = [
  "Clarified scope before designing",
  "Separated functional and non-functional requirements",
  "Estimated traffic, storage, and read/write shape",
  "Defined core APIs with request/response shape",
  "Named primary entities and indexes",
  "Explained data flow through major components",
  "Picked at least two deep dives",
  "Discussed bottlenecks, failure modes, and trade-offs"
];
