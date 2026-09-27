import "./Certifications.css";
import { FiAward, FiClock, FiExternalLink } from "react-icons/fi";

// Page héritée (refonte à venir). Composant serveur : certifications lues dans l'API par la page
// (src/lib/api.ts). Aucune donnée de repli : collection vide = état vide.
/** @param {{ certifications?: import("../../lib/api").Certification[], emptyLabel?: string }} props */
function Certifications({ certifications = [], emptyLabel = "" }) {
  const completedCerts = certifications.filter(cert => cert.status === 'completed');
  const ongoingCerts = certifications.filter(cert => cert.status === 'ongoing');

  return (
    <div id="certifications" className="certifications-page page-transition">
      <div className="cert-bg-noise"></div>
      <div className="legacy-container cert-container">
        
        <div className="cert-header">
          <h1 className="cert-title">CREDENTIALS <span className="accent-text">& MASTERY</span></h1>
          <p className="cert-subtitle">Verified ongoing and completed technical training</p>
        </div>

        {/* Completed Certifications */}
        {completedCerts.length > 0 && (
          <>
            <h2 className="cert-section-title"><span className="status-dot completed"></span> ACQUIRED CERTIFICATIONS</h2>
            <div className="legacy-row cert-grid">
              {completedCerts.map((cert) => (
                <div key={cert.id} className="mb-4">
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
                </div>
              ))}
            </div>
          </>
        )}

        {/* Ongoing Certifications */}
        {ongoingCerts.length > 0 && (
          <>
            <h2 className="cert-section-title mt-5"><span className="status-dot ongoing"></span> ONGOING TRAINING</h2>
            <div className="legacy-row cert-grid">
              {ongoingCerts.map((cert) => (
                <div key={cert.id} className="mb-4">
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
                </div>
              ))}
            </div>
          </>
        )}

        {certifications.length === 0 && <p className="legacy-empty">{emptyLabel}</p>}
      </div>
    </div>
  );
}

export default Certifications;
