import React from "react";
import { Container } from "react-bootstrap";
import laptopImg from "../../Assets/about.png";
import "./About.css";

// Icons 
import { CgCPlusPlus } from "react-icons/cg";
import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiPython,
  DiGit,
  DiJava,
} from "react-icons/di";
import {
  SiRedis,
  SiFirebase,
  SiNextdotjs,
  SiSolidity,
  SiPostgresql,
} from "react-icons/si";
import { TbBrandGolang } from "react-icons/tb";

function About() {
  const techStack = [
    { icon: <CgCPlusPlus />, name: "C++" },
    { icon: <DiJavascript1 />, name: "JavaScript" },
    { icon: <TbBrandGolang />, name: "Go" },
    { icon: <DiNodejs />, name: "Node.js" },
    { icon: <DiReact />, name: "React" },
    { icon: <SiSolidity />, name: "Solidity" },
    { icon: <DiMongodb />, name: "MongoDB" },
    { icon: <SiNextdotjs />, name: "Next.js" },
    { icon: <DiGit />, name: "Git" },
    { icon: <SiFirebase />, name: "Firebase" },
    { icon: <SiRedis />, name: "Redis" },
    { icon: <SiPostgresql />, name: "PostgreSQL" },
    { icon: <DiPython />, name: "Python" },
    { icon: <DiJava />, name: "Java" },
  ];

  return (
    <section className="about-page page-transition">
      <div className="about-glow"></div>
      <div className="about-bento"></div>

      <Container>
        <div className="about-split-grid">
          {/* Left Column: Hologram Portrait */}
          <div className="about-hologram-col">
            <div className="hologram-wrapper">
              <div 
                className="hologram-base" 
                style={{ backgroundImage: `url(${laptopImg})` }}
              ></div>
              <div 
                className="hologram-glitch-1" 
                style={{ backgroundImage: `url(${laptopImg})` }}
              ></div>
              <div 
                className="hologram-glitch-2" 
                style={{ backgroundImage: `url(${laptopImg})` }}
              ></div>
              <div className="hologram-scanline"></div>
            </div>
          </div>

          {/* Right Column: Bio */}
          <div className="about-bio-col">
            <span className="about-eyebrow">Identity Hub</span>
            <h1 className="about-title">
              DESIGN <br />
              <span className="accent-text">ENGINEER</span>
            </h1>
            <p className="about-text">
              Bridging the gap between hyper-aesthetic interfaces and robust system architectures. I build digital experiences that operate flawlessly in the background while commanding attention in the foreground.
            </p>
            <p className="about-text">
              Whether integrating decentralized protocols or orchestrating complex state across modern frameworks, the goal remains the same: Absolute precision.
            </p>

            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">4+</span>
                <span className="stat-label">Years Uptime</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">80+</span>
                <span className="stat-label">Deployments</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Cyber-Aesthetic</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Full Bleed Marquee */}
      <div className="marquee-container">
        <div className="marquee-content">
          {/* We render the stack twice to create the seamless loop effect perfectly */}
          {[...techStack, ...techStack].map((tech, index) => (
            <div className="marquee-icon-wrap" key={index}>
              {tech.icon}
              <span className="marquee-icon-name">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
