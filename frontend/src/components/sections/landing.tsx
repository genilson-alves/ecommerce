import React from "react";
import { PrimaryButton } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative pt-40 pb-20 border-b border-sage px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-12">
        <div className="max-w-4xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 block text-sage">Collection 2026</span>
          <h1 className="text-7xl md:text-[140px] font-black tracking-[-0.05em] leading-[0.8] mb-12">
            DESIGNED <br />
            FOR THE <br />
            <span className="text-sage italic">ESSENTIALS</span>
          </h1>
          <p className="text-lg max-w-xl font-medium text-clay leading-relaxed mb-10">
            A curation of premium goods focused on timeless design and sustainable production. 
            Built for those who value quality over quantity.
          </p>
          <div className="flex gap-4">
            <PrimaryButton>SHOP THE DROPS</PrimaryButton>
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-sage transition-colors">
              Our Ethos <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturedGrid = () => {
  return (
    <section className="max-w-7xl mx-auto py-20 px-6">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-2xl font-bold tracking-tighter uppercase">Curated Objects</h2>
        <span className="text-[10px] font-bold text-sage">NEW ARRIVALS (04)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-px bg-sage border border-sage">
        <div className="md:col-span-8 md:row-span-2 bg-bone p-10 flex flex-col justify-between h-[600px] group cursor-pointer transition-colors hover:bg-[#F2F5E9]">
          <div className="flex justify-between items-start">
            <span className="bg-sulfur px-3 py-1 rounded-full text-[10px] font-bold text-deep-olive">FEATURED</span>
            <div className="bg-deep-olive text-bone p-2 transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-5xl font-black tracking-tighter mb-4">THE MONOLITH CHAIR</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-sage underline underline-offset-4">View Collection</p>
          </div>
        </div>

        <div className="md:col-span-4 bg-bone p-8 flex flex-col justify-between h-[300px] group cursor-pointer transition-colors hover:bg-[#F2F5E9]">
          <div className="flex justify-between items-start text-xs font-bold text-sage italic tracking-widest uppercase">
             <span>Sculptural Object</span>
             <span>$450.00</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tighter">ANALOG WATCH PRO</h3>
        </div>

        <div className="md:col-span-4 bg-bone p-8 flex flex-col justify-between h-[300px] group cursor-pointer transition-colors hover:bg-[#F2F5E9]">
          <div className="flex justify-between items-start text-xs font-bold text-sage italic tracking-widest uppercase">
             <span>Hand-poured candle</span>
             <span>$65.00</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tighter">SANTAL & OAK</h3>
        </div>
      </div>
    </section>
  );
};
