"use client";

// Admin du portfolio (client uniquement, chargé sans rendu serveur par AdminLoader).
// Données et session : API https://api.jack0237.com (src/lib/api.ts, `adminFetch`).
// - Connexion e-mail + mot de passe (POST /v1/auth/login) : l'API pose le cookie de session
//   `__Host-portfolio_session` (HttpOnly, SameSite=Strict) sur api.jack0237.com ; chaque requête
//   l'envoie grâce à `credentials: "include"`. Au chargement, GET /v1/auth/me dit si la session est active.
// - Écritures : PUT /v1/{collection}/{id} (création ou remplacement), DELETE /v1/{collection}/{id}.
//   Chaque écriture déclenche côté API la revalidation du site (/api/revalidate).
// - Images : POST /v1/media (FormData, champ `file`), l'URL renvoyée est stockée dans `image`.
// Le cookie étant SameSite=Strict, l'admin ne marche que depuis jack0237.com, www.jack0237.com et
// localhost:3000 (pas depuis une prévisualisation Vercel) : un message l'indique ailleurs.
// Bootstrap n'est chargé que sur cette page (formulaires react-bootstrap).
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useCallback } from "react";
import { Container, Form, Button, Row, Col, Table } from "react-bootstrap";
import MDEditor from "@uiw/react-md-editor";
import { adminFetch, ApiError, ADMIN_ORIGINS } from "../../lib/api";
import "./Admin.css";

const ADMIN_EMAIL = "jasonngueguim@gmail.com";

// Champs acceptés en écriture par l'API (corps strict : tout champ inconnu = 400).
// `publishedAt` des articles est volontairement omis : l'API le conserve à la mise à jour
// et le déduit de l'identifiant Date.now() à la création.
const FIELDS = {
  blogs: { title: "string", date: "string", readTime: "string", eyebrow: "string", tags: "tags", image: "string", lang: "string", content: "text" },
  projects: { title: "string", description: "text", image: "string", tags: "tags", category: "string", status: "string", link: "string", sortOrder: "int" },
  experiences: { title: "string", company: "string", date: "string", description: "text", sortOrder: "int" },
  skills: { label: "string", level: "int", sortOrder: "int" },
  certifications: { title: "string", issuer: "string", date: "string", status: "string", link: "string", sortOrder: "int" },
};

const LABELS = {
  blogs: "Article",
  projects: "Projet",
  experiences: "Expérience",
  skills: "Compétence",
  certifications: "Certification",
};

/** Corps d'écriture propre : seulement les champs connus, types attendus par l'API. */
function toPayload(collection, item) {
  const out = {};
  for (const [name, type] of Object.entries(FIELDS[collection])) {
    const v = item[name];
    if (type === "tags") out[name] = (Array.isArray(v) ? v : []).map((t) => String(t).trim()).filter(Boolean);
    else if (type === "int") out[name] = Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : 0;
    else if (type === "text") out[name] = typeof v === "string" ? v : "";
    else out[name] = typeof v === "string" ? v.trim() : v == null ? "" : String(v);
  }
  if (collection === "certifications" && !["completed", "ongoing"].includes(out.status)) out.status = "completed";
  return out;
}

const newId = () => Date.now().toString();

