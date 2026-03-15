import { getCollections } from "@/app/actions/homepage";
import React from "react";
import { CollectionsManager } from "./CollectionsManager";

export default async function AdminCollectionsPage() {
  const collections = await getCollections();
  
  // Fallback initial data in case the user hasn't run the SQL yet
  const defaultCollections = [
    { slot_index: 0, label: 'Everyday Essentials', heading: 'Classic style', image_url: '/collections/classic.png', button_text: 'Shop Now', button_link: '/shop' },
    { slot_index: 1, label: 'Winter Collection', heading: 'Cozy looks for any season', image_url: '/collections/winter.png', button_text: 'Discover more', button_link: '/shop' },
    { slot_index: 2, label: 'Premium Accessories', heading: 'Timeless accessory', image_url: '/collections/accessories.png', button_text: 'Shop Now', button_link: '/shop' },
  ];

  const displayCollections = Array.from({ length: 3 }).map((_, idx) => {
    const col = collections.find(c => c.slot_index === idx);
    return col || { ...defaultCollections[idx], slot_index: idx };
  });

  return (
    <div className="p-8">
      <CollectionsManager initialCollections={displayCollections} />
    </div>
  );
}
