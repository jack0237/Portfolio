import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    function scrollHandler() {
      // Logic for scroll if needed later, but the pill stays mostly fixed visually
    }
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  const handleNavigation = (event, targetId) => {
    event.preventDefault();
    updateExpanded(false);

    if (location.pathname !== "/") {
      window.location.href = `/#${targetId}`;
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="curator-nav-wrapper">
      <nav className="curator-nav-pill">
        <Link to="/" className="curator-nav-brand">
          Jack0237
        </Link>
        <div className="curator-nav-links">
          <a
            href="#home"
            onClick={(e) => handleNavigation(e, "home")}
            className={`curator-nav-link ${
              location.pathname === "/" ? "active" : ""
            }`}
          >
            Home
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavigation(e, "about")}
            className="curator-nav-link"
          >
            About
          </a>
          <a
            href="#projects"
            onClick={(e) => handleNavigation(e, "projects")}
            className="curator-nav-link"
          >
            Projects
          </a>
          <Link
            to="/resume"
            onClick={() => updateExpanded(false)}
            className={`curator-nav-link ${
              location.pathname === "/resume" ? "active" : ""
            }`}
          >
            Resume
          </Link>
          <Link
            to="/blog"
            onClick={() => updateExpanded(false)}
            className={`curator-nav-link ${
              location.pathname === "/blog" ? "active" : ""
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
          <a
            href="#home"
            onClick={(e) => handleNavigation(e, "home")}
            className="curator-nav-link"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavigation(e, "about")}
            className="curator-nav-link"
          >
            About
          </a>
          <a
            href="#projects"
            onClick={(e) => handleNavigation(e, "projects")}
            className="curator-nav-link"
          >
            Projects
          </a>
          <Link
            to="/resume"
            onClick={() => updateExpanded(false)}
            className="curator-nav-link"
          >
            Resume
          </Link>
          <Link
            to="/blog"
            onClick={() => updateExpanded(false)}
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
