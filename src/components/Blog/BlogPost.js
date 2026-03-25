import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchDocument } from "../../utils/storage";
import blogImg1 from "../../Assets/blog-img-1.jpg";
import "./BlogPost.css";

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scroll to top when loading the article
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const getPost = async () => {
      const data = await fetchDocument("blogs", id);
      setPost(data);
      setLoading(false);
    };
    getPost();
  }, [id]);

  if (loading) {
    return <div style={{padding: "200px 0", textAlign: "center", color: "var(--primary-text)"}}>LOADING ARCHIVE...</div>;
  }

  if (!post) {
    return <div style={{padding: "200px 0", textAlign: "center", color: "var(--neon-cyan)"}}>SYSTEM ERROR: LOG NOT FOUND</div>;
  }

  return (
    <div className="blog-post-page">
      {/* Hero Section */}
      <section className="post-hero">
        <div 
          className="post-hero-bg" 
          style={{ backgroundImage: `url(${post.image && post.image.startsWith("http") ? post.image : blogImg1})` }}
        ></div>
        <div className="post-hero-overlay"></div>
        <Container className="post-hero-content">
          <Link to=".." relative="path" className="post-back-link">
            <span className="material-symbols-outlined">west</span>
            Back to Logs
          </Link>
          <div className="post-header-meta">
            <span><span className="primary-text">PUBLISHED:</span> {post.date}</span>
            {post.readTime && <span><span className="primary-text">READ TIME:</span> {post.readTime}</span>}
            {post.eyebrow && <span><span className="primary-text">TAG:</span> {post.eyebrow}</span>}
          </div>
          <h1 className="post-header-title">
            {post.title}
          </h1>
        </Container>
      </section>

      {/* Article Content */}
      <Container className="post-article-wrapper">
        <div className="post-article-glass">
          <div className="post-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="post-footer-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag-pill">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default BlogPost;
