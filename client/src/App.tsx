import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';

// Pages - Public
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import SermonsPage from './pages/SermonsPage';
import EventsPage from './pages/EventsPage';
import BlogPage from './pages/BlogPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import GalleryPage from './pages/GalleryPage';
import PrayerRequestPage from './pages/PrayerRequestPage';
import GivePage from './pages/GivePage';

// Pages - Auth
import LoginPage from './pages/portal/LoginPage';
import RegisterPage from './pages/portal/RegisterPage';

// Pages - Portal (Protected)
import PortalDashboard from './pages/portal/PortalDashboard';

// Pages - Admin (Role Protected)
import DashboardOverview from './pages/admin/DashboardOverview';
import ManageUsers from './pages/admin/ManageUsers';
import ManageSermons from './pages/admin/ManageSermons';
import ManageEvents from './pages/admin/ManageEvents';
import ManagePrayerRequests from './pages/admin/ManagePrayerRequests';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageBlog from './pages/admin/ManageBlog';
import ManageGallery from './pages/admin/ManageGallery';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public Routes (with Navbar + Footer) ── */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="sermons" element={<SermonsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="prayer-requests" element={<PrayerRequestPage />} />
          <Route path="give" element={<GivePage />} />
        </Route>

        {/* ── Auth Routes (no layout wrapper) ── */}
        <Route path="/portal/login" element={<LoginPage />} />
        <Route path="/portal/register" element={<RegisterPage />} />

        {/* ── Protected Member Portal Routes ── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/portal/dashboard" element={<PortalDashboard />} />
        </Route>

        {/* ── Admin Dashboard Routes (Role Protected) ── */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardOverview />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/sermons" element={<ManageSermons />} />
            <Route path="/admin/events" element={<ManageEvents />} />
            <Route path="/admin/prayer-requests" element={<ManagePrayerRequests />} />
            <Route path="/admin/announcements" element={<ManageAnnouncements />} />
            <Route path="/admin/blog" element={<ManageBlog />} />
            <Route path="/admin/gallery" element={<ManageGallery />} />
          </Route>
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
