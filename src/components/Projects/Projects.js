"use client";

import React, { useState } from "react";
import "./Projects.css";

// Page héritée (refonte à venir). Les projets sont lus dans l'API côté serveur par la page
// (src/lib/api.ts, ISR + revalidation à la demande) ; ce composant ne garde que le filtre.
// Aucune donnée de repli : collection vide = état vide.

/** @param {{ projects?: import("../../lib/api").Project[], emptyLabel?: string }} props */
function Projects({ projects = [], emptyLabel = "" }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Web Design", "Full-Stack", "AI/ML"];

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="projects-page page-transition">
      <div className="projects-glow"></div>
      
      <div className="legacy-container">
        {/* Top Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 className="project-heading" style={{ fontSize: "3.5rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
            THE <span className="accent-text">SHOWCASE</span>
          </h1>
          <p style={{ color: "var(--on-surface-variant)", fontSize: "1.1rem" }}>
            Curated deployments taking physical form in the digital plane.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar-wrapper">
          <div className="filter-bar">
            {categories.map((cat, i) => (
              <button 
                key={i}
                className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Grid */}
        <div className="project-3d-grid">
          {filteredProjects.map((project) => (
            <a 
              href={project.link || undefined}
              target={project.link ? "_blank" : undefined}
              rel={project.link ? "noreferrer" : undefined}
              className="project-card-3d" 
              key={project.id}
            >
              <div className="project-img-wrapper">
                {project.image && /^https?:\/\//.test(project.image) && (
                  <img src={project.image} alt={project.title} />
                )}
                <div className="project-img-overlay"></div>
              </div>
              <div className="project-content">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="project-title mb-0">{project.title}</h3>
                  <span className={`project-status-badge ${project.status ? project.status.toLowerCase().replace(" ", "-") : ""}`}>
                    {project.status || "In Progress"}
                  </span>
                </div>
                <div className="project-tags">
                  {(project.tags || []).map((tag, i) => (
                    <span className="project-tag" key={i}>{tag}</span>
                  ))}
                </div>
                <p className="project-desc">{project.description}</p>
                
                <div className="project-action-btn">
                  View Case Study
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        {filteredProjects.length === 0 && <p className="legacy-empty">{emptyLabel}</p>}
      </div>
    </div>
  );
}

export default Projects;
