import { AiOutlineDownload } from "react-icons/ai";
import "./Resume.css";
import { CV_PATH } from "../../lib/site";

// Page héritée (refonte à venir). Composant serveur : expériences et compétences lues dans l'API
// par la page (src/lib/api.ts). Aucune donnée de repli : collection vide = état vide.

const pdf = CV_PATH;

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

/** @param {{ experiences?: import("../../lib/api").Experience[], skills?: import("../../lib/api").Skill[], emptyExperiences?: string, emptySkills?: string }} props */
function ResumeNew({ experiences = [], skills = [], emptyExperiences = "", emptySkills = "" }) {
  return (
    <div className="resume-page page-transition">
      <div className="resume-scanlines"></div>
      
      <div className="legacy-container resume-container">
        
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
        {experiences.length === 0 && <p className="legacy-empty">{emptyExperiences}</p>}

        {/* Technical Capabilities grid */}
        <div className="resume-section-header" style={{ marginTop: '5rem' }}>Technical Proficiency</div>
        <div className="skills-grid">
          {skills.map((skill) => (
            <SkillMatrix key={skill.id} label={skill.label} level={skill.level} />
          ))}
        </div>
        {skills.length === 0 && <p className="legacy-empty">{emptySkills}</p>}

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

      </div>
    </div>
  );
}

export default ResumeNew;
