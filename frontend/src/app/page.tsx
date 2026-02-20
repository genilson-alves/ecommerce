import { Hero } from "@/components/sections/landing";
import { ProductListing } from "@/components/sections/product-listing";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ProductListing />
    </div>
  );
}
