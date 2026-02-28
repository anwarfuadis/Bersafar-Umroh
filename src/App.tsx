/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import { motion, useScroll, useSpring } from "motion/react";
import { useState } from "react";
import AuthModal from "./components/AuthModal";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

      <Navbar onOpenAuth={handleOpenAuth} isLoggedIn={isLoggedIn} />
      
      <main>
        <Hero onOpenAuth={handleOpenAuth} isLoggedIn={isLoggedIn} />
        
        <FAQ />
      </main>

      <Footer />

      <AuthModal 
        isOpen={authModal.open} 
        onClose={() => setAuthModal({ ...authModal, open: false })}
        initialMode={authModal.mode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
