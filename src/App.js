import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import Projects from "./components/Projects/Projects";
import Resume from "./components/Resume/ResumeNew";
import Blog from "./components/Blog/Blog";
import BlogPost from "./components/Blog/BlogPost";
import Certifications from "./components/Certifications/Certifications";
import Admin from "./components/Admin/Admin";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer";

function App() {
  const [load, upadateLoad] = useState(true);
  const [isBlogSubdomain, setIsBlogSubdomain] = useState(false);

  useEffect(() => {
    // Detect if the current hostname starts with 'blog.'
    const hostname = window.location.hostname;
    if (hostname.startsWith("blog.") || hostname.includes("blog-subdomain")) {
      setIsBlogSubdomain(true);
    }

    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <Navbar />
        <ScrollToTop />
        <Routes>
          {/* Main Route Switch: blog.domain.com shows Blog, otherwise Home */}
          <Route 
            path="/" 
            element={isBlogSubdomain ? <Blog /> : <Home />} 
          />
          
          <Route path="/projects" element={<Projects />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* If on blog subdomain, handle blog posts at the root: blog.domain.com/:id */}
          {isBlogSubdomain && (
            <Route path="/:id" element={<BlogPost />} />
          )}

          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/"/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
