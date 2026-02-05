# ✒️ Obsidian Ink

> A full-stack editorial platform where vintage aesthetics meet modern web architecture. Built with the MERN stack, featuring advanced content management, real-time engagement, and production-grade analytics.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://obsidian-ink.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-v19.2.0-blue.svg)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/node-v18+-green.svg)](https://nodejs.org/)

---

## Overview

**Obsidian Ink** is a sophisticated blogging platform that bridges classic editorial design with cutting-edge web technologies. The platform enables writers to craft and publish rich content, readers to discover and engage with stories through intelligent filtering, and administrators to manage the entire ecosystem through comprehensive analytics dashboards.

### What Makes It Special

- **🎨 Vintage-Inspired Design System** - Paper-textured backgrounds, serif typography, and carefully crafted color palettes create an elegant reading experience
- **⚡ Modern Performance** - Built with React 19, Vite 7, and TanStack Query for blazing-fast interactions and optimistic updates
- **🔐 Enterprise-Grade Auth** - Clerk authentication with social providers, email verification, and role-based access control
- **📊 Real-Time Analytics** - Track views, engagement, and content performance with session-based analytics
- **🖼️ Media Optimization** - ImageKit integration for responsive images and automatic format conversion
- **♾️ Infinite Scroll** - Seamless content discovery with react-infinite-scroll and cursor-based pagination

---

## ✨ Core Features

### For Writers
- **Rich Text Editor** - React Quill (react-quill-new v3.7.0) with full formatting, media embedding, and code blocks
- **Image Management** - ImageKit integration (@imagekit/react v5.0.1) for optimized uploads and transformations
- **Content Organization** - Categories, tags, and slug-based URLs for SEO optimization
- **Draft System** - Save work in progress and publish when ready
- **Personal Dashboard** - Track your blog performance, views, and reader engagement

### For Readers
- **Advanced Search** - Multi-criteria filtering by category, date, popularity, and full-text search
- **Infinite Scroll** - Seamless content loading with react-infinite-scroll-component v6.1.1
- **Save for Later** - Bookmark favorite articles to a personal reading list
- **Comment System** - Real-time threaded discussions with optimistic updates
- **Responsive Design** - Tailwind CSS v4 for pixel-perfect experiences across all devices
- **SEO Optimized** - React Helmet Async v2.0.5 for dynamic meta tags and social sharing

### For Administrators
- **Content Moderation** - Feature/unfeature blogs, delete inappropriate content
- **User Management** - View all users, track activity, and manage permissions
- **Analytics Dashboard** - Comprehensive insights into platform metrics
- **Activity Monitoring** - Real-time feed of recent blogs and comments
- **Performance Tracking** - View top-performing content by views and engagement

---

## 🏗️ Technical Architecture

### MVC Pattern Implementation

Obsidian Ink follows a clean **Model-View-Controller** architecture for maintainability and scalability:

---

## 🎨 Frontend Architecture

### State Management Strategy

**TanStack Query v5** (React Query) for server state:
- Automatic caching and background refetching
- Optimistic updates for instant UI feedback
- Intelligent query invalidation
- Parallel and dependent queries
- Infinite scroll with cursor pagination

**React Router v7** for client-side routing:
- Nested routes with layouts
- Protected routes with authentication guards
- Dynamic route parameters (blog slugs)
- Programmatic navigation

### UI/UX Implementation

**Tailwind CSS v4** with custom design system:
- CSS variables for theming (`--bg-main`, `--text-ink`, `--accent`)
- Mobile-first responsive breakpoints
- Custom vintage aesthetic with paper textures
- Utility-first styling for rapid development

**Lucide React v0.563** for consistent iconography:
- 1000+ beautiful, consistent icons
- Tree-shakeable imports
- Customizable size and color

**React Toastify v11** for user feedback:
- Success, error, and info notifications
- Customizable position and duration
- Accessible ARIA labels

**Timeago.js v4** for human-readable dates:
- Relative timestamps (e.g., "2 days ago")
- Automatic updates
- Locale support

### Performance Optimizations

- **Image Optimization** - ImageKit responsive images with lazy loading
- **Memoization** - React.memo() for expensive components
- **Debouncing** - Search input optimization
- **Virtual Scrolling** - Efficient rendering of large lists
- **Bundle Analysis** - Vite build optimization

---

## 🔧 Backend Architecture

### RESTful API Design

Express v5 powers a clean, RESTful API with:
- Resource-based endpoints
- Consistent HTTP methods (GET, POST, PATCH, DELETE)

