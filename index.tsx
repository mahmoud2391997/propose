import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// --- Icons (Inline SVG for portability) ---
const Icons = {
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Star: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  Heart: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Bolt: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
  ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
  Filter: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Wifi: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>,
  Coffee: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Camera: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
};

// --- Types ---
type ViewState = 'HOME' | 'SEARCH' | 'DETAILS' | 'HOST';
type Category = { id: number; name: string; image: string };
type Amenity = 'Wifi' | 'Coffee' | 'Transport' | 'Equipment' | 'Food' | 'Guide' | 'Camera';

interface Experience {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  category: string;
  badge?: string;
  description: string;
  host: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  amenities: Amenity[];
  duration: string;
  groupSize: string;
}

// --- Mock Data ---
const CATEGORIES: Category[] = [
  { id: 1, name: 'Adrenaline', image: 'https://images.unsplash.com/photo-1533130061792-649d45df8c2d?auto=format&fit=crop&q=80&w=300' },
  { id: 2, name: 'Food & Drink', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=300' },
  { id: 3, name: 'Wellness', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=300' },
  { id: 4, name: 'Arts & Culture', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=300' },
  { id: 5, name: 'Nightlife', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=300' },
];

const EXPERIENCES: Experience[] = [
  {
    id: 1,
    title: 'Sunset Skydiving over the Coast',
    location: 'Santa Barbara, CA',
    price: 249,
    rating: 4.9,
    reviews: 128,
    images: [
      'https://images.unsplash.com/photo-1521673461240-f1345435a295?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1475518112798-86ae35f24d7e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588661858348-77c8e906c276?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Adrenaline',
    badge: 'Trending',
    description: "Experience the thrill of a lifetime with our tandem skydive over the beautiful Santa Barbara coastline. Freefall for 60 seconds at 120mph before enjoying a peaceful 5-minute parachute ride with breathtaking sunset views. Perfect for beginners and adrenaline junkies alike.",
    host: { name: "Jake S.", avatar: "https://i.pravatar.cc/150?u=1", verified: true },
    amenities: ['Equipment', 'Guide', 'Transport', 'Camera'],
    duration: "4 hours",
    groupSize: "1-4 people"
  },
  {
    id: 2,
    title: 'Underground Sushi Omakase',
    location: 'Tokyo, Japan',
    price: 180,
    rating: 5.0,
    reviews: 85,
    images: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1617196034496-64ac7960f271?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Food & Drink',
    badge: 'Exclusive',
    description: "A secret 12-course omakase experience in a hidden basement location known only to locals. Chef Kenji uses fish flown in daily from Tsukiji Market. Sake pairing included. This is not just dinner; it's a culinary journey through Edo-period traditions.",
    host: { name: "Kenji M.", avatar: "https://i.pravatar.cc/150?u=2", verified: true },
    amenities: ['Food', 'Wifi', 'Coffee'],
    duration: "2.5 hours",
    groupSize: "Max 8 people"
  },
  {
    id: 3,
    title: 'Bioluminescent Kayaking',
    location: 'Phuket, Thailand',
    price: 65,
    rating: 4.8,
    reviews: 342,
    images: [
      'https://images.unsplash.com/photo-1544551763-46a8723ba3f9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Adrenaline',
    description: "Paddle through the mystical caves of Phang Nga Bay at night. Witness the water lighting up with blue bioluminescent plankton with every stroke of your paddle. A magical, serene, and unforgettable encounter with nature.",
    host: { name: "Sarah L.", avatar: "https://i.pravatar.cc/150?u=3", verified: true },
    amenities: ['Guide', 'Equipment', 'Transport'],
    duration: "3 hours",
    groupSize: "Group of 10"
  },
  {
    id: 4,
    title: 'Neon Pottery Workshop',
    location: 'New York, NY',
    price: 85,
    rating: 4.7,
    reviews: 56,
    images: [
      'https://images.unsplash.com/photo-1565193566173-033e4612e62b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1520032525096-7bd04a94b561?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Arts & Culture',
    description: "Throw clay under UV lights! Create glowing masterpieces in this high-energy workshop featuring live DJ sets and complimentary neon body paint. It's pottery meets rave culture. Kiln firing and glazing included.",
    host: { name: "Alex R.", avatar: "https://i.pravatar.cc/150?u=4", verified: false },
    amenities: ['Equipment', 'Wifi'],
    duration: "2 hours",
    groupSize: "Group of 15"
  },
  {
    id: 5,
    title: 'Volcano Hiking & Marshmallows',
    location: 'Reykjavik, Iceland',
    price: 120,
    rating: 4.9,
    reviews: 210,
    images: [
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Adrenaline',
    description: "Hike up an active volcano safely with certified geologists. Feel the heat of the earth and roast marshmallows over cooling lava fields. A once-in-a-lifetime geology lesson you can eat.",
    host: { name: "Bjorn", avatar: "https://i.pravatar.cc/150?u=5", verified: true },
    amenities: ['Guide', 'Food', 'Transport'],
    duration: "6 hours",
    groupSize: "Small group"
  },
  {
    id: 6,
    title: 'Silent Disco Yoga',
    location: 'San Francisco, CA',
    price: 45,
    rating: 4.6,
    reviews: 89,
    images: [
      'https://images.unsplash.com/photo-1544367563-12123d896889?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Wellness',
    description: "Immerse yourself in flow. Wear noise-canceling headphones playing deep house beats while an instructor guides you through a Vinyasa flow on Baker Beach. Sunset views of the Golden Gate Bridge included.",
    host: { name: "Luna", avatar: "https://i.pravatar.cc/150?u=6", verified: true },
    amenities: ['Equipment'],
    duration: "1.5 hours",
    groupSize: "Group of 30"
  }
];

// --- Shared Components ---

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <div onClick={onClick} className="flex items-center gap-1 group cursor-pointer select-none">
    <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg transform group-hover:rotate-12 transition-transform duration-300">
      <div className="text-white transform -translate-y-0.5">
        <Icons.Bolt />
      </div>
    </div>
    <span className="text-2xl font-bold tracking-tight text-white">
      Go<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 italic">Crazy</span>
    </span>
  </div>
);

const Navbar = ({ onNavigate, currentView }: { onNavigate: (view: ViewState) => void, currentView: ViewState }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${isScrolled || currentView !== 'HOME' ? 'bg-slate-900/90 backdrop-blur-md border-white/10 py-3 shadow-lg' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Logo onClick={() => onNavigate('HOME')} />
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <button onClick={() => onNavigate('SEARCH')} className={`hover:text-white transition-colors ${currentView === 'SEARCH' ? 'text-orange-400' : ''}`}>Experiences</button>
          <button onClick={() => onNavigate('SEARCH')} className="hover:text-white transition-colors">Categories</button>
          <button onClick={() => onNavigate('HOST')} className={`hover:text-white transition-colors ${currentView === 'HOST' ? 'text-orange-400' : ''}`}>Become a Host</button>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={() => onNavigate('SEARCH')} className="hidden md:flex items-center gap-2 text-slate-300 hover:text-white">
             <Icons.Search />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all">
            <Icons.User />
            <span>Log in</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const ExperienceCard: React.FC<{ item: Experience; onClick: (id: number) => void }> = ({ item, onClick }) => (
  <div onClick={() => onClick(item.id)} className="group relative bg-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-xl border border-slate-700/50 flex flex-col h-full">
    <div className="relative h-64 overflow-hidden">
      <img 
        src={item.images[0]} 
        alt={item.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
      />
      <div className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-pink-500 hover:text-white transition-colors">
        <Icons.Heart />
      </div>
      {item.badge && (
        <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-bold uppercase tracking-wide rounded-full shadow-lg">
          {item.badge}
        </div>
      )}
    </div>
    
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">{item.category}</span>
        <div className="flex items-center gap-1 text-slate-300 text-sm">
          <span className="text-yellow-400"><Icons.Star /></span>
          <span className="font-medium text-white">{item.rating}</span>
          <span className="text-slate-500">({item.reviews})</span>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
      <p className="flex items-center gap-1 text-slate-400 text-sm mb-4">
        <Icons.MapPin /> {item.location}
      </p>
      
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-700">
        <div>
          <span className="text-xs text-slate-500">From</span>
          <div className="text-xl font-bold text-white">${item.price}</div>
        </div>
        <button className="px-4 py-2 bg-slate-700 hover:bg-white hover:text-slate-900 text-white text-sm font-medium rounded-lg transition-colors">
          View
        </button>
      </div>
    </div>
  </div>
);

const Footer = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => (
  <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="mb-6"><Logo /></div>
          <p className="text-slate-500 text-sm leading-relaxed">
            GoCrazy is the world's first marketplace dedicated to experiences that push your boundaries.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Discover</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><button onClick={() => onNavigate('SEARCH')} className="hover:text-orange-500 transition-colors">New Arrivals</button></li>
            <li><button onClick={() => onNavigate('SEARCH')} className="hover:text-orange-500 transition-colors">Trending</button></li>
            <li><button onClick={() => onNavigate('SEARCH')} className="hover:text-orange-500 transition-colors">Categories</button></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Gift Cards</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Safety Information</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Cancellation Options</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Subscribe</h4>
          <p className="text-slate-500 text-sm mb-4">Get the latest adventures delivered to your inbox.</p>
          <div className="flex">
            <input type="email" placeholder="Email address" className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-l-lg outline-none focus:border-orange-500 w-full text-sm" />
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-r-lg font-medium text-sm transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
        <p>&copy; 2024 GoCrazy Inc. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-slate-400">Privacy</a>
          <a href="#" className="hover:text-slate-400">Terms</a>
          <a href="#" className="hover:text-slate-400">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Page Views ---

const HomeView = ({ onNavigate, setDetailsId }: { onNavigate: (v: ViewState) => void, setDetailsId: (id: number) => void }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Discover the extraordinary
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Don't Just Live. <br />
            <span className="text-gradient italic">Go Crazy.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            The marketplace for unique, adrenaline-pumping, and unforgettable life experiences. Find your next story today.
          </p>

          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 h-14 md:border-r border-white/10 relative group">
              <div className="text-slate-400 group-focus-within:text-orange-400 transition-colors">
                <Icons.Search />
              </div>
              <input 
                type="text" 
                placeholder="Skydiving, Pottery, Yoga..." 
                className="w-full bg-transparent border-none outline-none text-white placeholder-slate-400 px-3 h-full"
              />
            </div>
            
            <div className="flex-1 flex items-center px-4 h-14 relative group">
              <div className="text-slate-400 group-focus-within:text-orange-400 transition-colors">
                <Icons.MapPin />
              </div>
              <input 
                type="text" 
                placeholder="Where to? (e.g. Bali)" 
                className="w-full bg-transparent border-none outline-none text-white placeholder-slate-400 px-3 h-full"
              />
            </div>

            <button onClick={() => onNavigate('SEARCH')} className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white h-14 px-8 rounded-xl md:rounded-full font-bold transition-all shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2">
              Search
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-400 font-medium">
            <span className="flex items-center gap-2">
              <div className="p-1 bg-green-500/20 rounded-full text-green-400"><Icons.Bolt /></div> Instant Booking
            </span>
            <span className="flex items-center gap-2">
              <div className="p-1 bg-blue-500/20 rounded-full text-blue-400"><Icons.Star /></div> Verified Hosts
            </span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 border-b border-slate-800 bg-slate-900">
        <div className="container mx-auto px-4 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex justify-between md:justify-center gap-8 min-w-max">
            {CATEGORIES.map(cat => (
              <div onClick={() => onNavigate('SEARCH')} key={cat.id} className="flex flex-col items-center gap-3 group cursor-pointer min-w-[100px]">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-orange-500 transition-all duration-300 shadow-lg relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-20 container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Trending Experiences</h2>
            <p className="text-slate-400">Curated adventures that people are raving about this week.</p>
          </div>
          <button onClick={() => onNavigate('SEARCH')} className="flex items-center gap-2 text-orange-500 hover:text-orange-400 font-semibold transition-colors">
            View All <Icons.ChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPERIENCES.slice(0, 4).map(item => (
            <ExperienceCard key={item.id} item={item} onClick={(id) => { setDetailsId(id); onNavigate('DETAILS'); }} />
          ))}
        </div>
      </section>

      {/* Banner / CTA */}
      <section className="py-20 bg-slate-800 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10">
           <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
         </div>
         <div className="container mx-auto px-4 text-center relative z-10">
           <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to go <span className="italic text-orange-500">Crazy?</span></h2>
           <p className="text-slate-300 max-w-xl mx-auto mb-8 text-lg">Join our community of 50,000+ thrill-seekers and discover the world's most unique experiences.</p>
           <button onClick={() => onNavigate('SEARCH')} className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-200 transition-colors shadow-xl">
             Start Exploring Now
           </button>
         </div>
      </section>
    </div>
  );
};

const SearchView = ({ setDetailsId, onNavigate }: { setDetailsId: (id: number) => void, onNavigate: (v: ViewState) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState(300);

  const filtered = useMemo(() => {
    return EXPERIENCES.filter(e => {
       const catMatch = selectedCategory === 'All' || e.category.includes(selectedCategory);
       const priceMatch = e.price <= priceRange;
       return catMatch && priceMatch;
    });
  }, [selectedCategory, priceRange]);

  return (
    <div className="pt-24 min-h-screen bg-slate-900 animate-fade-in">
       <div className="container mx-auto px-4 md:px-8 py-8">
         <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-1/4 space-y-8">
               <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 sticky top-24">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold text-white flex items-center gap-2"><Icons.Filter /> Filters</h3>
                   <button onClick={() => {setSelectedCategory('All'); setPriceRange(300);}} className="text-xs text-orange-400 hover:text-orange-300">Reset</button>
                 </div>
                 
                 <div className="mb-6">
                   <h4 className="text-sm font-semibold text-slate-300 mb-3">Categories</h4>
                   <div className="space-y-2">
                     {['All', 'Adrenaline', 'Food & Drink', 'Wellness', 'Arts & Culture'].map(c => (
                       <label key={c} className="flex items-center gap-2 cursor-pointer group">
                         <input 
                           type="radio" 
                           name="category" 
                           checked={selectedCategory === c} 
                           onChange={() => setSelectedCategory(c)}
                           className="accent-orange-500 w-4 h-4" 
                         />
                         <span className={`text-sm ${selectedCategory === c ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>{c}</span>
                       </label>
                     ))}
                   </div>
                 </div>

                 <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-3">Max Price: ${priceRange}</h4>
                    <input 
                      type="range" 
                      min="0" 
                      max="500" 
                      value={priceRange} 
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full accent-orange-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>$0</span>
                      <span>$500+</span>
                    </div>
                 </div>
               </div>
            </div>

            {/* Results Grid */}
            <div className="w-full lg:w-3/4">
               <div className="mb-6 flex items-center justify-between">
                 <h1 className="text-2xl font-bold text-white">{filtered.length} Experiences found</h1>
                 <select className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-orange-500">
                   <option>Recommended</option>
                   <option>Price: Low to High</option>
                   <option>Price: High to Low</option>
                   <option>Top Rated</option>
                 </select>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map(item => (
                    <ExperienceCard key={item.id} item={item} onClick={(id) => { setDetailsId(id); onNavigate('DETAILS'); }} />
                  ))}
               </div>
               
               {filtered.length === 0 && (
                 <div className="text-center py-20 text-slate-500">
                   <p className="text-lg">No experiences match your filters.</p>
                   <button onClick={() => {setSelectedCategory('All'); setPriceRange(300);}} className="text-orange-500 mt-2 hover:underline">Clear Filters</button>
                 </div>
               )}
            </div>
         </div>
       </div>
    </div>
  );
};

const DetailsView = ({ id, onNavigate }: { id: number, onNavigate: (v: ViewState) => void }) => {
  const item = EXPERIENCES.find(e => e.id === id);

  if (!item) return <div className="pt-32 text-center text-white">Experience not found. <button onClick={() => onNavigate('HOME')} className="text-orange-500 underline">Go Home</button></div>;

  return (
    <div className="bg-slate-900 min-h-screen pt-24 pb-20 animate-fade-in">
       <div className="container mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <button onClick={() => onNavigate('SEARCH')} className="flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <Icons.ChevronLeft /> Back to Search
          </button>

          {/* Title Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{item.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-1 text-white"><Icons.Star /> {item.rating} ({item.reviews} reviews)</span>
              <span className="flex items-center gap-1"><Icons.MapPin /> {item.location}</span>
              {item.badge && <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded text-xs font-bold uppercase">{item.badge}</span>}
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px] mb-10 rounded-2xl overflow-hidden">
             <div className="md:col-span-2 h-full">
               <img src={item.images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" alt="Main" />
             </div>
             <div className="grid grid-rows-2 gap-4 h-full">
               <img src={item.images[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" alt="Detail 1" />
               <img src={item.images[2]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" alt="Detail 2" />
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-10">
               {/* Description */}
               <section>
                 <h2 className="text-2xl font-bold text-white mb-4">About the Experience</h2>
                 <p className="text-slate-300 leading-relaxed text-lg">{item.description}</p>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                   <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                     <div className="text-slate-400 mb-1"><Icons.Calendar /></div>
                     <div className="text-white font-semibold">{item.duration}</div>
                     <div className="text-xs text-slate-500">Duration</div>
                   </div>
                   <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                     <div className="text-slate-400 mb-1"><Icons.Users /></div>
                     <div className="text-white font-semibold">{item.groupSize}</div>
                     <div className="text-xs text-slate-500">Group Size</div>
                   </div>
                   <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                     <div className="text-slate-400 mb-1"><Icons.User /></div>
                     <div className="text-white font-semibold">Hosted</div>
                     <div className="text-xs text-slate-500">By {item.host.name}</div>
                   </div>
                 </div>
               </section>

               {/* Host Info */}
               <section className="border-t border-slate-800 pt-10">
                 <h2 className="text-2xl font-bold text-white mb-6">Meet your Host</h2>
                 <div className="flex items-center gap-4 mb-4">
                   <img src={item.host.avatar} alt={item.host.name} className="w-16 h-16 rounded-full border-2 border-slate-700" />
                   <div>
                     <h3 className="text-xl font-bold text-white">{item.host.name}</h3>
                     {item.host.verified && <span className="text-green-400 text-sm flex items-center gap-1"><Icons.Check /> Verified Host</span>}
                   </div>
                 </div>
                 <p className="text-slate-300">"I've been guiding tours for over 10 years. I love sharing unique perspectives of my city and helping people push their comfort zones."</p>
               </section>

               {/* Amenities */}
               <section className="border-t border-slate-800 pt-10">
                 <h2 className="text-2xl font-bold text-white mb-6">What's Included</h2>
                 <div className="grid grid-cols-2 gap-4">
                   {item.amenities.map(a => (
                     <div key={a} className="flex items-center gap-3 text-slate-300">
                       <span className="text-orange-500">
                         {a === 'Wifi' && <Icons.Wifi />}
                         {a === 'Coffee' && <Icons.Coffee />}
                         {a === 'Transport' && <Icons.Bolt />}
                         {a === 'Equipment' && <Icons.Bolt />}
                         {a === 'Guide' && <Icons.User />}
                         {a === 'Camera' && <Icons.Camera />}
                       </span>
                       {a}
                     </div>
                   ))}
                 </div>
               </section>
            </div>

            {/* Right Booking Sidebar */}
            <div className="lg:col-span-1">
               <div className="sticky top-24 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl">
                 <div className="flex items-center justify-between mb-6">
                   <span className="text-3xl font-bold text-white">${item.price}</span>
                   <span className="text-slate-400 text-sm">/ person</span>
                 </div>

                 <div className="space-y-4 mb-6">
                   <div className="grid grid-cols-2 gap-2">
                     <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                       <label className="text-xs text-slate-500 block mb-1">Check-in</label>
                       <span className="text-white text-sm">Oct 24, 2024</span>
                     </div>
                     <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                       <label className="text-xs text-slate-500 block mb-1">Guests</label>
                       <span className="text-white text-sm">2 Guests</span>
                     </div>
                   </div>
                   
                   <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-orange-500/25">
                     Book Experience
                   </button>
                 </div>
                 
                 <div className="space-y-3 text-sm text-slate-400">
                   <div className="flex justify-between">
                     <span>${item.price} x 2 guests</span>
                     <span>${item.price * 2}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Service fee</span>
                     <span>$15</span>
                   </div>
                   <div className="border-t border-slate-700 pt-3 flex justify-between font-bold text-white text-base">
                     <span>Total</span>
                     <span>${(item.price * 2) + 15}</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
       </div>
    </div>
  );
};

const HostView = ({ onNavigate }: { onNavigate: (v: ViewState) => void }) => {
  return (
    <div className="pt-24 min-h-screen bg-slate-900 animate-fade-in">
       {/* Host Hero */}
       <div className="container mx-auto px-4 text-center py-20">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Earn money doing <br/>what you <span className="text-orange-500">Love.</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Turn your passion into a business. Host unique experiences for travelers from around the world on GoCrazy.
          </p>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-200 transition-colors">
            Get Started
          </button>
       </div>

       {/* Benefits Grid */}
       <div className="bg-slate-800 py-20">
         <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             <div className="p-6 bg-slate-900 rounded-xl border border-slate-700">
               <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-lg flex items-center justify-center mb-4">
                 <Icons.Bolt />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Be your own boss</h3>
               <p className="text-slate-400">Set your own schedule, prices, and rules. You have complete control over your business.</p>
             </div>
             <div className="p-6 bg-slate-900 rounded-xl border border-slate-700">
               <div className="w-12 h-12 bg-purple-500/20 text-purple-500 rounded-lg flex items-center justify-center mb-4">
                 <Icons.Users />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Reach millions</h3>
               <p className="text-slate-400">Connect with our global community of thrill-seekers looking for their next adventure.</p>
             </div>
             <div className="p-6 bg-slate-900 rounded-xl border border-slate-700">
               <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-lg flex items-center justify-center mb-4">
                 <Icons.Check />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">We've got your back</h3>
               <p className="text-slate-400">24/7 support, liability insurance, and secure payments so you can focus on hosting.</p>
             </div>
           </div>
         </div>
       </div>
    </div>
  );
};

// --- App Root ---

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [detailsId, setDetailsId] = useState<number>(1);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-orange-500/30">
      <Navbar onNavigate={setCurrentView} currentView={currentView} />
      
      <main>
        {currentView === 'HOME' && <HomeView onNavigate={setCurrentView} setDetailsId={setDetailsId} />}
        {currentView === 'SEARCH' && <SearchView onNavigate={setCurrentView} setDetailsId={setDetailsId} />}
        {currentView === 'DETAILS' && <DetailsView id={detailsId} onNavigate={setCurrentView} />}
        {currentView === 'HOST' && <HostView onNavigate={setCurrentView} />}
      </main>

      <Footer onNavigate={setCurrentView} />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);