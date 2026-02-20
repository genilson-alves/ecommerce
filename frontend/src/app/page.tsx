import { Hero, FeaturedGrid } from "@/components/sections/landing";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedGrid />
    </div>
  );
}
