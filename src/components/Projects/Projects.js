import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import leaf from "../../Assets/Projects/leaf.png";
import emotion from "../../Assets/Projects/emotion.png";
import editor from "../../Assets/Projects/codeEditor.png";
import chatify from "../../Assets/Projects/chatify.png";
import suicide from "../../Assets/Projects/suicide.png";
import bitsOfCode from "../../Assets/Projects/blog.png";
import { fetchCollection } from "../../utils/storage";
import "./Projects.css";

const imgMap = {
  chatify,
  bitsOfCode,
  editor,
  leaf,
  suicide,
  emotion
};

const INITIAL_PROJECTS_DATA = [
  {
    id: "1",
    title: "Chatify",
    description: "Personal Chat Room or Workspace to share resources and hangout with friends build with react.js, Material-UI, and Firebase. Features realtime messaging, image sharing, and reactions.",
    image: "chatify",
    tags: ["React", "Firebase", "Material-UI"],
    category: "Full-Stack",
    status: "Released",
    link: "https://chatify-49.web.app/"
  },
  {
    id: "2",
    title: "Bits-0f-C0de",
    description: "My personal blog page build with Next.js and Tailwind Css which takes the content from markdown files and renders it using Next.js. Supports dark mode and easy authoring.",
    image: "bitsOfCode",
    tags: ["Next.js", "Tailwind CSS"],
    category: "Web Design",
    status: "Released",
    link: "https://blogs.soumya-jit.tech/"
  },
  {
    id: "3",
    title: "Editor.io",
    description: "Online code and markdown editor built with react.js. Supports html, css, and js code with instant preview. Features autosave using Local Storage.",
    image: "editor",
    tags: ["React", "CSS", "LocalStorage"],
    category: "Web Design",
    status: "Released",
    link: "https://editor.soumya-jit.tech/"
  },
  {
    id: "4",
    title: "Plant AI",
    description: "Trained an image classifier using PyTorch framework, CNN and Transfer Learning with 38 classes of plant leaves. Achieved 98% accuracy detecting diseases.",
    image: "leaf",
    tags: ["PyTorch", "Python", "AI/ML"],
    category: "AI/ML",
    status: "Released",
    link: "https://plant49-ai.herokuapp.com/"
  },
  {
    id: "5",
    title: "AI For Social Good",
    description: "Using Natural Language Processing for the detection of suicide-related posts and user's suicide ideation in cyberspace to help in suicide prevention.",
    image: "suicide",
    tags: ["Python", "NLP", "Machine Learning"],
    category: "AI/ML",
    status: "Released",
    link: "https://github.com/soumyajit4419/AI_For_Social_Good"
  },
  {
    id: "6",
    title: "Face Recognition",
    description: "Trained a CNN classifier using FER-2013 dataset with Keras and tensorflow backend. Uses OpenCV to detect faces in an image and passes the face to predict emotion.",
    image: "emotion",
    tags: ["TensorFlow", "OpenCV", "Keras"],
    category: "AI/ML",
    status: "Released",
    link: "https://github.com/soumyajit4419/Face_And_Emotion_Detection"
  }
];

function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchCollection("projects", INITIAL_PROJECTS_DATA).then(data => {
      setProjects(data);
    });
  }, []);

  const categories = ["All", "Web Design", "Full-Stack", "AI/ML"];

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="projects-page page-transition">
      <div className="projects-glow"></div>
      
      <Container>
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
              href={project.link} 
              target="_blank" 
              rel="noreferrer" 
              className="project-card-3d" 
              key={project.id}
            >
              <div className="project-img-wrapper">
                <img src={project.image && project.image.startsWith("http") ? project.image : (imgMap[project.image] || project.image)} alt={project.title} />
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
                  {project.tags.map((tag, i) => (
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
      </Container>
    </div>
  );
}

export default Projects;
