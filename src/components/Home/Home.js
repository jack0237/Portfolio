import React from "react";
import Home2 from "./Home2";
import About from "../About/About";
import Projects from "../Projects/Projects";

function Home() {
  return (
    <section>
      {/* ─── NEW HERO SECTION (from Stitch HTML) ─── */}
      <section className="hero-section" id="home">
        {/* Background Visuals */}
        <div className="hero-glow-cyan" />
        <div className="hero-glow-violet" />
        <div className="hero-glow-radial" />
        <div className="hero-grid" />

        {/* Bento Accents */}
        <div className="hero-bento-1" />
        <div className="hero-bento-2" />

        <div className="hero-content">
          {/* Status Chip */}
          <div className="hero-status-chip">
            <span className="status-dot"></span>
            <span className="hero-status-text">Available for new systems</span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-headline">
            <span className="hero-line-1">Curating the</span>
            <span className="hero-line-2 text-outline">Digital</span>
            <span className="hero-line-3 text-gradient">Void.</span>
          </h1>

          {/* Subheadline */}
          <p className="hero-sub">
            Engineered for the near-future metropolis. A collection of high-frequency digital experiences focused on aesthetic mastery and technical precision.
          </p>

          {/* CTAs */}
          <div className="hero-cta-group">
            <a href="#projects" className="hero-cta-primary">
              View My Work
            </a>
            <a href="/blog" className="hero-cta-secondary">
              Enter the archives
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator">
          <span className="hero-scroll-text">Scroll to descend</span>
          <div className="hero-scroll-line"></div>
        </div>
      </section>

      {/* About Section */}
      <div id="about">
        <Home2 />
        <About />
      </div>

      {/* Projects Section */}
      <div id="projects">
        <Projects />
      </div>
    </section>
  );
}

export default Home;
