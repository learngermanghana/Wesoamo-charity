import { Navigate, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import GalleryPage from "./pages/GalleryPage";
import GetInvolvedPage from "./pages/GetInvolvedPage";
import TransparencyPage from "./pages/TransparencyPage";
import VolunteerPage from "./pages/VolunteerPage";
import RequestSupportPage from "./pages/RequestSupportPage";
import BlogPage from "./pages/BlogPage";
import SuccessPage from "./pages/SuccessPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photos" element={<GalleryPage />} />
          <Route path="/get-involved" element={<GetInvolvedPage />} />
          <Route path="/donate" element={<Navigate to="/get-involved" replace />} />
          <Route path="/donation-success" element={<SuccessPage kind="donation" />} />
          <Route path="/transparency" element={<TransparencyPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/volunteer-success" element={<SuccessPage kind="volunteer" />} />
          <Route path="/request-support" element={<RequestSupportPage />} />
          <Route path="/request" element={<Navigate to="/request-support" replace />} />
          <Route path="/request-success" element={<SuccessPage kind="request" />} />
          <Route path="/inspiring-stories" element={<BlogPage />} />
          <Route path="/blog" element={<Navigate to="/inspiring-stories" replace />} />
          {/* fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}