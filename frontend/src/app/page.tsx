import { Hero } from "@/components/sections/landing";
import { ProductListing } from "@/components/sections/product-listing";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <section className="bg-clay/5 border-y border-sage">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-sage mb-12">Featured Objects / Top Picks</h2>
          <ProductListing featured={true} limit={4} />
        </div>
      </section>
    </div>
  );
}