### Database Design (MongoDB v7)

**Mongoose ODM** for schema validation and queries:
- Type validation and required fields
- Relationships via ObjectId references

**Session Management**:
- express-session v1.19 for view tracking
- In-memory session store (upgradeable to Redis)

### Authentication & Authorization

**Clerk Integration**:
- JWT-based authentication
- Email/password authentication
- User metadata for roles

**Role-Based Access Control**:
- **User Role** - Create blogs, comment, save posts
- **Admin Role** - All user permissions + content moderation, user management, analytics access

### File Upload System

**ImageKit v6**:
- Server-side authentication for secure uploads
- Client-side upload with progress tracking
- Automatic format conversion (WebP)

---

## 🎯 Key Features Deep Dive

### 1. View Tracking System

**Session-Based Analytics**:
- Uses `express-session` to track unique views per blog
- Prevents inflation from page refreshes
- Stores session data in memory (scalable to Redis)
- Increments view count only once per session per blog

**Implementation**:
```javascript
// Middleware checks session for blog view
if (!req.session[`viewed_${slug}`]) {
  await Blog.findOneAndUpdate(
    { slug }, 
    { $inc: { views: 1 } }
  );
  req.session[`viewed_${slug}`] = true;
}
```

### 2. Infinite Scroll Implementation

**React Infinite Scroll Component**:
- Cursor-based pagination for performance
- Automatic fetch on scroll
- Loading indicators
- End-of-content detection

**TanStack Query Integration**:
```javascript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["blogs", filters],
  queryFn: ({ pageParam = 1 }) => fetchBlogs(pageParam),
  getNextPageParam: (lastPage) => 
    lastPage.hasMore ? lastPage.nextPage : undefined
});
```

### 3. Optimistic Updates

**Instant UI Feedback**:
- Comments appear immediately before server confirmation
- Blog saves update UI instantly
- Rollback on error with cached previous state

**Example**:
```javascript
const mutation = useMutation({
  mutationFn: savePost,
  onMutate: async (newPost) => {
    await queryClient.cancelQueries(['posts']);
    const previous = queryClient.getQueryData(['posts']);
    queryClient.setQueryData(['posts'], old => [...old, newPost]);
    return { previous };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['posts'], context.previous);
  }
});
```

### 4. Image Upload Flow

**Client-Side**:
1. User selects image in React component
2. Component requests auth token from backend
3. Direct upload to ImageKit CDN
4. Receives optimized URL
5. URL saved in blog metadata

**Server-Side**:
```javascript
// Generate secure upload signature
const { token, expire, signature} = 
  imagekit.getAuthenticationParameters();
```

### 5. Real-Time Search

**Debounced Search**:
- 300ms delay to prevent excessive API calls
- Updates URL params for shareable searches
- Highlights matching results

**Full-Text Search**:
- MongoDB text index on blog titles
- Case-insensitive regex matching
- Relevance scoring

### 6. Role-Based Dashboard

**Dynamic UI Based on Role**:
```javascript
const role = user?.publicMetadata?.role;

// Admin sees additional menu items
{role === 'admin' && (
  <>
    <Link to="/dashboard/all-blogs">All Blogs</Link>
    <Link to="/dashboard/users">Users</Link>
  </>
)}
```

**Protected Routes**:
```javascript
<Route element={<ProtectedRoute />}>
  <Route element={<AdminOnly />}>
    <Route path="/dashboard/all-blogs" element={<AllBlogs />} />
  </Route>
</Route>
```

---

## 🔒 Security Implementation

### Authentication Security
- **JWT Validation** - Clerk verifies tokens on every request
- **HttpOnly Cookies** - Prevents XSS attacks
- **CSRF Protection** - Built into Clerk's flow
- **Rate Limiting** - Prevents brute force attacks

### Authorization Patterns
- **Ownership Checks** - Users can only edit/delete own content
- **Role Verification** - Admin actions check role metadata
- **Input Validation** - Mongoose schemas validate all data
- **SQL Injection Prevention** - Mongoose escapes queries

### Data Protection
- **Password Hashing** - Handled by Clerk (bcrypt)
- **Environment Variables** - Sensitive data in .env
- **CORS Configuration** - Whitelist allowed origins
- **Helmet.js Ready** - Security headers (easily added)

---

## 📱 Responsive Design Strategy

### Mobile-First Approach

**Breakpoints**:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Tailwind Utilities**:
```jsx
<div className="text-sm sm:text-base lg:text-lg">
  {/* Scales with screen size */}
</div>
```

