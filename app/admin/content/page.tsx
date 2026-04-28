"use client"
import { useState, useEffect } from "react"
import { Loader2, Save, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ContentManagerPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [homeData, setHomeData] = useState({
    heroTitle: "BEYOND THE SCOOP",
    heroSubtitle: "Experience the universe of flavors with AK Icecream. Indulgence redefined for the modern palate.",
    aboutHeading: "Our Story",
    aboutText: "Crafting small-batch, artisanal ice cream...",
    aboutBg: "",
    orderBg: "",
    zomatoLink: "",
    swiggyLink: "",
    processImage: "",
    banners: [] as { id: string, image: string, title: string, description: string, buttonText: string, buttonLink: string }[],
    faqs: [] as { id: string, question: string, answer: string }[]
  })

  const [contactData, setContactData] = useState({
    headerSmall: "Get In Touch",
    headingPart1: "Let's Talk",
    headingPart2: "Ice Cream",
    subheading: "Whether you have a question about our flavors, want to discuss catering for an event, or are interested in franchise opportunities, we're here to help.",
    storesHeading: "Visit Our Stores",
    directContactHeading: "Direct Contact",
    email: "hello@akicecream.com",
    phone: "+91 98765 43210",
    formHeading: "Send us a message"
  })

  const [shopData, setShopData] = useState({
    bgImage: ""
  })

  useEffect(() => {
    fetchContent(activeTab)
  }, [activeTab])

  const fetchContent = async (slug: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/content?slug=${slug}`)
      if (res.ok) {
        const json = await res.json()
        if (json.content && json.content !== "{}") {
          const parsed = JSON.parse(json.content)
          if (slug === 'home') setHomeData(prev => ({ ...prev, ...parsed }))
          if (slug === 'contact') setContactData(prev => ({ ...prev, ...parsed }))
          if (slug === 'shop') {
            setShopData(prev => ({
              ...prev,
              ...parsed,
              bgImage: parsed.bgImage ?? parsed.backgroundImage ?? "",
            }))
          }
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'aboutBg' | 'orderBg' | 'processImage' | 'bgImage') => {
    const file = e.target.files?.[0]
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (activeTab === 'home') {
        setHomeData(prev => ({ ...prev, [field]: data.url }));
      } else if (activeTab === 'shop') {
        setShopData(prev => ({ ...prev, [field]: data.url }));
      }
    } catch (err) {
      alert("Failed to upload background image");
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const newBanners = [...homeData.banners];
      newBanners[index] = { ...newBanners[index], image: data.url };
      setHomeData(prev => ({ ...prev, banners: newBanners }));
    } catch (err) {
      alert("Failed to upload banner image");
    }
  }

  const addBanner = () => {
    if (homeData.banners.length >= 4) return;
    setHomeData(prev => ({
      ...prev,
      banners: [...prev.banners, { id: Date.now().toString(), image: "", title: "", description: "", buttonText: "Know More", buttonLink: "" }]
    }));
  }

  const removeBanner = (index: number) => {
    const newBanners = homeData.banners.filter((_, i) => i !== index);
    setHomeData(prev => ({ ...prev, banners: newBanners }));
  }

  const updateBanner = (index: number, field: string, value: string) => {
    const newBanners = [...homeData.banners];
    newBanners[index] = { ...newBanners[index], [field]: value };
    setHomeData(prev => ({ ...prev, banners: newBanners }));
  }

  const addFAQ = () => {
    setHomeData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { id: Date.now().toString(), question: "", answer: "" }]
    }));
  }

  const removeFAQ = (index: number) => {
    const newFaqs = homeData.faqs.filter((_, i) => i !== index);
    setHomeData(prev => ({ ...prev, faqs: newFaqs }));
  }

  const updateFAQ = (index: number, field: string, value: string) => {
    const newFaqs = [...homeData.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setHomeData(prev => ({ ...prev, faqs: newFaqs }));
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const currentData = activeTab === 'home' ? homeData : activeTab === 'contact' ? contactData : activeTab === 'shop' ? shopData : {}
      const contentStr = JSON.stringify(currentData)
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageSlug: activeTab, content: contentStr })
      })
      if (!res.ok) throw new Error("Failed to save")
      
      router.refresh()
      alert("Changes saved successfully!")
    } catch (e) {
      alert("Error saving: " + e)
    } finally {
      setIsSaving(false)
    }
  }

  const handleHomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHomeData({ ...homeData, [e.target.name]: e.target.value })
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Website Content Manager
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            v2.1 - Banners Active
          </span>
        </div>
        <p className="text-neutral-400 text-sm mt-1">Edit the static text and configurations across your website dynamically.</p>
      </div>

      <div className="flex border-b border-neutral-800">
        <button 
          onClick={() => setActiveTab('home')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'home' ? 'border-emerald-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
        >
          Home Page
        </button>
        <button 
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'footer' ? 'border-emerald-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
        >
          Footer Details
        </button>
        <button 
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'contact' ? 'border-emerald-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
        >
          Contact Page
        </button>
        <button 
          onClick={() => setActiveTab('shop')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'shop' ? 'border-emerald-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
        >
          Shop Page
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
        {isLoading ? (
          <div className="flex py-10 justify-center items-center text-neutral-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {activeTab === 'home' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-emerald-400 border-b border-neutral-800 pb-2">Hero Section</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Hero Title</label>
                      <input type="text" name="heroTitle" value={homeData.heroTitle} onChange={handleHomeChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Hero Subtitle</label>
                      <textarea rows={3} name="heroSubtitle" value={homeData.heroSubtitle} onChange={handleHomeChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                    <h3 className="text-lg font-medium text-emerald-400">Home Banners (Carousel)</h3>
                    <button 
                      onClick={addBanner} 
                      disabled={homeData.banners.length >= 4}
                      className="text-xs bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 px-3 py-1 rounded-full hover:bg-emerald-600/30 transition-colors disabled:opacity-30"
                    >
                      + Add Banner ({homeData.banners.length}/4)
                    </button>
                  </div>
                  <div className="space-y-6">
                    {homeData.banners.length === 0 && <p className="text-neutral-500 text-sm italic py-4">No banners added yet. Click "+ Add Banner" to begin.</p>}
                    {homeData.banners.map((banner, idx) => (
                      <div key={banner.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4 relative group">
                        <button 
                          onClick={() => removeBanner(idx)}
                          className="absolute top-2 right-2 p-1 text-neutral-600 hover:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-neutral-400 mb-1">Banner Image</label>
                              <div className="flex items-center gap-4">
                                <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-neutral-800 bg-black">
                                  {banner.image ? <Image src={banner.image} alt="Banner" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">No Image</div>}
                                </div>
                                <label className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors text-xs">
                                  <Upload className="w-3 h-3" /> Upload
                                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBannerUpload(e, idx)} />
                                </label>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-neutral-400 mb-1">Title</label>
                              <input type="text" value={banner.title} onChange={(e) => updateBanner(idx, 'title', e.target.value)} placeholder="e.g., More coconut More chatter" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-neutral-400 mb-1">Description</label>
                              <textarea rows={2} value={banner.description} onChange={(e) => updateBanner(idx, 'description', e.target.value)} placeholder="Savour creamy tender coconut pieces..." className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Button Text</label>
                                <input type="text" value={banner.buttonText} onChange={(e) => updateBanner(idx, 'buttonText', e.target.value)} placeholder="Know More" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Button Link</label>
                                <input type="text" value={banner.buttonLink} onChange={(e) => updateBanner(idx, 'buttonLink', e.target.value)} placeholder="/shop" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                    <h3 className="text-lg font-medium text-emerald-400">Frequently Asked Questions</h3>
                    <button 
                      onClick={addFAQ} 
                      className="text-xs bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 px-3 py-1 rounded-full hover:bg-emerald-600/30 transition-colors"
                    >
                      + Add FAQ
                    </button>
                  </div>
                  <div className="space-y-4">
                    {homeData.faqs.length === 0 && <p className="text-neutral-500 text-sm italic py-4">No FAQs added yet.</p>}
                    {homeData.faqs.map((faq, idx) => (
                      <div key={faq.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3 relative group">
                        <button 
                          onClick={() => removeFAQ(idx)}
                          className="absolute top-2 right-2 p-1 text-neutral-600 hover:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                        <div>
                          <label className="block text-sm font-medium text-neutral-400 mb-1">Question</label>
                          <input type="text" value={faq.question} onChange={(e) => updateFAQ(idx, 'question', e.target.value)} placeholder="e.g., Do you offer sugar-free options?" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-400 mb-1">Answer</label>
                          <textarea rows={3} value={faq.answer} onChange={(e) => updateFAQ(idx, 'answer', e.target.value)} placeholder="Enter the detailed answer here..." className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium text-emerald-400 border-b border-neutral-800 pb-2">About Section & Background</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">About Heading</label>
                      <input type="text" name="aboutHeading" value={homeData.aboutHeading} onChange={handleHomeChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">About Text</label>
                      <textarea rows={5} name="aboutText" value={homeData.aboutText} onChange={handleHomeChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Legacy Section Background (Transparent)</label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-neutral-800 bg-black">
                          {homeData.aboutBg ? <Image src={homeData.aboutBg} alt="About Bg" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">No Image</div>}
                        </div>
                        <label className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm">
                          <Upload className="w-4 h-4" /> Upload Image
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'aboutBg')} />
                        </label>
                        {homeData.aboutBg && (
                          <button 
                            onClick={() => setHomeData(prev => ({ ...prev, aboutBg: "" }))}
                            className="text-red-400 hover:text-red-300 text-xs font-medium px-2 py-1"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium text-emerald-400 border-b border-neutral-800 pb-2">"The Process" Section</h3>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Process Visualization Image</label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-neutral-800 bg-black">
                        {homeData.processImage ? <Image src={homeData.processImage} alt="Process Image" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">No Image</div>}
                      </div>
                      <label className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm">
                        <Upload className="w-4 h-4" /> Upload Image
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'processImage')} />
                      </label>
                      {homeData.processImage && (
                        <button 
                          onClick={() => setHomeData(prev => ({ ...prev, processImage: "" }))}
                          className="text-red-400 hover:text-red-300 text-xs font-medium px-2 py-1"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-1 italic">Displays in the "Premium Ingredients. Unforgettable Taste." section.</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium text-emerald-400 border-b border-neutral-800 pb-2">Delivery & Order Background</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Zomato Store Link</label>
                      <input type="url" name="zomatoLink" placeholder="https://zomato.com/..." value={homeData.zomatoLink || ""} onChange={handleHomeChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Swiggy Store Link</label>
                      <input type="url" name="swiggyLink" placeholder="https://swiggy.com/..." value={homeData.swiggyLink || ""} onChange={handleHomeChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Craving Section Background (Transparent)</label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-neutral-800 bg-black">
                          {homeData.orderBg ? <Image src={homeData.orderBg} alt="Order Bg" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">No Image</div>}
                        </div>
                        <label className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm">
                          <Upload className="w-4 h-4" /> Upload Image
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'orderBg')} />
                        </label>
                        {homeData.orderBg && (
                          <button 
                            onClick={() => setHomeData(prev => ({ ...prev, orderBg: "" }))}
                            className="text-red-400 hover:text-red-300 text-xs font-medium px-2 py-1"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'contact' && (
               <>
                 <div className="space-y-4">
                   <h3 className="text-lg font-medium text-emerald-400 border-b border-neutral-800 pb-2">Top Headers</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-neutral-400 mb-1">Small Overhead</label>
                       <input type="text" name="headerSmall" value={contactData.headerSmall} onChange={handleContactChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-neutral-400 mb-1">Main Title Start</label>
                       <input type="text" name="headingPart1" value={contactData.headingPart1} onChange={handleContactChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-neutral-400 mb-1">Main Colored Title End</label>
                       <input type="text" name="headingPart2" value={contactData.headingPart2} onChange={handleContactChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                     </div>
                     <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-neutral-400 mb-1">Subheading Paragraph</label>
                       <textarea rows={3} name="subheading" value={contactData.subheading} onChange={handleContactChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4 pt-4">
                   <h3 className="text-lg font-medium text-emerald-400 border-b border-neutral-800 pb-2">Direct Contact Setup</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-neutral-400 mb-1">Stores Section Title</label>
                       <input type="text" name="storesHeading" value={contactData.storesHeading} onChange={handleContactChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-neutral-400 mb-1">Contact Section Title</label>
                       <input type="text" name="directContactHeading" value={contactData.directContactHeading} onChange={handleContactChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-neutral-400 mb-1">Company Email</label>
                       <input type="email" name="email" value={contactData.email} onChange={handleContactChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-neutral-400 mb-1">Company Phone</label>
                       <input type="text" name="phone" value={contactData.phone} onChange={handleContactChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4 pt-4">
                   <h3 className="text-lg font-medium text-emerald-400 border-b border-neutral-800 pb-2">Form Setup</h3>
                   <div>
                     <label className="block text-sm font-medium text-neutral-400 mb-1">Contact Form Heading</label>
                     <input type="text" name="formHeading" value={contactData.formHeading} onChange={handleContactChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                   </div>
                 </div>
                </>
             )}

            {activeTab === 'shop' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-emerald-400 border-b border-neutral-800 pb-2">Shop Background</h3>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Main Shop Background Image</label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-neutral-800 bg-black">
                        {shopData.bgImage ? (
                          <Image src={shopData.bgImage} alt="Shop Background" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600">No Image</div>
                        )}
                      </div>
                      <label className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm text-center">
                        <Upload className="w-4 h-4" /> Upload Background
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'bgImage')} />
                      </label>
                      {shopData.bgImage && (
                        <button 
                          onClick={() => setShopData(prev => ({ ...prev, bgImage: "" }))}
                          className="text-red-400 hover:text-red-300 text-xs font-medium px-2 py-1"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-2 italic">This image will appear as the background for the main Shop page.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'footer' && (
               <div className="text-neutral-500 italic text-center py-8">Footer configuration form coming soon...</div>
            )}

            <div className="flex justify-end pt-6 border-t border-neutral-800">
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes 
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
