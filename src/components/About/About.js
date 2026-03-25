import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import profileImg from "../../Assets/profile.jpg";
import "./About.css";

function About() {
  const skills = [
    {
      title: "FRONTEND",
      desc: "REACT / TAILWIND / NEXT.JS",
      icon: "developer_mode_tv",
      type: "primary"
    },
    {
      title: "INTELLIGENCE",
      desc: "AI MODELS / LLM OPS",
      icon: "neurology",
      type: "secondary"
    },
    {
      title: "INTERFACES",
      desc: "UI / UX / MOTION",
      icon: "auto_awesome",
      type: "primary"
    },
    {
      title: "ARCHITECTURE",
      desc: "SUPABASE / NODE / SQL",
      icon: "database",
      type: "secondary"
    },
    {
      title: "WEB3",
      desc: "ETHEREUM / SMART CONTS",
      icon: "token",
      type: "primary"
    },
    {
      title: "SCRIPTS",
      desc: "PYTHON / BASH / RUST",
      icon: "terminal",
      type: "secondary"
    }
  ];

  return (
    <section className="about-page page-transition">
      {/* Background Visuals */}
      <div className="digital-dust"></div>
      <div className="about-glow-top"></div>
      <div className="about-glow-bottom"></div>

      <Container>
        <Row className="gy-5 align-items-start">
          {/* Column 1: Profile */}
          <Col lg={5} className="profile-col">
            <div className="profile-frame-wrapper">
              <div className="profile-frame neon-border-cyan">
                <img 
                  src={profileImg} 
                  alt="Professional portrait" 
                  className="profile-img"
                  style={{ objectFit: 'cover' }}
                />
                <div className="holographic-overlay" style={{ position: 'absolute', inset: 0 }}></div>
                <div className="scanner-line"></div>
              </div>

              {/* Social Dock */}
              <div className="social-dock glass-panel">
                <a href="https://github.com/jack0237" target="_blank" rel="noreferrer" className="social-icon-link">
                  <span className="material-symbols-outlined">terminal</span>
                  <span className="pulse-dot"></span>
                </a>
                <a href="https://www.linkedin.com/in/ngueguim-wilfried/" target="_blank" rel="noreferrer" className="social-icon-link">
                  <span className="material-symbols-outlined">dataset</span>
                </a>
                <div className="dock-divider"></div>
                <a href="https://twitter.com/Soumyajit4419" target="_blank" rel="noreferrer" className="social-icon-link">
                  <span className="material-symbols-outlined">share</span>
                </a>
              </div>
            </div>

            <div className="text-center text-lg-start pt-4">
              <h2 className="font-headline text-glow-primary uppercase mb-2" style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.2em', color: 'var(--primary-container)' }}>
                Creative Developer
              </h2>
              <div className="d-flex align-items-center gap-3 justify-content-center justify-content-lg-start opacity-70">
                <span className="pulse-dot" style={{ width: '8px', height: '8px', background: 'var(--primary-container)', borderRadius: '50%', display: 'inline-block' }}></span>
                <p className="font-label text-xs uppercase mb-0" style={{ letterSpacing: '0.3em', fontSize: '0.75rem' }}>
                  Status: Available for Collaboration
                </p>
              </div>
            </div>
          </Col>

          {/* Column 2: Bio & Skills */}
          <Col lg={7} className="bio-col">
            {/* Bio Block */}
            <div className="bio-block relative" style={{ position: 'relative' }}>
              <span className="about-bg-text">ABOUT</span>
              <h3 className="bio-headline">
                Synthesizing <span className="gradient-text">Digital Experiences</span> for the Modern Web.
              </h3>
              <p className="bio-text">
                I bridge the gap between architectural code and immersive visual design. With a focus on <span style={{ color: 'var(--primary-container)', fontWeight: 500 }}>high-frequency interfaces</span> and cinematic user journeys, I curate digital spaces that are as functional as they are breathtaking.
              </p>
              <p className="bio-text">
                Currently based in the digital ether, exploring the intersection of AI-driven workflows and organic frontend development. Every line of code is a brushstroke in a larger narrative of technological mastery.
              </p>
            </div>

            {/* Skills Section */}
            <div className="skills-section">
              <div className="section-header">
                <h4 className="section-title">System_Capabilities</h4>
                <div className="section-line"></div>
              </div>

              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className={`skill-card glass-panel ${skill.type === 'secondary' ? 'secondary-hover' : ''}`}
                  >
                    <span className="material-symbols-outlined skill-icon">
                      {skill.icon}
                    </span>
                    <div>
                      <h5 className="skill-name">{skill.title}</h5>
                      <p className="skill-desc">{skill.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Footer */}
            <div className="cta-footer">
              <a href="mailto:ngueguimwilfried.pro@gmail.com" className="initialize-btn neon-border-cyan" style={{ textDecoration: 'none' }}>
                INITIALIZE_CONTACT
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
              <Link to="/resume" className="resume-link">
                DOWNLOAD_ENCRYPTED_RESUME
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default About;
