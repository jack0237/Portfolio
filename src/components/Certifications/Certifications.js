import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { fetchCollection, INITIAL_CERTIFICATIONS } from "../../utils/storage";
import "./Certifications.css";
import { FiAward, FiClock, FiExternalLink } from "react-icons/fi";

function Certifications() {
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    fetchCollection("certifications", INITIAL_CERTIFICATIONS).then(data => {
      setCertifications(data);
    });
  }, []);

  const completedCerts = certifications.filter(cert => cert.status === 'completed');
  const ongoingCerts = certifications.filter(cert => cert.status === 'ongoing');

  return (
    <div className="certifications-page page-transition">
      <div className="cert-bg-noise"></div>
      <Container className="cert-container">
        
        <div className="cert-header">
          <h1 className="cert-title">CREDENTIALS <span className="accent-text">& MASTERY</span></h1>
          <p className="cert-subtitle">Verified ongoing and completed technical training</p>
        </div>

        {/* Completed Certifications */}
        {completedCerts.length > 0 && (
          <>
            <h2 className="cert-section-title"><span className="status-dot completed"></span> ACQUIRED CERTIFICATIONS</h2>
            <Row className="cert-grid">
              {completedCerts.map((cert) => (
                <Col md={6} lg={4} key={cert.id} className="mb-4">
                  <div className="cert-card">
                    <div className="cert-icon-wrap">
                      <FiAward className="cert-icon" />
                    </div>
                    <div className="cert-content">
                      <h3 className="cert-name">{cert.title}</h3>
                      <div className="cert-issuer">{cert.issuer}</div>
                      <div className="cert-meta">
                        <span className="cert-date">{cert.date}</span>
                        {cert.link && (
                          <a href={cert.link} target="_blank" rel="noreferrer" className="cert-link">
                            Verify <FiExternalLink />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </  >
        )}

        {/* Ongoing Certifications */}
        {ongoingCerts.length > 0 && (
          <>
            <h2 className="cert-section-title mt-5"><span className="status-dot ongoing"></span> ONGOING TRAINING</h2>
            <Row className="cert-grid">
              {ongoingCerts.map((cert) => (
                <Col md={6} lg={4} key={cert.id} className="mb-4">
                  <div className="cert-card ongoing-card">
                     <div className="cert-icon-wrap ongoing">
                      <FiClock className="cert-icon" />
                    </div>
                    <div className="cert-content">
                      <h3 className="cert-name">{cert.title}</h3>
                      <div className="cert-issuer">{cert.issuer}</div>
                      <div className="cert-meta">
                        <span className="cert-date text-warning">In Progress ({cert.date})</span>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </  >
        )}

      </Container>
    </div>
  );
}

export default Certifications;
