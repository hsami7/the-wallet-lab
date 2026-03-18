interface JsonLdProps {
  product?: {
    name: string;
    description: string;
    image: string;
    price: number;
    sku?: string;
    slug: string;
    inStock: boolean;
  };
}

export default function JsonLd({ product }: JsonLdProps = {}) {
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

  const productJsonLd = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "sku": product.sku || product.slug,
    "brand": {
      "@type": "Brand",
      "name": "The Embroidery's Lab"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://theembroideryslab.com/product/${product.slug}`,
      "priceCurrency": "MAD",
      "price": product.price,
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  } : null;

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
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
    </>
  );
}
