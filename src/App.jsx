import { Navigate, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import GalleryPage from "./pages/GalleryPage";
import TransparencyPage from "./pages/TransparencyPage";
import VolunteerPage from "./pages/VolunteerPage";
import RequestSupportPage from "./pages/RequestSupportPage";
import BlogPage from "./pages/BlogPage";
import DonatePage from "./pages/DonatePage";
import FaqPage from "./pages/FaqPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photos" element={<GalleryPage />} />
          <Route path="/get-involved" element={<Navigate to="/donate" replace />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/transparency" element={<TransparencyPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/request-support" element={<RequestSupportPage />} />
          <Route path="/inspiring-stories" element={<BlogPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/blog" element={<Navigate to="/inspiring-stories" replace />} />
          {/* fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
