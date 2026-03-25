import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [isBlogSubdomain, setIsBlogSubdomain] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.startsWith("blog.") || hostname.includes("blog-subdomain")) {
      setIsBlogSubdomain(true);
    }

    function scrollHandler() {
      // Logic for scroll if needed later, but the pill stays mostly fixed visually
    }
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  if (location.pathname === "/admin") return null;

  const MAIN_DOMAIN = "https://jack0237.com";
  const BLOG_DOMAIN = "https://blog.jack0237.com";

  const getFullUrl = (path) => {
    if (window.location.hostname.includes("localhost")) return path;
    return `${MAIN_DOMAIN}${path}`;
  };

  const handleLinkClick = (e, path, forceSubdomain = false) => {
    updateExpanded(false);
    if (window.location.hostname.includes("localhost")) return;

    if (forceSubdomain) {
      if (!isBlogSubdomain) {
        e.preventDefault();
        window.location.href = BLOG_DOMAIN;
      }
    } else {
      if (isBlogSubdomain) {
        e.preventDefault();
        window.location.href = `${MAIN_DOMAIN}${path}`;
      }
    }
  };

  return (
    <header className="curator-nav-wrapper">
      <nav className="curator-nav-pill">
        <Link 
          to="/" 
          className="curator-nav-brand"
          onClick={(e) => handleLinkClick(e, "/")}
        >
          Jack0237
        </Link>
        <div className="curator-nav-links">
          <Link
            to="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className={`curator-nav-link ${
              (location.pathname === "/" && !isBlogSubdomain) ? "active" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/projects"
            onClick={(e) => handleLinkClick(e, "/projects")}
            className={`curator-nav-link ${
              location.pathname === "/projects" ? "active" : ""
            }`}
          >
            Projects
          </Link>
          <Link
            to="/resume"
            onClick={(e) => handleLinkClick(e, "/resume")}
            className={`curator-nav-link ${
              location.pathname === "/resume" ? "active" : ""
            }`}
          >
            Resume
          </Link>
          <Link
            to="/certifications"
            onClick={(e) => handleLinkClick(e, "/certifications")}
            className={`curator-nav-link ${
              location.pathname === "/certifications" ? "active" : ""
            }`}
          >
            Certifications
          </Link>
          <Link
            to="/blog"
            onClick={(e) => handleLinkClick(e, "/blog", true)}
            className={`curator-nav-link ${
              (location.pathname === "/blog" || isBlogSubdomain) ? "active" : ""
            }`}
          >
            Blog
          </Link>
        </div>
        <button className="curator-connect-btn">Connect</button>

        {/* Mobile Toggle */}
        <button
          className="curator-mobile-toggle"
          onClick={() => updateExpanded(!expand)}
          aria-label="Toggle navigation"
        >
          <span
            style={{
              transform: expand ? "rotate(45deg) translate(4px, 4px)" : "none",
            }}
          ></span>
          <span style={{ opacity: expand ? 0 : 1 }}></span>
          <span
            style={{
              transform: expand
                ? "rotate(-45deg) translate(4px, -4px)"
                : "none",
            }}
          ></span>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {expand && (
        <div className="curator-mobile-menu">
          <Link
            to="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className="curator-nav-link"
          >
            Home
          </Link>
          <Link
            to="/projects"
            onClick={(e) => handleLinkClick(e, "/projects")}
            className="curator-nav-link"
          >
            Projects
          </Link>
          <Link
            to="/resume"
            onClick={(e) => handleLinkClick(e, "/resume")}
            className="curator-nav-link"
          >
            Resume
          </Link>
          <Link
            to="/blog"
            onClick={(e) => handleLinkClick(e, "/blog", true)}
            className="curator-nav-link"
          >
            Blog
          </Link>
          <button className="curator-connect-btn" style={{ marginTop: "1rem" }}>
            Connect
          </button>
        </div>
      )}
    </header>
  );
}

export default NavBar;