function Admin() {
  const [originOk, setOriginOk] = useState(true);
  const [status, setStatus] = useState("checking"); // checking | anon | authed
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState(null); // { type: "ok" | "error", text }
  const [activeTab, setActiveTab] = useState("blog");

  // Formulaire de connexion
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Données
  const [blogs, setBlogs] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [busy, setBusy] = useState(null); // clé "collection:id" de l'opération en cours

  // Saisie des tags d'article (chaîne libre, convertie en tableau à chaque frappe)
  const [blogTagInputs, setBlogTagInputs] = useState({});
  const [allExistingTags, setAllExistingTags] = useState([]);

  const setters = { blogs: setBlogs, projects: setProjects, experiences: setExperiences, skills: setSkills, certifications: setCertifications };

  const say = (type, text) => setNotice({ type, text });

  /** Erreur d'API commune : session expirée = retour à l'écran de connexion. */
  const handleError = useCallback((err, context) => {
    if (err instanceof ApiError && err.status === 401) {
      setUser(null);
      setStatus("anon");
      say("error", "Session expirée : reconnectez-vous.");
      return;
    }
    const msg = err instanceof ApiError ? err.message : String(err);
    say("error", `${context} : ${msg}`);
  }, []);

  const loadAdminData = useCallback(async () => {
    try {
      const [b, e, s, c, p] = await Promise.all([
        adminFetch("/v1/blogs?limit=500&withContent=true"),
        adminFetch("/v1/experiences?limit=500"),
        adminFetch("/v1/skills?limit=500"),
        adminFetch("/v1/certifications?limit=500"),
        adminFetch("/v1/projects?limit=500"),
      ]);
      const blogData = b.items || [];
      setBlogs(blogData);
      setExperiences(e.items || []);
      setSkills(s.items || []);
      setCertifications(c.items || []);
      setProjects(p.items || []);

      const tagMap = {};
      const tagsSet = new Set();
      blogData.forEach((blog) => {
        tagMap[blog.id] = (blog.tags || []).join(", ");
        (blog.tags || []).forEach((t) => tagsSet.add(t));
      });
      setBlogTagInputs(tagMap);
      setAllExistingTags(Array.from(tagsSet).sort());
    } catch (err) {
      handleError(err, "Chargement des données impossible");
    }
  }, [handleError]);

  useEffect(() => {
    if (!ADMIN_ORIGINS.includes(window.location.origin)) {
      setOriginOk(false);
      return undefined;
    }
    let alive = true;
    adminFetch("/v1/auth/me")
      .then((res) => {
        if (!alive) return;
        setUser(res.user);
        setStatus("authed");
        loadAdminData();
      })
      .catch((err) => {
        if (!alive) return;
        setStatus("anon");
        if (!(err instanceof ApiError && err.status === 401)) say("error", err.message);
      });
    return () => {
      alive = false;
    };
  }, [loadAdminData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotice(null);
    try {
      const res = await adminFetch("/v1/auth/login", { method: "POST", body: { email: email.trim(), password } });
      setPassword("");
      setUser(res.user);
      setStatus("authed");
      loadAdminData();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) say("error", "Identifiants invalides.");
      else if (err instanceof ApiError && err.status === 429) say("error", "Trop de tentatives. Réessayez dans quelques minutes.");
      else say("error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminFetch("/v1/auth/logout", { method: "POST" });
    } catch {
      // Session déjà invalide ou API injoignable : on quitte l'interface quand même.
    }
    setUser(null);
    setStatus("anon");
    setNotice(null);
  };

  // ------------------------------------------------------------------ écritures génériques

  const saveItem = async (collection, item) => {
    setBusy(`${collection}:${item.id}`);
    try {
      const res = await adminFetch(`/v1/${collection}/${encodeURIComponent(item.id)}`, {
        method: "PUT",
        body: toPayload(collection, item),
      });
      // L'API renvoie l'élément normalisé (createdAt, updatedAt, publishedAt...).
      setters[collection]((list) => list.map((x) => (x.id === item.id ? res.item : x)));
      say("ok", `${LABELS[collection]} : enregistrement effectué.`);
    } catch (err) {
      handleError(err, `${LABELS[collection]} non enregistré`);
    } finally {
      setBusy(null);
    }
  };

  const deleteItem = async (collection, id) => {
    if (!window.confirm(`Supprimer définitivement cet élément (${LABELS[collection]}) ?`)) return;
    setBusy(`${collection}:${id}`);
    try {
      await adminFetch(`/v1/${collection}/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (err) {
      // 404 : élément jamais enregistré (créé seulement dans l'interface), on le retire quand même.
      if (!(err instanceof ApiError && err.status === 404)) {
        handleError(err, "Suppression impossible");
        setBusy(null);
        return;
      }
    }
    setters[collection]((list) => list.filter((x) => x.id !== id));
    say("ok", `${LABELS[collection]} : suppression effectuée.`);
    setBusy(null);
  };

  const updateLocal = (collection, id, field, value) => {
    setters[collection]((list) => list.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const uploadImage = async (e, collection, id) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setBusy(`${collection}:${id}`);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await adminFetch("/v1/media", { method: "POST", body: form });
      updateLocal(collection, id, "image", res.url);
      say("ok", "Image envoyée. Pensez à enregistrer l'élément (SAVE).");
    } catch (err) {
      handleError(err, "Envoi de l'image impossible");
    } finally {
      setBusy(null);
    }
  };

  // ------------------------------------------------------------------ ajouts (locaux jusqu'à SAVE)

  const addBlog = () => {
    const id = newId();
    setBlogs([{ id, title: "NEW ENTRY", date: "", readTime: "", eyebrow: "", image: "", lang: "fr", content: "", tags: [] }, ...blogs]);
    setBlogTagInputs((prev) => ({ ...prev, [id]: "" }));
  };
  const addExperience = () =>
    setExperiences([{ id: newId(), title: "New Role", company: "", date: "", description: "", sortOrder: 0 }, ...experiences]);
  const addSkill = () => setSkills([...skills, { id: newId(), label: "New Skill", level: 1, sortOrder: skills.length }]);
  const addCert = () =>
    setCertifications([{ id: newId(), title: "New Certificate", issuer: "", date: "", status: "completed", link: "", sortOrder: 0 }, ...certifications]);
  const addProject = () =>
    setProjects([{ id: newId(), title: "New Project", description: "", image: "", tags: [], category: "Web Design", status: "In Progress", link: "", sortOrder: 0 }, ...projects]);

  const handleBlogTagChange = (id, value) => {
    const upperValue = value.toUpperCase();
    setBlogTagInputs((prev) => ({ ...prev, [id]: upperValue }));
    const tagsArray = upperValue
      .split(",")
      .map((tag) => {
        const t = tag.trim();
        return t && !t.startsWith("#") ? `#${t}` : t;
      })
      .filter((t) => t !== "");
    updateLocal("blogs", id, "tags", tagsArray);
    const tagsSet = new Set(allExistingTags);
    tagsArray.forEach((t) => tagsSet.add(t));
    setAllExistingTags(Array.from(tagsSet).sort());
  };

  const handleProjectTagChange = (id, tagString) => {
    updateLocal("projects", id, "tags", tagString.split(",").map((t) => t.trim()).filter((t) => t !== ""));
  };

  const isBusy = (collection, id) => busy === `${collection}:${id}`;

  const imagePreview = (image) =>
    image && /^https?:\/\//.test(image) ? (
      <div style={{ width: "40px", height: "40px", overflow: "hidden", borderRadius: "4px", border: "1px solid var(--neon-cyan)", flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    ) : null;

  const noticeBox = notice && (
    <div role={notice.type === "error" ? "alert" : "status"} className={`admin-notice ${notice.type === "error" ? "is-error" : "is-ok"}`}>
      {notice.text}
    </div>
  );

  // ------------------------------------------------------------------ écrans

  if (!originOk) {
    return (
      <div className="admin-login-page page-transition">
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div className="admin-login-box">
            <h2 className="admin-heading mb-4">ADMIN INDISPONIBLE ICI</h2>
            <p className="mb-4 text-center admin-help">
              L&apos;administration ne fonctionne que sur jack0237.com : la session de l&apos;API
              n&apos;est pas transmise depuis une prévisualisation ou un autre domaine.
            </p>
            <a className="admin-btn w-100 d-block text-center" href="https://jack0237.com/admin">
              OUVRIR JACK0237.COM/ADMIN
            </a>
          </div>
        </Container>
      </div>
    );
  }

  if (status === "checking") {
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
          <form className="admin-login-box" onSubmit={handleLogin}>
            <h2 className="admin-heading mb-4">SYSTEM ADMIN TERMINAL</h2>
            <p className="text-muted mb-4 text-center">ACCESS RESTRICTED TO SYSTEM ADMINISTRATOR ONLY</p>
            {noticeBox}
            <Form.Group className="mb-3" controlId="admin-email">
              <Form.Label>E-mail</Form.Label>
              <Form.Control type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="admin-input" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="admin-password">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                autoComplete="current-password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
              />
            </Form.Group>
            <Button type="submit" disabled={submitting} className="admin-btn mt-2 w-100">
              {submitting ? "CONNEXION..." : "SE CONNECTER"}
            </Button>
          </form>
        </Container>
      </div>
    );
  }

  return (
    <div className="admin-page page-transition">
      <Container style={{ paddingTop: "120px", paddingBottom: "100px" }}>
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <h1 className="admin-main-title">COMMAND <span className="accent-text">CENTER</span></h1>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted" style={{ fontSize: "0.8rem" }}>ADMIN: {user.email}</span>
            <button className="admin-btn-logout" onClick={handleLogout}>TERMINATE SESSION</button>
          </div>
        </div>

        {noticeBox}

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
                <h3 className="admin-section-title">Blog Entries ({blogs.length})</h3>
                <button className="admin-btn" onClick={addBlog}>+ NEW ENTRY</button>
              </div>
              {blogs.length === 0 && <p className="text-muted">Aucun article.</p>}

              {blogs.map((blog) => (
                <div key={blog.id} className="admin-item-block mb-4">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={blog.title || ""} onChange={(e) => updateLocal("blogs", blog.id, "title", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="text" value={blog.date || ""} onChange={(e) => updateLocal("blogs", blog.id, "date", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>Category/Eyebrow</Form.Label>
                        <Form.Control type="text" value={blog.eyebrow || ""} onChange={(e) => updateLocal("blogs", blog.id, "eyebrow", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-2">
                        <Form.Label>Tags (Comma separated, e.g. #AI, #WEB3)</Form.Label>
                        <Form.Control
                          type="text"
                          list="tag-history"
                          value={blogTagInputs[blog.id] ?? (blog.tags || []).join(", ")}
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
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Read time</Form.Label>
                        <Form.Control type="text" value={blog.readTime ?? ""} onChange={(e) => updateLocal("blogs", blog.id, "readTime", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Lang (fr, en)</Form.Label>
                        <Form.Control type="text" value={blog.lang || ""} onChange={(e) => updateLocal("blogs", blog.id, "lang", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-2">
                    <Form.Label>Cover Image (upload, URL or legacy key blogImg1/2/3)</Form.Label>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <Form.Control type="text" aria-label="Image URL" value={blog.image || ""} onChange={(e) => updateLocal("blogs", blog.id, "image", e.target.value)} className="admin-input flex-grow-1" style={{ minWidth: "220px", width: "auto" }} />
                      <Form.Control type="file" aria-label="Upload image" accept="image/jpeg,image/png,image/gif,image/webp,image/avif" disabled={isBusy("blogs", blog.id)} onChange={(e) => uploadImage(e, "blogs", blog.id)} className="admin-input" style={{ maxWidth: "320px" }} />
                      {imagePreview(blog.image)}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Detailed Content (Markdown Supported)</Form.Label>
                    <div data-color-mode="dark">
                      <MDEditor
                        value={blog.content || ""}
                        onChange={(val) => updateLocal("blogs", blog.id, "content", val || "")}
                        preview="edit"
                        height={300}
                        style={{ backgroundColor: "var(--midnight-charcoal)", border: "1px solid var(--neon-cyan)" }}
                      />
                    </div>
                  </Form.Group>
                  <div className="mt-3 d-flex align-items-center flex-wrap gap-2">
                    <button className="admin-btn" disabled={isBusy("blogs", blog.id)} onClick={() => saveItem("blogs", blog)}>SAVE</button>
                    <button className="admin-btn-danger" disabled={isBusy("blogs", blog.id)} onClick={() => deleteItem("blogs", blog.id)}>DELETE ENTRY</button>
                    <a className="ms-2" style={{ fontSize: "0.8rem" }} href={`/blog/${encodeURIComponent(blog.id)}`} target="_blank" rel="noreferrer">
                      /blog/{blog.id}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EXPERIENCE TIMELINE TAB */}
          {activeTab === "resume" && (
            <div>
              <div className="d-flex justify-content-between mb-4">
                <h3 className="admin-section-title">Experience Cards ({experiences.length})</h3>
                <button className="admin-btn" onClick={addExperience}>+ NEW ROLE</button>
              </div>
              {experiences.length === 0 && <p className="text-muted">Aucune expérience.</p>}

              {experiences.map((exp) => (
                <div key={exp.id} className="admin-item-block mb-4">
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Role Title</Form.Label>
                        <Form.Control type="text" value={exp.title || ""} onChange={(e) => updateLocal("experiences", exp.id, "title", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>Company</Form.Label>
                        <Form.Control type="text" value={exp.company || ""} onChange={(e) => updateLocal("experiences", exp.id, "company", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>Date Range</Form.Label>
                        <Form.Control type="text" value={exp.date || ""} onChange={(e) => updateLocal("experiences", exp.id, "date", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Order</Form.Label>
                        <Form.Control type="number" value={exp.sortOrder ?? 0} onChange={(e) => updateLocal("experiences", exp.id, "sortOrder", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-2">
                    <Form.Label>Description Content</Form.Label>
                    <Form.Control as="textarea" rows={4} value={exp.description || ""} onChange={(e) => updateLocal("experiences", exp.id, "description", e.target.value)} className="admin-input" />
                  </Form.Group>
                  <div className="mt-3">
                    <button className="admin-btn me-2" disabled={isBusy("experiences", exp.id)} onClick={() => saveItem("experiences", exp)}>SAVE</button>
                    <button className="admin-btn-danger" disabled={isBusy("experiences", exp.id)} onClick={() => deleteItem("experiences", exp.id)}>DELETE ROLE</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SKILL MATRIX TAB */}
          {activeTab === "skills" && (
            <div>
              <div className="d-flex justify-content-between mb-4">
                <h3 className="admin-section-title">Technical Proficiency ({skills.length})</h3>
                <button className="admin-btn" onClick={addSkill}>+ NEW SKILL</button>
              </div>
              {skills.length === 0 && <p className="text-muted">Aucune compétence.</p>}

              {skills.length > 0 && (
                <Table variant="dark" className="admin-table">
                  <thead>
                    <tr>
                      <th>Skill Label</th>
                      <th width="130">Level (0-6)</th>
                      <th width="110">Order</th>
                      <th width="200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill) => (
                      <tr key={skill.id}>
                        <td>
                          <Form.Control type="text" aria-label="Skill label" value={skill.label || ""} onChange={(e) => updateLocal("skills", skill.id, "label", e.target.value)} className="admin-input" />
                        </td>
                        <td>
                          <Form.Control type="number" aria-label="Level" min="0" max="6" value={skill.level ?? 0} onChange={(e) => updateLocal("skills", skill.id, "level", e.target.value)} className="admin-input" />
                        </td>
                        <td>
                          <Form.Control type="number" aria-label="Order" value={skill.sortOrder ?? 0} onChange={(e) => updateLocal("skills", skill.id, "sortOrder", e.target.value)} className="admin-input" />
                        </td>
                        <td className="d-flex gap-2">
                          <button className="admin-btn py-1 px-2" style={{ fontSize: "0.8rem" }} disabled={isBusy("skills", skill.id)} onClick={() => saveItem("skills", skill)}>SAVE</button>
                          <button className="admin-btn-danger py-1 px-2" disabled={isBusy("skills", skill.id)} onClick={() => deleteItem("skills", skill.id)}>DEL</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === "projects" && (
            <div>
              <div className="d-flex justify-content-between mb-4">
                <h3 className="admin-section-title">Project Showcase ({projects.length})</h3>
                <button className="admin-btn" onClick={addProject}>+ NEW PROJECT</button>
              </div>
              {projects.length === 0 && <p className="text-muted">Aucun projet.</p>}

              {projects.map((proj) => (
                <div key={proj.id} className="admin-item-block mb-4">
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Project Title</Form.Label>
                        <Form.Control type="text" value={proj.title || ""} onChange={(e) => updateLocal("projects", proj.id, "title", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Category</Form.Label>
                        <Form.Select value={proj.category || "Web Design"} onChange={(e) => updateLocal("projects", proj.id, "category", e.target.value)} className="admin-input">
                          <option value="Web Design">Web Design</option>
                          <option value="Full-Stack">Full-Stack</option>
                          <option value="AI/ML">AI/ML</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={proj.status || "In Progress"} onChange={(e) => updateLocal("projects", proj.id, "status", e.target.value)} className="admin-input">
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                          <option value="Released">Released</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>Project Link (https://...)</Form.Label>
                        <Form.Control type="url" value={proj.link || ""} onChange={(e) => updateLocal("projects", proj.id, "link", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={1}>
                      <Form.Group className="mb-2">
                        <Form.Label>Order</Form.Label>
                        <Form.Control type="number" value={proj.sortOrder ?? 0} onChange={(e) => updateLocal("projects", proj.id, "sortOrder", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-2">
                    <Form.Label>Tags (Comma separated)</Form.Label>
                    <Form.Control type="text" value={(proj.tags || []).join(", ")} onChange={(e) => handleProjectTagChange(proj.id, e.target.value)} className="admin-input" />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} value={proj.description || ""} onChange={(e) => updateLocal("projects", proj.id, "description", e.target.value)} className="admin-input" />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Project Image (upload or URL)</Form.Label>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <Form.Control type="text" aria-label="Image URL" value={proj.image || ""} onChange={(e) => updateLocal("projects", proj.id, "image", e.target.value)} className="admin-input flex-grow-1" style={{ minWidth: "220px", width: "auto" }} />
                      <Form.Control type="file" aria-label="Upload image" accept="image/jpeg,image/png,image/gif,image/webp,image/avif" disabled={isBusy("projects", proj.id)} onChange={(e) => uploadImage(e, "projects", proj.id)} className="admin-input" style={{ maxWidth: "320px" }} />
                      {imagePreview(proj.image)}
                    </div>
                  </Form.Group>
                  <div className="mt-3">
                    <button className="admin-btn me-2" disabled={isBusy("projects", proj.id)} onClick={() => saveItem("projects", proj)}>SAVE</button>
                    <button className="admin-btn-danger" disabled={isBusy("projects", proj.id)} onClick={() => deleteItem("projects", proj.id)}>DELETE PROJECT</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CERTIFICATIONS TAB */}
          {activeTab === "certs" && (
            <div>
              <div className="d-flex justify-content-between mb-4">
                <h3 className="admin-section-title">Certifications ({certifications.length})</h3>
                <button className="admin-btn" onClick={addCert}>+ NEW CERT</button>
              </div>
              {certifications.length === 0 && <p className="text-muted">Aucune certification.</p>}

              {certifications.map((cert) => (
                <div key={cert.id} className="admin-item-block mb-4">
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>Certificate</Form.Label>
                        <Form.Control type="text" value={cert.title || ""} onChange={(e) => updateLocal("certifications", cert.id, "title", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Issuer</Form.Label>
                        <Form.Control type="text" value={cert.issuer || ""} onChange={(e) => updateLocal("certifications", cert.id, "issuer", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Date/Year</Form.Label>
                        <Form.Control type="text" value={cert.date || ""} onChange={(e) => updateLocal("certifications", cert.id, "date", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={cert.status || "completed"} onChange={(e) => updateLocal("certifications", cert.id, "status", e.target.value)} className="admin-input">
                          <option value="completed">Completed</option>
                          <option value="ongoing">Ongoing</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>Verify URL (Opt)</Form.Label>
                        <Form.Control type="url" value={cert.link || ""} onChange={(e) => updateLocal("certifications", cert.id, "link", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                    <Col md={1}>
                      <Form.Group className="mb-2">
                        <Form.Label>Order</Form.Label>
                        <Form.Control type="number" value={cert.sortOrder ?? 0} onChange={(e) => updateLocal("certifications", cert.id, "sortOrder", e.target.value)} className="admin-input" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <button className="admin-btn me-2" disabled={isBusy("certifications", cert.id)} onClick={() => saveItem("certifications", cert)}>SAVE</button>
                    <button className="admin-btn-danger" disabled={isBusy("certifications", cert.id)} onClick={() => deleteItem("certifications", cert.id)}>DELETE CERT</button>
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
