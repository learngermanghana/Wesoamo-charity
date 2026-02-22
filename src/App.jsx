import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import GalleryPage from "./pages/GalleryPage";
import GetInvolvedPage from "./pages/GetInvolvedPage";
import TransparencyPage from "./pages/TransparencyPage";
import VolunteerPage from "./pages/VolunteerPage";
import RequestSupportPage from "./pages/RequestSupportPage";
import BlogPage from "./pages/BlogPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photos" element={<GalleryPage />} />
          <Route path="/get-involved" element={<GetInvolvedPage />} />
          <Route path="/transparency" element={<TransparencyPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/request-support" element={<RequestSupportPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/reports"
            element={(
              <ProtectedRoute>
                <AdminReportsPage />
              </ProtectedRoute>
            )}
          />

          {/* fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
