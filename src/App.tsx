/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import About from "./components/About";
import CeritaSafar from "./components/CeritaSafar";
import AdminCMS from "./components/AdminCMS";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import AuthModal from "./components/AuthModal";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<"home" | "about" | "cerita" | "admin">(() => {
    const path = window.location.pathname;
    if (path === "/admin") return "admin";
    if (path === "/cerita") return "cerita";
    if (path === "/about") return "about";
    return "home";
  });

  // Handle URL changes (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/admin") setCurrentPage("admin");
      else if (path === "/cerita") setCurrentPage("cerita");
      else if (path === "/about") setCurrentPage("about");
      else setCurrentPage("home");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update URL when page changes
  useEffect(() => {
    const path = currentPage === "home" ? "/" : `/${currentPage}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    window.scrollTo(0, 0);
  }, [currentPage]);

  const [authModal, setAuthModal] = useState<{ open: boolean; mode: "login" | "register" }>({
    open: false,
    mode: "login"
  });

  const handleOpenAuth = (mode: "login" | "register") => {
    setAuthModal({ open: true, mode });
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setAuthModal({ ...authModal, open: false });
  };

  return (
    <div className="relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar 
        onOpenAuth={handleOpenAuth} 
        isLoggedIn={isLoggedIn} 
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      
      <main>
        <AnimatePresence mode="wait">
          {currentPage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Hero onOpenAuth={handleOpenAuth} isLoggedIn={isLoggedIn} />
              <FAQ />
            </motion.div>
          )}
          {currentPage === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <About />
            </motion.div>
          )}
          {currentPage === "cerita" && (
            <motion.div
              key="cerita"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CeritaSafar />
            </motion.div>
          )}
          {currentPage === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <AdminCMS onOpenAuth={handleOpenAuth} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer onNavigate={setCurrentPage} />

      <AuthModal 
        isOpen={authModal.open} 
        onClose={() => setAuthModal({ ...authModal, open: false })}
        initialMode={authModal.mode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
