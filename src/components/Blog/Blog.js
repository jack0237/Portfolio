import blogImg1 from "../../Assets/blog-img-1.jpg";
import blogImg2 from "../../Assets/blog-img-2.jpg";
import blogImg3 from "../../Assets/blog-img-3.jpg";
import "./Blog.css";

// Porté tel quel depuis l'ancien site (refonte à venir). Composant serveur : les articles
// sont lus dans Firestore par la page (src/lib/firestore.ts), plus de SDK côté client.
const imgMap = {
  blogImg1: blogImg1.src,
  blogImg2: blogImg2.src,
  blogImg3: blogImg3.src
};

const Link = ({ to, ...rest }) => <a href={`/blog/${encodeURIComponent(to)}`} {...rest} />;
const imgSrc = (image) => (image && image.startsWith("http") ? image : imgMap[image]);
const excerpt = (post, n) => {
  const c = post.content || "";
  return c.length > n ? c.substring(0, n) + "..." : c;
};

/** @param {{ posts?: import("../../lib/firestore").BlogPost[], emptyLabel?: string }} props */
function Blog({ posts = [], emptyLabel = "" }) {
  const blogs = posts;

  const renderCard = (post, i) => {
    const cardType = i % 6; // To mimic the 6 variations in their HTML

    if (cardType === 0) {
      // Featured Card (Large)
      return (
        <article key={post.id} className="post-card glass-card group">
          <Link to={`${post.id}`} style={{ textDecoration: 'none' }}>
            <div className="post-card-img-wrap aspect-4-5">
              {post.image && (
                <img src={imgSrc(post.image)} alt={post.title} className="post-card-img featured-img" />
              )}
              <div className="post-card-gradient-overlay"></div>
              <div className="post-card-tag-wrapper">
                <span className="post-card-tag">{post.eyebrow || "Research"}</span>
              </div>
            </div>
            <div className="post-card-content flex-col gap-4">
              <div className="post-meta-line space-between">
                <span>{post.date}</span>
                <span>{post.readTime || "08 MIN READ"}</span>
              </div>
              <h3 className="post-title featured-title">{post.title}</h3>
              <p className="post-excerpt">{excerpt(post, 120)}</p>
              <div className="post-cta featured-cta">
                Access Log 
                <span className="material-symbols-outlined cta-icon">arrow_forward</span>
              </div>
            </div>
          </Link>
        </article>
      );
    } else if (cardType === 1) {
      // Standard Text Card
      return (
        <article key={post.id} className="post-card glass-card group">
          <Link to={`${post.id}`} style={{ textDecoration: 'none' }}>
            <div className="post-card-content border-b-content">
              <div className="status-row mb-4">
                <span className="status-dot"></span>
                <span className="status-text">{post.eyebrow || "System Status"}</span>
              </div>
              <h3 className="post-title standard-title mb-4">{post.title}</h3>
              <div className="post-meta-line">{post.date}</div>
            </div>
            <div className="post-card-content">
              <p className="post-excerpt mb-6">{excerpt(post, 120)}</p>
              <div className="tags-row">
                {(post.tags || ["#RESEARCH", "#DEVLOG"]).map((tag, idx) => (
                  <span key={idx} className="style-tag">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        </article>
      );
    } else if (cardType === 2) {
      // Image Card (Aspect Video)
      return (
        <article key={post.id} className="post-card glass-card group">
          <Link to={`${post.id}`} style={{ textDecoration: 'none' }}>
            <div className="post-card-img-wrap aspect-video">
              {post.image && (
                <img src={imgSrc(post.image)} alt={post.title} className="post-card-img hover-scale-105" />
              )}
            </div>
            <div className="post-card-content flex-col gap-4">
              <div className="post-meta-line"><span>{post.date}</span></div>
              <h3 className="post-title standard-title">{post.title}</h3>
              <p className="post-excerpt">{excerpt(post, 80)}</p>
            </div>
          </Link>
        </article>
      );
    } else if (cardType === 3) {
      // Quote/Typography Card
      return (
        <article key={post.id} className="post-card quote-card group">
          <Link to={`${post.id}`} style={{ textDecoration: 'none' }}>
            <span className="material-symbols-outlined quote-icon" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
            <p className="quote-text">"{excerpt(post, 100)}"</p>
            <div className="quote-divider"></div>
            <span className="quote-author">Fragment {post.id.substring(0,5).toUpperCase()}</span>
          </Link>
        </article>
      );
    } else if (cardType === 4) {
      // Image Card (Aspect Square + Grayscale Hover)
      return (
        <article key={post.id} className="post-card glass-card group">
          <Link to={`${post.id}`} style={{ textDecoration: 'none' }}>
            <div className="post-card-img-wrap aspect-square">
              {post.image && (
                <img src={imgSrc(post.image)} alt={post.title} className="post-card-img grayscale-hover" />
              )}
            </div>
            <div className="post-card-content flex-col gap-4">
              <div className="post-meta-line">{post.date}</div>
              <h3 className="post-title standard-title">{post.title}</h3>
              <p className="post-excerpt">{excerpt(post, 80)}</p>
              <div className="read-discussion-link mt-2">Read Discussion</div>
            </div>
          </Link>
        </article>
      );
    } else {
      // Simple List Card
      return (
        <article key={post.id} className="post-card glass-card p-8 group">
          <Link to={`${post.id}`} style={{ textDecoration: 'none' }}>
            <h3 className="list-card-title mb-8">System Archives</h3>
            <div className="space-y-6">
              <div className="list-item-block">
                <span className="list-item-text">{post.title}</span>
                <span className="list-item-date">{(post.date || "").substring((post.date || "").length - 4)}</span>
              </div>
            </div>
          </Link>
        </article>
      );
    }
  };

  return (
    <div className="blog-page">
      <div className="legacy-container" style={{ maxWidth: "1200px" }}>
        {/* Hero Header */}
        <header className="blog-header">
          <h1 className="blog-title-bg">LOGS</h1>
          <div className="blog-header-content">
            <span className="blog-eyebrow">System Intel / Journal</span>
            <h2 className="blog-title">
              ENCRYPTED <br />
              <span className="accent-text">THOUGHTS</span>
            </h2>
            <p className="blog-subtitle">
              Exploring the intersection of human creativity and machine intelligence. 
              Archives of a digital wanderer.
            </p>
          </div>
        </header>

        {/* Masonry Grid Area */}
        <div className="blog-masonry-container">
          {blogs.map((post, i) => renderCard(post, i))}
        </div>
        {blogs.length === 0 && <p className="legacy-empty">{emptyLabel}</p>}

      </div>
    </div>
  );
}

export default Blog;
