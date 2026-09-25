import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import blogImg1 from "../../Assets/blog-img-1.jpg";
import "./BlogPost.css";

// Porté tel quel depuis l'ancien site (refonte à venir). Composant serveur : l'article est lu
// dans Firestore par la page app/(fr)/blog/[id] (404 réelle si l'identifiant n'existe pas).
function BlogPost({ post }) {
  return (
    <article className="blog-post-page" lang={post.lang || "en"}>
      {/* Hero Section */}
      <section className="post-hero">
        <div 
          className="post-hero-bg" 
          style={{ backgroundImage: `url(${JSON.stringify(post.image && post.image.startsWith("http") ? post.image : blogImg1.src)})` }}
        ></div>
        <div className="post-hero-overlay"></div>
        <div className="legacy-container post-hero-content">
          <a href="/blog" className="post-back-link">
            <span className="material-symbols-outlined">west</span>
            Back to Logs
          </a>
          <div className="post-header-meta">
            <span><span className="primary-text">PUBLISHED:</span> {post.date}</span>
            {post.readTime && <span><span className="primary-text">READ TIME:</span> {post.readTime}</span>}
            {post.eyebrow && <span><span className="primary-text">TAG:</span> {post.eyebrow}</span>}
          </div>
          <h1 className="post-header-title">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <div className="legacy-container post-article-wrapper">
        <div className="post-article-glass">
          <div className="post-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content || ""}
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
      </div>
    </article>
  );
}

export default BlogPost;
