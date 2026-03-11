import { createClient } from "@/utils/supabase/server";
import ProductForm from "../../ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <ProductForm initialData={product} isEditing={true} />
    </div>
  );
}
