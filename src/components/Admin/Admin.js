import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Table } from "react-bootstrap";
import MDEditor from '@uiw/react-md-editor';
import { 
  fetchCollection, 
  saveDocument,
  deleteDocument,
  uploadImage,
  INITIAL_BLOG_POSTS, 
  INITIAL_RESUME_EXPERIENCE, 
  INITIAL_RESUME_SKILLS,
  INITIAL_CERTIFICATIONS
} from "../../utils/storage";
import "./Admin.css";

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [activeTab, setActiveTab] = useState("blog"); // 'blog', 'resume', 'skills'

  // Data states
  const [blogs, setBlogs] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
      loadAdminData();
    }
  }, []);

  const loadAdminData = async () => {
    setBlogs(await fetchCollection("blogs", INITIAL_BLOG_POSTS));
    setExperiences(await fetchCollection("experiences", INITIAL_RESUME_EXPERIENCE));
    setSkills(await fetchCollection("skills", INITIAL_RESUME_SKILLS));
    setCertifications(await fetchCollection("certifications", INITIAL_CERTIFICATIONS));
  };


  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "cortex" || passcode === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      loadAdminData();
    } else {
      alert("Invalid Access Code");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
  };

  // Adding generic items (local state only, saved remotely upon SAVE button press)
  const addBlog = () => {
    const newBlog = { id: Date.now().toString(), title: "NEW ENTRY", date: "TODAY", readTime: "0 MIN", eyebrow: "Category", image: "", content: "New Content..." };
    setBlogs([newBlog, ...blogs]);
  };
  const addExperience = () => {
    const newExp = { id: Date.now().toString(), title: "New Role", company: "Company", date: "YEAR - YEAR", description: "Responsibilities..." };
    setExperiences([newExp, ...experiences]);
  };
  const addSkill = () => {
    const newSkill = { id: Date.now().toString(), label: "New Skill", level: 1 };
    setSkills([...skills, newSkill]);
  };
  const addCert = () => {
    const newCert = { id: Date.now().toString(), title: "New Certificate", issuer: "Issuer Name", date: "Year", status: "completed", link: "" };
    setCertifications([newCert, ...certifications]);
  };

  // Delete generic items (local and remote)
  const handleDeleteBlog = async (id) => {
    setBlogs(blogs.filter(b => b.id !== id));
    await deleteDocument("blogs", id);
  };
  const handleDeleteExperience = async (id) => {
    setExperiences(experiences.filter(e => e.id !== id));
    await deleteDocument("experiences", id);
  };
  const handleDeleteSkill = async (id) => {
    setSkills(skills.filter(s => s.id !== id));
    await deleteDocument("skills", id);
  };
  const handleDeleteCert = async (id) => {
    setCertifications(certifications.filter(c => c.id !== id));
    await deleteDocument("certifications", id);
  };

  // Update local state without pushing to DB yet
  const updateBlogLocal = (id, field, value) => {
    setBlogs(blogs.map(b => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const handleImageUpload = async (e, blogId) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, `blog-images/${blogId}_${file.name}`);
      if (url) {
        updateBlogLocal(blogId, "image", url);
        alert("Image uploaded successfully! Remember to click SAVE TO FIRESTORE.");
      }
    } catch (err) {
      alert("Failed to upload image.");
    }
  };

  const updateExperienceLocal = (id, field, value) => {
    setExperiences(experiences.map(e => (e.id === id ? { ...e, [field]: value } : e)));
  };
  const updateSkillLocal = (id, field, value) => {
    setSkills(skills.map(s => (s.id === id ? { ...s, [field]: field === "level" ? parseInt(value) || 0 : value } : s)));
  };
  const updateCertLocal = (id, field, value) => {
    setCertifications(certifications.map(c => (c.id === id ? { ...c, [field]: value } : c)));
  };

  // Push individual item to DB
  const saveBlogToDB = async (blog) => {
    await saveDocument("blogs", blog.id, blog);
    alert("Blog Post Saved successfully!");
  };
  const saveExperienceToDB = async (exp) => {
    await saveDocument("experiences", exp.id, exp);
    alert("Experience Saved successfully!");
  };
  const saveSkillToDB = async (skill) => {
    await saveDocument("skills", skill.id, skill);
  };
  const saveCertToDB = async (cert) => {
    await saveDocument("certifications", cert.id, cert);
    alert("Certification Saved successfully!");
  };


  if (!isAuthenticated) {
    return (
      <div className="admin-login-page page-transition">
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div className="admin-login-box">
            <h2 className="admin-heading mb-4">SYSTEM ADMIN TERMINAL</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>ACCESS CODE</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Enter passcode..." 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="admin-input"
                />
              </Form.Group>
              <Button type="submit" className="admin-btn mt-2 w-100">
                INITIALIZE CONNECTION
              </Button>
            </Form>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="admin-page page-transition">
      <Container style={{ paddingTop: "120px", paddingBottom: "100px" }}>
        
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="admin-main-title">COMMAND <span className="accent-text">CENTER</span></h1>
          <button className="admin-btn-logout" onClick={handleLogout}>TERMINATE SESSION</button>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs mb-4">
          <button className={`admin-tab ${activeTab === "blog" ? "active" : ""}`} onClick={() => setActiveTab("blog")}>BLOG MANAGEMENT</button>
          <button className={`admin-tab ${activeTab === "resume" ? "active" : ""}`} onClick={() => setActiveTab("resume")}>EXPERIENCE TIMELINE</button>
          <button className={`admin-tab ${activeTab === "skills" ? "active" : ""}`} onClick={() => setActiveTab("skills")}>SKILL MATRIX</button>
          <button className={`admin-tab ${activeTab === "certs" ? "active" : ""}`} onClick={() => setActiveTab("certs")}>CERTIFICATIONS</button>
        </div>

        <div className="admin-content-card">
          
          {/* BLOG MANAGEMENT TAB */}
          {activeTab === "blog" && (
            <div>
              <div className="d-flex justify-content-between mb-4">
                <h3 className="admin-section-title">Blog Entries (Blogs Collection)</h3>
                <button className="admin-btn" onClick={addBlog}>+ NEW ENTRY</button>
              </div>
              
              {blogs.map((blog) => (
                <div key={blog.id} className="admin-item-block mb-4">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={blog.title} onChange={(e) => updateBlogLocal(blog.id, "title", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="text" value={blog.date} onChange={(e) => updateBlogLocal(blog.id, "date", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>Category/Eyebrow</Form.Label>
                        <Form.Control type="text" value={blog.eyebrow} onChange={(e) => updateBlogLocal(blog.id, "eyebrow", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-2">
                    <Form.Label>Cover Image (Upload to Firebase Storage)</Form.Label>
                    <div className="d-flex align-items-center gap-3">
                      <Form.Control type="file" accept="image/*" onChange={(e) => handleImageUpload(e, blog.id)} className="admin-input flex-grow-1" />
                      {blog.image && blog.image.startsWith('http') && (
                        <div style={{width: "40px", height: "40px", overflow: 'hidden', borderRadius: '4px', border: '1px solid var(--neon-cyan)'}}>
                           <img src={blog.image} alt="preview" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                        </div>
                      )}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Detailed Content (Markdown Supported)</Form.Label>
                    <div data-color-mode="dark">
                      <MDEditor
                        value={blog.content || ""}
                        onChange={(val) => updateBlogLocal(blog.id, "content", val || "")}
                        preview="edit"
                        height={300}
                        style={{ backgroundColor: 'var(--midnight-charcoal)', border: '1px solid var(--neon-cyan)' }}
                      />
                    </div>
                  </Form.Group>
                  <div className="mt-3">
                    <button className="admin-btn me-2" onClick={() => saveBlogToDB(blog)}>SAVE TO FIRESTORE</button>
                    <button className="admin-btn-danger" onClick={() => handleDeleteBlog(blog.id)}>DELETE ENTRY</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EXPERIENCE TIMELINE TAB */}
          {activeTab === "resume" && (
            <div>
              <div className="d-flex justify-content-between mb-4">
                <h3 className="admin-section-title">Experience Cards (Experiences Collection)</h3>
                <button className="admin-btn" onClick={addExperience}>+ NEW ROLE</button>
              </div>
              
              {experiences.map((exp) => (
                <div key={exp.id} className="admin-item-block mb-4">
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Role Title</Form.Label>
                        <Form.Control type="text" value={exp.title} onChange={(e) => updateExperienceLocal(exp.id, "title", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Company</Form.Label>
                        <Form.Control type="text" value={exp.company} onChange={(e) => updateExperienceLocal(exp.id, "company", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Date Range</Form.Label>
                        <Form.Control type="text" value={exp.date} onChange={(e) => updateExperienceLocal(exp.id, "date", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-2">
                    <Form.Label>Description Content</Form.Label>
                    <Form.Control as="textarea" rows={4} value={exp.description} onChange={(e) => updateExperienceLocal(exp.id, "description", e.target.value)} className="admin-input" />
                  </Form.Group>
                  <div className="mt-3">
                    <button className="admin-btn me-2" onClick={() => saveExperienceToDB(exp)}>SAVE TO FIRESTORE</button>
                    <button className="admin-btn-danger" onClick={() => handleDeleteExperience(exp.id)}>DELETE ROLE</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SKILL MATRIX TAB */}
          {activeTab === "skills" && (
            <div>
               <div className="d-flex justify-content-between mb-4">
                <h3 className="admin-section-title">Technical Proficiency (Skills Collection)</h3>
                <button className="admin-btn" onClick={addSkill}>+ NEW SKILL</button>
              </div>

              <Table variant="dark" className="admin-table">
                <thead>
                  <tr>
                    <th>Skill Label</th>
                    <th width="150">Level (0-6)</th>
                    <th width="200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((skill) => (
                    <tr key={skill.id}>
                      <td>
                        <Form.Control type="text" value={skill.label} onChange={(e) => updateSkillLocal(skill.id, "label", e.target.value)} className="admin-input" />
                      </td>
                      <td>
                        <Form.Control type="number" min="0" max="6" value={skill.level} onChange={(e) => updateSkillLocal(skill.id, "level", e.target.value)} className="admin-input" />
                      </td>
                      <td className="d-flex gap-2">
                         <button className="admin-btn py-1 px-2" style={{fontSize: '0.8rem'}} onClick={() => saveSkillToDB(skill)}>SAVE</button>
                         <button className="admin-btn-danger py-1 px-2" onClick={() => handleDeleteSkill(skill.id)}>DEL</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* CERTIFICATIONS TAB */}
          {activeTab === "certs" && (
            <div>
              <div className="d-flex justify-content-between mb-4">
                <h3 className="admin-section-title">Certifications (Certifications Collection)</h3>
                <button className="admin-btn" onClick={addCert}>+ NEW CERT</button>
              </div>
              
              {certifications.map((cert) => (
                <div key={cert.id} className="admin-item-block mb-4">
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>Certificate</Form.Label>
                        <Form.Control type="text" value={cert.title} onChange={(e) => updateCertLocal(cert.id, "title", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>Issuer</Form.Label>
                        <Form.Control type="text" value={cert.issuer} onChange={(e) => updateCertLocal(cert.id, "issuer", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Date/Year</Form.Label>
                        <Form.Control type="text" value={cert.date} onChange={(e) => updateCertLocal(cert.id, "date", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={cert.status} onChange={(e) => updateCertLocal(cert.id, "status", e.target.value)} className="admin-input">
                          <option value="completed">Completed</option>
                          <option value="ongoing">Ongoing</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Verify URL (Opt)</Form.Label>
                        <Form.Control type="text" value={cert.link} onChange={(e) => updateCertLocal(cert.id, "link", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <button className="admin-btn me-2" onClick={() => saveCertToDB(cert)}>SAVE TO FIRESTORE</button>
                    <button className="admin-btn-danger" onClick={() => handleDeleteCert(cert.id)}>DELETE CERT</button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </Container>
    </div>
  );
}

export default Admin;