**Mobile Menu**:
- Hamburger navigation for small screens
- Full-screen overlay menu
- Touch-optimized interactions
- Prevents body scroll when open

**Responsive Images**:
- ImageKit auto-formats images
- Lazy loading below fold
- Srcset for different resolutions
- WebP with fallbacks

---

## 🎨 Design System

### Color Palette
```css
/* Light Theme */
--bg-main: #f5f1e8;      /* Cream paper background */
--bg-paper: #ffffff;     /* White cards */
--text-ink: #2d2d2d;     /* Dark ink text */
--text-muted: #6b6b6b;   /* Secondary text */
--accent: #8b4513;       /* Vintage brown */
--border-soft: #e0ddd4;  /* Subtle borders */
```

### Typography
- **Headings**: Libre Baskerville (serif)
- **Body**: System fonts for performance
- **Code**: Monospace for technical content

### Component Patterns
- **Cards** - Subtle borders, paper backgrounds
- **Buttons** - Vintage button class (`.btn-vintage`)
- **Inputs** - Minimal styling, focus states
- **Modals** - Full-screen overlays for mobile

---

## 📈 Analytics & Insights

### Platform Metrics
- **Total Blogs** - Platform-wide content count
- **Total Views** - Aggregated view count
- **Active Users** - Monthly active users
- **Comments** - Engagement metric
- **Featured Posts** - Curated content count

### User Metrics
- **Personal Blogs** - User's published content
- **Total Views** - Cumulative blog views
- **Featured Count** - Admin-featured blogs
- **Comments Received** - Engagement on content

### Content Analytics
- **Top Performing Blogs** - Sorted by views
- **Trending Content** - Last 7 days, sorted by engagement
- **Category Distribution** - Content breakdown
- **Blogs Over Time** - Publishing trends
- **Views Over Time** - Traffic patterns

---

## 🛠️ Technology Decisions

### Why React 19?
- Latest features and performance improvements
- Concurrent rendering capabilities
- Improved suspense and error boundaries
- Better TypeScript support

### Why TanStack Query?
- Declarative data fetching
- Automatic caching and revalidation
- Optimistic updates out of the box
- Excellent DevTools

### Why Clerk?
- Production-ready authentication
- Social provider integration
- User management dashboard
- Webhook support for user sync
- No backend auth code needed

### Why MongoDB?
- Flexible schema for evolving features
- Excellent performance for read-heavy workloads
- Rich query language
- Horizontal scalability
- Great ODM support with Mongoose

### Why Tailwind CSS v4?
- Utility-first workflow
- Consistent design system
- Minimal CSS bundle
- Excellent responsive utilities
- Built-in dark mode support

### Why Vite?
- Lightning-fast HMR
- Optimized build output
- ESM-first approach
- Excellent plugin ecosystem
- Better than Create React App

---

## 🔮 Future Enhancements

### Planned Features
- [ ] **Email Notifications** - Blog updates, comment replies
- [ ] **Draft System** - Save work in progress
- [ ] **Tags System** - Multi-tag blog organization
- [ ] **Following System** - Follow favorite authors
- [ ] **Reading Lists** - Curated collections
- [ ] **Social Sharing** - One-click social media posts
- [ ] **SEO Dashboard** - Keyword optimization suggestions

### Technical Improvements
- [ ] **Redis Caching** - Session storage and query caching
- [ ] **WebSockets** - Real-time comments
- [ ] **GraphQL API** - Flexible data fetching
- [ ] **PWA Support** - Offline reading
- [ ] **End-to-End Testing** - Cypress integration
- [ ] **Performance Monitoring** - Sentry error tracking
- [ ] **CI/CD Pipeline** - Automated testing and deployment
- [ ] **Docker Compose** - Local development environment

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Shaikh Haamid**
- Portfolio: [haamidshaikh.com](https://react-three-js-portfolio-ten.vercel.app/)
- GitHub: [@HaamidRaza](https://github.com/HaamidRaza)
- LinkedIn: [Haamid Raza](https://linkedin.com/in/haamid-raza-shaikh-687468378)

---

## 🙏 Acknowledgments
- **Clerk** - Authentication infrastructure
- **MongoDB** - Database platform
- **ImageKit** - Image optimization and CDN
- **Netlify** - Frontend hosting
- **Render** - Backend hosting
- **Tailwind Labs** - CSS framework
- **TanStack** - React Query library
- **Lucide** - Beautiful icon library

---

<div align="center">

**Built with ❤️ using the MERN stack**

[⬆ Back to Top](#-obsidian-ink)

</div>
