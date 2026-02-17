import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import GalleryPage from "./pages/GalleryPage";
import GetInvolvedPage from "./pages/GetInvolvedPage";
import TransparencyPage from "./pages/TransparencyPage";
import VolunteerPage from "./pages/VolunteerPage";
import RequestSupportPage from "./pages/RequestSupportPage";
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
          <Route path="/transparency" element={<TransparencyPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/request-support" element={<RequestSupportPage />} />

          {/* fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
