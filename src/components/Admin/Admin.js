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
import { auth } from "../../utils/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import "./Admin.css";

const ADMIN_EMAIL = "jasonngueguim@gmail.com";

function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("blog"); // 'blog', 'resume', 'skills'

  // Data states
  const [blogs, setBlogs] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);

  // Local state for tag inputs to fix the "comma bug"
  const [blogTagInputs, setBlogTagInputs] = useState({});
  const [allExistingTags, setAllExistingTags] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setUser(currentUser);
        loadAdminData();
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadAdminData = async () => {
    const blogData = await fetchCollection("blogs", INITIAL_BLOG_POSTS);
    setBlogs(blogData);
    setExperiences(await fetchCollection("experiences", INITIAL_RESUME_EXPERIENCE));
    setSkills(await fetchCollection("skills", INITIAL_RESUME_SKILLS));
    setCertifications(await fetchCollection("certifications", INITIAL_CERTIFICATIONS));
    setProjects(await fetchCollection("projects", []));

    // Initialize tag inputs and history
    const tagMap = {};
    const tagsSet = new Set();
    blogData.forEach(blog => {
      tagMap[blog.id] = (blog.tags || []).join(", ");
      if (blog.tags) blog.tags.forEach(t => tagsSet.add(t));
    });
    setBlogTagInputs(tagMap);
    setAllExistingTags(Array.from(tagsSet).sort());
  };


  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        alert("Unauthorized Access: This terminal is restricted to the system administrator.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Adding generic items (local state only, saved remotely upon SAVE button press)
  const addBlog = () => {
    const newBlog = { id: Date.now().toString(), title: "NEW ENTRY", date: "TODAY", readTime: "0 MIN", eyebrow: "Category", image: "", content: "New Content...", tags: ["#RESEARCH"] };
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

  const addProject = () => {
    const newProj = { id: Date.now().toString(), title: "New Project", description: "Project description...", image: "", tags: ["React"], category: "Web Design", status: "In Progress", link: "" };
    setProjects([newProj, ...projects]);
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

  const handleDeleteProject = async (id) => {
    setProjects(projects.filter(p => p.id !== id));
    await deleteDocument("projects", id);
  };

  // Update local state without pushing to DB yet
  const updateBlogLocal = (id, field, value) => {
    setBlogs(blogs.map(b => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const handleBlogTagChange = (id, value) => {
    const upperValue = value.toUpperCase();
    // Update the visual input string immediately in uppercase
    setBlogTagInputs(prev => ({ ...prev, [id]: upperValue }));

    // Update the actual blog object tags array
    const tagsArray = upperValue.split(',')
      .map(tag => {
        let t = tag.trim();
        if (t && !t.startsWith('#')) t = '#' + t;
        return t; // Already uppercased above
      })
      .filter(t => t !== "");
    
    updateBlogLocal(id, "tags", tagsArray);

    // Refresh history suggestions based on current tags in all blogs
    const tagsSet = new Set(allExistingTags);
    tagsArray.forEach(t => tagsSet.add(t));
    setAllExistingTags(Array.from(tagsSet).sort());
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

  const updateProjectLocal = (id, field, value) => {
    setProjects(projects.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleProjectTagChange = (id, tagString) => {
    const tags = tagString.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    updateProjectLocal(id, "tags", tags);
  };

  const handleProjectImageUpload = async (e, projId) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, `project-images/${projId}_${file.name}`);
      if (url) {
        updateProjectLocal(projId, "image", url);
        alert("Image uploaded successfully!");
      }
    } catch (err) {
      alert("Failed to upload image.");
    }
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

  const saveProjectToDB = async (proj) => {
    await saveDocument("projects", proj.id, proj);
    alert("Project Saved successfully!");
  };


  if (loading) {
    return (
      <div className="admin-login-page page-transition d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <h2 className="admin-heading">VERIFYING CREDENTIALS...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-login-page page-transition">
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div className="admin-login-box">
            <h2 className="admin-heading mb-4">SYSTEM ADMIN TERMINAL</h2>
            <p className="text-muted mb-4 text-center">ACCESS RESTRICTED TO SYSTEM ADMINISTRATOR ONLY</p>
            <Button onClick={handleLogin} className="admin-btn mt-2 w-100 d-flex align-items-center justify-content-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0c2.158 0 3.92.737 5.358 2.138l-2.851 2.851C9.747 4.221 8.993 3.999 8 3.999c-1.934 0-3.583 1.309-4.169 3.08a4.99 4.99 0 0 0 0 3.839c.586 1.771 2.235 3.08 4.169 3.08 1.133 0 2.091-.3 2.768-.813.79-.597 1.305-1.464 1.458-2.583H8.001V6.558h7.544z"/>
              </svg>
              INITIALIZE GOOGLE CONNECTION
            </Button>
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
          <div className="d-flex align-items-center gap-3">
             <span className="text-muted" style={{fontSize: '0.8rem'}}>ADMIN: {user.email}</span>
             <button className="admin-btn-logout" onClick={handleLogout}>TERMINATE SESSION</button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs mb-4">
          <button className={`admin-tab ${activeTab === "blog" ? "active" : ""}`} onClick={() => setActiveTab("blog")}>BLOG MANAGEMENT</button>
          <button className={`admin-tab ${activeTab === "resume" ? "active" : ""}`} onClick={() => setActiveTab("resume")}>EXPERIENCE TIMELINE</button>
          <button className={`admin-tab ${activeTab === "projects" ? "active" : ""}`} onClick={() => setActiveTab("projects")}>PROJECTS</button>
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
                  <Row>
                    <Col md={12}>
                       <Form.Group className="mb-2">
                        <Form.Label>Tags (Comma separated, e.g. #AI, #WEB3)</Form.Label>
                        <Form.Control 
                          type="text" 
                          list="tag-history"
                          value={blogTagInputs[blog.id] || ""} 
                          onChange={(e) => handleBlogTagChange(blog.id, e.target.value)} 
                          className="admin-input" 
                          placeholder="#RESEARCH, #DESIGN, #AI"
                        />
                        <datalist id="tag-history">
                          {allExistingTags.map((tag, idx) => (
                            <option key={idx} value={tag} />
                          ))}
                        </datalist>
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

          {/* PROJECTS TAB */}
          {activeTab === "projects" && (
            <div>
              <div className="d-flex justify-content-between mb-4">
                <h3 className="admin-section-title">Project Showcase (Projects Collection)</h3>
                <button className="admin-btn" onClick={addProject}>+ NEW PROJECT</button>
              </div>
              
              {projects.map((proj) => (
                <div key={proj.id} className="admin-item-block mb-4">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Project Title</Form.Label>
                        <Form.Control type="text" value={proj.title} onChange={(e) => updateProjectLocal(proj.id, "title", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Category</Form.Label>
                        <Form.Select value={proj.category} onChange={(e) => updateProjectLocal(proj.id, "category", e.target.value)} className="admin-input">
                          <option value="Web Design">Web Design</option>
                          <option value="Full-Stack">Full-Stack</option>
                          <option value="AI/ML">AI/ML</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={proj.status} onChange={(e) => updateProjectLocal(proj.id, "status", e.target.value)} className="admin-input">
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                          <option value="Released">Released</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                       <Form.Group className="mb-2">
                        <Form.Label>Project Link</Form.Label>
                        <Form.Control type="text" value={proj.link} onChange={(e) => updateProjectLocal(proj.id, "link", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-2">
                    <Form.Label>Tags (Comma separated)</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={(proj.tags || []).join(', ')} 
                      onChange={(e) => handleProjectTagChange(proj.id, e.target.value)} 
                      className="admin-input" 
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} value={proj.description} onChange={(e) => updateProjectLocal(proj.id, "description", e.target.value)} className="admin-input" />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Project Image</Form.Label>
                    <div className="d-flex align-items-center gap-3">
                      <Form.Control type="file" accept="image/*" onChange={(e) => handleProjectImageUpload(e, proj.id)} className="admin-input flex-grow-1" />
                      {proj.image && proj.image.startsWith('http') && (
                        <div style={{width: "40px", height: "40px", overflow: 'hidden', borderRadius: '4px', border: '1px solid var(--neon-cyan)'}}>
                           <img src={proj.image} alt="preview" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                        </div>
                      )}
                    </div>
                  </Form.Group>
                  <div className="mt-3">
                    <button className="admin-btn me-2" onClick={() => saveProjectToDB(proj)}>SAVE TO FIRESTORE</button>
                    <button className="admin-btn-danger" onClick={() => handleDeleteProject(proj.id)}>DELETE PROJECT</button>
                  </div>
                </div>
              ))}
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
