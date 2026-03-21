import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import pdf from "../../Assets/RN_CV_NGUEGUIM_WILFRIED.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import "./Resume.css";
import { fetchCollection, INITIAL_RESUME_EXPERIENCE, INITIAL_RESUME_SKILLS } from "../../utils/storage";

// Reusable Dot-Matrix Skill Component
const SkillMatrix = ({ label, level }) => {
  const totalDots = 6;
  return (
    <div className="skill-matrix-item">
      <span className="skill-name">{label}</span>
      <div className="dot-matrix">
        {[...Array(totalDots)].map((_, index) => (
          <div 
            key={index} 
            className={`skill-dot ${index < level ? 'active' : 'inactive'}`}
          />
        ))}
      </div>
    </div>
  );
};

function ResumeNew() {
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchCollection("experiences", INITIAL_RESUME_EXPERIENCE).then(data => {
      // Sort experiences structurally if needed, here we just reverse them or leave as stored
      setExperiences(data);
    });
    fetchCollection("skills", INITIAL_RESUME_SKILLS).then(data => {
      setSkills(data);
    });
  }, []);

  return (
    <div className="resume-page page-transition">
      <div className="resume-scanlines"></div>
      
      <Container className="resume-container">
        
        {/* Top Download PDF CTA */}
        <div className="resume-download-btn-wrapper">
          <a
            href={pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="scan-btn"
          >
            <AiOutlineDownload className="scan-btn-icon" />
            Download Data.PDF
          </a>
        </div>

        {/* Experience Timeline */}
        <div className="resume-section-header">System Logs / Experience</div>
        <div className="timeline-wrapper">
          {experiences.map((exp) => (
            <div className="timeline-item" key={exp.id}>
              <div className="timeline-dot"></div>
              <div className="experience-card">
                <div className="exp-header">
                  <div>
                    <h3 className="exp-title">{exp.title}</h3>
                    <div className="exp-company">{exp.company}</div>
                  </div>
                  <div className="exp-date">{exp.date}</div>
                </div>
                <p className="exp-desc">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Capabilities grid */}
        <div className="resume-section-header" style={{ marginTop: '5rem' }}>Technical Proficiency</div>
        <div className="skills-grid">
          {skills.map((skill) => (
            <SkillMatrix key={skill.id} label={skill.label} level={skill.level} />
          ))}
        </div>

        {/* Bottom Download PDF CTA */}
        <div className="resume-download-btn-wrapper" style={{ marginTop: '6rem' }}>
          <a
            href={pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="scan-btn"
          >
            <AiOutlineDownload className="scan-btn-icon" />
            Download Data.PDF
          </a>
        </div>

      </Container>
    </div>
  );
}

export default ResumeNew;
