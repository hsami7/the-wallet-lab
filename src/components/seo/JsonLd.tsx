export default function JsonLd() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "The Embroidery's Lab",
    "url": "https://theembroideryslab.com",
    "logo": "https://theembroideryslab.com/logo.png",
    "sameAs": [
      "https://instagram.com/theembroideryslab",
      "https://tiktok.com/@theembroideryslab",
    ],
    "description": "The Embroidery's Lab: Premium wallets, denims, jeans, and jackets with unique, precision-engineered art.",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "The Embroidery's Lab",
    "url": "https://theembroideryslab.com",
    "publisher": {
      "@type": "Organization",
      "name": "The Embroidery's Lab",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </>
  );
}
