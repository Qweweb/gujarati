/**
 * Native On-Page SEO Manager for Gujarati App
 * Automatically injects Meta Title, Description, OpenGraph (WhatsApp/Facebook),
 * Twitter Cards, Canonical Links, Image Search SEO, and Google JSON-LD Article Rich Snippets Schema.
 */
export const updatePageSEO = ({
  title,
  description,
  image,
  keywords,
  slug,
  author,
  createdAt,
  updatedAt
}) => {
  const pageTitle = title ? `${title} | ગુજરાતી એપ સાહિત્ય` : 'ગુજરાતી એપ - પંચાંગ, ગીતા, વાસ્તુ અને સાહિત્ય';
  const pageDesc = description || 'ગુજરાતી એપ પર વાંચી શકો છો પવિત્ર શ્રાવણ માસ પૂજા વિધિ, વાસ્તુ દોષ નિવારણ ઉપાયો, આયુર્વેદ ટિપ્સ અને સુવિચાર.';
  const pageImage = image || 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1000&auto=format&fit=crop';
  const pageUrl = slug ? `${window.location.origin}/#/blog/${slug}` : window.location.href;

  // 1. Set Document Title
  document.title = pageTitle;

  // Helper to set or create meta tag
  const setMetaTag = (attrName, attrValue, content) => {
    if (!content) return;
    let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 2. Standard Meta Tags
  setMetaTag('name', 'description', pageDesc);
  setMetaTag('name', 'keywords', keywords || 'ગુજરાતી વાસ્તુ, શ્રાવણ માસ, ભક્તિ, પંચાંગ, આયુર્વેદ, સુવિચાર');
  setMetaTag('name', 'author', author || 'ગુજરાતી ટીમ');

  // 3. OpenGraph Meta Tags (WhatsApp, Facebook & Social Preview Cards)
  setMetaTag('property', 'og:title', pageTitle);
  setMetaTag('property', 'og:description', pageDesc);
  setMetaTag('property', 'og:image', pageImage);
  setMetaTag('property', 'og:image:secure_url', pageImage);
  setMetaTag('property', 'og:image:alt', title || 'ગુજરાતી આર્ટિકલ ફોટો');
  setMetaTag('property', 'og:url', pageUrl);
  setMetaTag('property', 'og:type', 'article');
  setMetaTag('property', 'og:site_name', 'ગુજરાતી એપ સાહિત્ય');

  // 4. Twitter Card Meta Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', pageTitle);
  setMetaTag('name', 'twitter:description', pageDesc);
  setMetaTag('name', 'twitter:image', pageImage);

  // 5. Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', pageUrl);

  // 6. Google Structured Data (JSON-LD Rich Snippet & Google Image Search Schema)
  let schemaScript = document.getElementById('json-ld-article-schema');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'json-ld-article-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title || pageTitle,
    "description": pageDesc,
    "image": {
      "@type": "ImageObject",
      "url": pageImage,
      "caption": title || "ગુજરાતી સાહિત્ય ફોટો",
      "author": author || "ગુજરાતી ટીમ"
    },
    "author": {
      "@type": "Organization",
      "name": author || "ગુજરાતી ટીમ"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ગુજરાતી એપ",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.jpg`
      }
    },
    "datePublished": createdAt || new Date().toISOString(),
    "dateModified": updatedAt || createdAt || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    }
  };

  schemaScript.text = JSON.stringify(jsonLdData);
};

/**
 * Instant Google Search Engine Crawler Ping Helper
 */
export const pingGoogleSearchConsole = async (sitemapUrl) => {
  const targetUrl = sitemapUrl || `${window.location.origin}/sitemap.xml`;
  try {
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(targetUrl)}`;
    await fetch(pingUrl, { mode: 'no-cors' });
    return true;
  } catch (e) {
    console.warn("Google Ping triggered:", e);
    return false;
  }
};
