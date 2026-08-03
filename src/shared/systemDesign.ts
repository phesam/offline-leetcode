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
    title: "Basic Chat App",
    category: "Messaging",
    brief: "Design a simple one-to-one chat app for web and mobile users.",
    functional: ["send messages", "load conversation history", "mark messages as read", "show basic online state"],
    constraints: ["messages should not be lost", "recent chats should load quickly", "clients may disconnect and reconnect"],
    deepDiveIdeas: ["message table schema", "polling vs websocket", "read receipts", "basic retry behavior"]
  },
  {
    id: "task-tracker",
    title: "Task Tracker",
    category: "CRUD",
    brief: "Design a task tracker for small teams to create, assign, update, and filter tasks.",
    functional: ["create tasks", "assign owners", "change status", "comment on tasks", "filter by project or owner"],
    constraints: ["simple permissions", "fast list views", "clear update history"],
    deepDiveIdeas: ["task and comment schema", "indexes for filters", "activity log", "basic permission checks"]
  },
  {
    id: "url-shortener",
    title: "URL Shortener",
    category: "Backend",
    brief: "Design a URL shortener that creates short links and redirects users to the original URL.",
    functional: ["create short links", "redirect short links", "expire links", "track click analytics"],
    constraints: ["redirects should be fast", "reads are higher than writes", "short codes should avoid collisions"],
    deepDiveIdeas: ["short code generation", "link table schema", "cache for redirects", "basic click counters"]
  },
  {
    id: "notification-system",
    title: "User Notifications",
    category: "Backend",
    brief: "Design a simple notification service for sending email and in-app notifications.",
    functional: ["create notification requests", "send email", "store in-app notifications", "mark notifications as read"],
    constraints: ["email providers can fail", "users may disable some notifications", "duplicate sends are annoying"],
    deepDiveIdeas: ["queue and worker", "notification schema", "user preferences", "retry and deduplication"]
  },
  {
    id: "photo-sharing",
    title: "Photo Sharing App",
    category: "Media",
    brief: "Design a photo sharing app where users upload photos, view profiles, and like photos.",
    functional: ["upload photos", "view user profiles", "show photo feed", "like photos", "delete own photos"],
    constraints: ["images can be large", "feeds should load quickly", "uploads may fail on mobile networks"],
    deepDiveIdeas: ["object storage", "image metadata schema", "thumbnail generation", "feed pagination"]
  },
  {
    id: "file-upload",
    title: "File Upload and Sharing",
    category: "Storage",
    brief: "Design a file upload service where users can upload files and share download links.",
    functional: ["upload files", "download files", "share files by link", "delete files", "show upload progress"],
    constraints: ["files can be large", "downloads should be reliable", "shared links need access control"],
    deepDiveIdeas: ["metadata database", "blob/object storage", "signed URLs", "chunked upload"]
  },
  {
    id: "event-rsvp",
    title: "Event RSVP",
    category: "Product",
    brief: "Design an event RSVP system where organizers create events and guests respond.",
    functional: ["create events", "invite guests", "RSVP yes/no/maybe", "show attendee list", "send reminders"],
    constraints: ["guest lists can change", "organizers need accurate counts", "reminders should not spam users"],
    deepDiveIdeas: ["event and RSVP schema", "invitation tokens", "capacity limits", "reminder scheduling"]
  },
  {
    id: "api-rate-limiter",
    title: "API Rate Limiter",
    category: "Infrastructure",
    brief: "Design a rate limiter that protects an API from too many requests per user or API key.",
    functional: ["count requests", "block requests over a limit", "support per-user limits", "return retry information"],
    constraints: ["checks must be fast", "limits reset over time", "multiple app servers may receive traffic"],
    deepDiveIdeas: ["fixed window vs sliding window", "Redis counters", "where to enforce limits", "failure behavior"]
  },
  {
    id: "search-autocomplete",
    title: "Search Autocomplete",
    category: "Search",
    brief: "Design autocomplete suggestions for a product search box.",
    functional: ["accept typed prefixes", "return suggestions", "rank popular results", "update suggestions from new products"],
    constraints: ["responses should feel instant", "popular queries change", "prefixes can be very common"],
    deepDiveIdeas: ["prefix index", "cache hot prefixes", "ranking by popularity", "batch index updates"]
  },
  {
    id: "shopping-cart",
    title: "Shopping Cart",
    category: "Commerce",
    brief: "Design a shopping cart for an online store.",
    functional: ["add items", "remove items", "update quantities", "persist cart across sessions", "start checkout"],
    constraints: ["prices can change", "inventory may run out", "anonymous users can have carts"],
    deepDiveIdeas: ["cart schema", "session vs user carts", "inventory checks", "price snapshot trade-offs"]
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
  "Made a simple traffic, storage, or read/write estimate",
  "Defined core APIs with request/response shape",
  "Named primary entities and indexes",
  "Explained data flow through major components",
  "Picked one or two focused deep dives",
  "Discussed bottlenecks, failure modes, and trade-offs"
];
