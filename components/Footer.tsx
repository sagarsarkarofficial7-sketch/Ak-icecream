import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#12100e] text-white/80 py-16 px-6 sm:px-12 w-full mt-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="mb-4">
            <Image
              src="/Logo.png"
              alt="Aashutosh Kothi Ice Cream Logo"
              width={150}
              height={150}
              className="w-[150px] h-auto drop-shadow-md"
            />
          </div>
          <p className="font-poppins text-sm leading-relaxed max-w-sm">
            Experience the taste of satisfaction. Premium ingredients, crafted with love, bringing tropical joy and chocolaty richness to every scoop.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-outfit font-semibold text-white">Explore</h4>
          <ul className="space-y-3 font-poppins text-sm">
            <li><a href="#" className="hover:text-pinkCream transition-colors">All Flavours</a></li>
            <li><a href="#" className="hover:text-pinkCream transition-colors">Our Story</a></li>
            <li><a href="#" className="hover:text-pinkCream transition-colors">Quality Ingredients</a></li>
            <li><a href="#" className="hover:text-pinkCream transition-colors">Contact Us</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-outfit font-semibold text-white">Join The Club</h4>
          <p className="font-poppins text-sm mb-4">
            Get exclusive offers and early access to new seasonal flavours.
          </p>
          <div className="flex w-full max-w-xs focus-within:ring-2 ring-pinkCream rounded-full overflow-hidden bg-white/5 border border-white/10">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-transparent text-white px-4 py-3 outline-none flex-grow text-sm font-poppins w-full"
            />
            <button className="bg-gradient-to-r from-pinkCream to-cherryRed px-6 py-3 font-poppins text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-poppins">
        <p>© {new Date().getFullYear()} Aashutosh Kothi Ice Cream - Designed & Developed by Digitoxy.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
