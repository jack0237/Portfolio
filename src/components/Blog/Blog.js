import React from "react";
import { Container } from "react-bootstrap";
import blogImg1 from "../../Assets/blog-img-1.jpg";
import blogImg2 from "../../Assets/blog-img-2.jpg";
import blogImg3 from "../../Assets/blog-img-3.jpg";
import "./Blog.css";

function Blog() {
  return (
    <div className="blog-page">
      <Container style={{ maxWidth: "1200px" }}>
        {/* Hero Header */}
        <header className="blog-header">
          <h1 className="blog-title-bg">LOGS</h1>
          <div className="position-relative z-index-10 d-flex flex-column gap-3">
            <span className="blog-eyebrow">System Intel / Journal</span>
            <h2 className="blog-title">
              ENCRYPTED <br />
              <span className="accent-text">THOUGHTS</span>
            </h2>
            <p className="blog-subtitle">
              Exploring the intersection of human creativity and machine intelligence. 
              Archives of a digital wanderer.
            </p>
          </div>
        </header>

        {/* Masonry Grid Area */}
        <div className="blog-masonry">
          
          {/* Featured Card (Large image, portrait) */}
          <article className="post-card">
            <a href="#article" style={{ textDecoration: 'none' }}>
              <div className="post-card-img-wrap">
                <img src={blogImg1} alt="Abstract digital geometry" className="post-card-img" />
                <div className="post-card-img-overlay" />
                <div className="post-card-img-tag">Research</div>
              </div>
              <div className="post-card-content">
                <div className="post-meta-line">
                  <span>OCT 24, 2024</span>
                  <span>08 MIN READ</span>
                </div>
                <h3 className="post-title primary">THE NEURAL AESTHETIC: DECODING AI DESIGN</h3>
                <p className="post-excerpt">
                  Analyzing how generative models are reshaping our understanding of traditional composition and visual balance.
                </p>
                <div className="post-cta">
                  Access Log
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </a>
          </article>

          {/* Standard Text Card */}
          <article className="post-card">
            <a href="#article" style={{ textDecoration: 'none' }}>
              <div className="post-card-content border-b">
                <div className="status-row">
                  <span className="status-dot"></span>
                  <span className="status-text">System Status</span>
                </div>
                <h3 className="post-title">MIGRATING TO THE VOID: INFRASTRUCTURE UPDATES</h3>
                <div className="post-meta-line" style={{ justifyContent: 'flex-start' }}>SEP 12, 2024</div>
              </div>
              <div className="post-card-content" style={{ paddingTop: '2rem' }}>
                <p className="post-excerpt mb-4">
                  Transitioning backend protocols to decentralized clusters for enhanced data integrity and lower latency.
                </p>
                <div className="tags-row">
                  <span className="tag-pill">#NODE</span>
                  <span className="tag-pill">#DEVLOG</span>
                </div>
              </div>
            </a>
          </article>

          {/* Image Card (Landscape video ratio) */}
          <article className="post-card video-ratio">
            <a href="#article" style={{ textDecoration: 'none' }}>
              <div className="post-card-img-wrap">
                <img src={blogImg2} alt="Cyberpunk architecture" className="post-card-img" />
              </div>
              <div className="post-card-content">
                <div className="post-meta-line" style={{ justifyContent: 'flex-start' }}>SEP 05, 2024</div>
                <h3 className="post-title" style={{ fontSize: '1.25rem' }}>CYBER-MINIMALISM IN URBAN ENVIRONMENTS</h3>
                <p className="post-excerpt">Photographic study of light and shadow in the Neo-Tokyo business district.</p>
              </div>
            </a>
          </article>

          {/* Quote Style Card */}
          <article className="post-card quote-card">
            <span className="material-symbols-outlined quote-icon">terminal</span>
            <p className="quote-text">
              "Complexity is the enemy of clarity. In the void, only the essential survives."
            </p>
            <div className="quote-divider"></div>
            <span className="quote-author">Fragment 0x4F2</span>
          </article>

          {/* Image Card Grayscale (Square ratio) */}
          <article className="post-card square-ratio">
            <a href="#article" style={{ textDecoration: 'none' }}>
              <div className="post-card-img-wrap">
                <img src={blogImg3} alt="React code on screen" className="post-card-img grayscale" />
              </div>
              <div className="post-card-content">
                <div className="post-meta-line" style={{ justifyContent: 'flex-start' }}>AUG 28, 2024</div>
                <h3 className="post-title" style={{ fontSize: '1.25rem' }}>BEYOND PIXELS: THE SPATIAL WEB</h3>
                <p className="post-excerpt">How WebXR is transforming 2D interfaces into immersive 3D canvases.</p>
                <div className="post-cta" style={{ marginTop: '0.5rem', opacity: 0.8 }}>
                  <span style={{ color: 'var(--secondary)' }}>Read Discussion</span>
                </div>
              </div>
            </a>
          </article>

          {/* Simple List Card */}
          <article className="post-card list-card">
            <h3 className="list-title">System Archives</h3>
            <div className="d-flex flex-column gap-3 mt-4">
              <div className="list-item">
                <span className="list-item-title">Digital Craftsmanship</span>
                <span className="list-item-year">2024</span>
              </div>
              <div className="list-item">
                <span className="list-item-title">The Edge of Reality</span>
                <span className="list-item-year">2023</span>
              </div>
              <div className="list-item">
                <span className="list-item-title">Liquid Interfaces</span>
                <span className="list-item-year">2023</span>
              </div>
            </div>
          </article>

        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className="page-btn">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="page-text">PAGE <span>01</span> / 08</span>
          <button className="page-btn">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

      </Container>
    </div>
  );
}

export default Blog;
