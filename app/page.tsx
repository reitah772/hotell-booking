"use client"
import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, CheckCircle, LogOut, 
  ShieldCheck, Bed, Wifi, Coffee, MapPin, 
  ChevronLeft, Search, ArrowRight,
  ChevronRight, Trash2, Clock, Waves, Mountain, Sunrise, Wind,
  Lock, CreditCard as CardIcon, Star, Globe, Heart, Camera,
  Mail, Eye, EyeOff, TreePine, Snowflake, Building
} from 'lucide-react';
import { authClient } from '@/app/lib/auth-client';
import Link from 'next/link';
interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  price: number;
  stars: number;
  score: number;
  reviews: number;
  distance: string;
  description: string;
  amenities: { icon: React.ReactNode; label: string }[];
  image: string;
  category: string;
}

interface BookingRecord {
  id: string;
  hotelId: string;
  hotel: Hotel;
  date: Date;
  totalPrice: number;
  userId: string;
  status: 'Bekräftad' | 'Avbokad';
  createdAt: Date;
}

const CustomCalendar = ({ selected, onSelect }: { selected: Date | undefined, onSelect: (d: Date) => void }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i);
  const weekDays = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl w-full max-w-[320px]">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={18}/></button>
        <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-800">
          {currentMonth.toLocaleString('sv-SE', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight size={18}/></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-3">
        {weekDays.map((day, idx) => (
          <div key={`weekday-${idx}`} className="text-[10px] font-black text-slate-400">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {blanks.map(b => <div key={`blank-${b}`} />)}
        {days.map(d => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
          const isSelected = selected?.toDateString() === date.toDateString();
          return (
            <button 
              key={`day-${d}`} 
              onClick={() => onSelect(date)}
              className={`h-9 w-9 text-xs font-bold rounded-xl transition-all ${isSelected ? 'bg-amber-500 text-white shadow-lg scale-110' : 'hover:bg-amber-50 text-slate-600'}`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<string>('home'); 
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardName, setCardName] = useState("");

  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const {data:session} = authClient.useSession()
console.log(session)
  // const [session, setSession] = useState<{ user: { id: string, name: string, email: string } } | null>(null);
  const [userBookings, setUserBookings] = useState<BookingRecord[]>([]);

  const hotels: Hotel[] = useMemo(() => [
    { 
      id: 'h1', name: 'Burj Al Arab Jumeirah', city: 'Dubai', country: 'Förenade Arabemiraten', 
      address: 'Jumeirah St', price: 1250, stars: 5, score: 9.9, reviews: 4500,
      distance: 'Direkt vid stranden',
      description: 'Världens mest luxuösa hotell. Upplev enastående service och arkitektur.',
      amenities: [{ icon: <Wifi size={16} />, label: 'Premium Wifi' }, { icon: <Coffee size={16} />, label: 'Michelin Frukost' }],
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800",
      category: 'Lyx'
    },
    { 
      id: 'h2', name: 'Soneva Jani', city: 'Medhufaru', country: 'Maldiverna', 
      address: 'Noonu Atoll', price: 2100, stars: 5, score: 9.7, reviews: 1100,
      distance: 'Mitt i havet',
      description: 'Over-water villor med egna vattenrutschbanor ner i det turkosa vattnet.',
      amenities: [{ icon: <Waves size={16} />, label: 'Privat Lagun' }, { icon: <Sunrise size={16} />, label: 'All-inclusive' }],
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800",
      category: 'Strand'
    },
    { 
      id: 'h3', name: 'Aman Tokyo', city: 'Tokyo', country: 'Japan', 
      address: 'The Otemachi Tower', price: 850, stars: 5, score: 9.5, reviews: 2300,
      distance: 'Hjärtat av Otemachi',
      description: 'En minimalistisk oas högt ovanför Tokyos livliga gator.',
      amenities: [{ icon: <Wind size={16} />, label: 'Zen Garden' }, { icon: <Coffee size={16} />, label: 'Spa' }],
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800",
      category: 'Stad'
    },
    { 
      id: 'h4', name: 'The Plaza Hotel', city: 'New York', country: 'USA', 
      address: '768 5th Ave', price: 720, stars: 5, score: 9.3, reviews: 5800,
      distance: 'Vid Central Park',
      description: 'En ikonisk destination för lyx och elegans på Manhattan.',
      amenities: [{ icon: <Star size={16} />, label: 'Betjänt' }, { icon: <MapPin size={16} />, label: 'Centralt' }],
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800",
      category: 'Stad'
    },
    { 
      id: 'h5', name: 'Icehotel Jukkasjärvi', city: 'Kiruna', country: 'Sverige', 
      address: 'Marknadsvägen 63', price: 450, stars: 4, score: 9.2, reviews: 3200,
      distance: 'Vid Torne älv',
      description: 'Världens första hotell byggt av is och snö. En magisk arktisk upplevelse.',
      amenities: [{ icon: <Snowflake size={16} />, label: 'Is-svit' }, { icon: <Wind size={16} />, label: 'Termisk sovsäck' }],
      image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=800",
      category: 'Äventyr'
    },
    { 
      id: 'h6', name: 'Marina Bay Sands', city: 'Singapore', country: 'Singapore', 
      address: '10 Bayfront Ave', price: 680, stars: 5, score: 9.4, reviews: 12400,
      distance: 'Marina Bay Waterfront',
      description: 'Världens mest kända infinitypool med utsikt över Singapores skyline.',
      amenities: [{ icon: <Waves size={16} />, label: 'Infinity Pool' }, { icon: <Building size={16} />, label: 'Kasino' }],
      image: "https://images.unsplash.com/photo-1527786357421-8144ab7cc765?auto=format&fit=crop&q=80&w=800",
      category: 'Stad'
    },
    { 
      id: 'h7', name: 'Four Seasons Bora Bora', city: 'Bora Bora', country: 'Franska Polynesien', 
      address: 'Motu Tehotu', price: 1850, stars: 5, score: 9.8, reviews: 1800,
      distance: 'Privat ö',
      description: 'Exklusiva bungalows över vattnet med utsikt över berget Otemanu.',
      amenities: [{ icon: <Waves size={16} />, label: 'Lagun-vy' }, { icon: <Coffee size={16} />, label: 'Privat kock' }],
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
      category: 'Strand'
    },
    { 
      id: 'h8', name: 'Grand Hotel Tremezzo', city: 'Como', country: 'Italien', 
      address: 'Via Regina 8', price: 950, stars: 5, score: 9.6, reviews: 2900,
      distance: 'Vid Comosjön',
      description: 'En tidlös symbol för italiensk elegans med flytande pooler i sjön.',
      amenities: [{ icon: <TreePine size={16} />, label: 'Botanisk trädgård' }, { icon: <Waves size={16} />, label: 'Sjöutsikt' }],
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
      category: 'Romantik'
    },
    { 
      id: 'h9', name: 'Post Ranch Inn', city: 'Big Sur', country: 'USA', 
      address: 'Highway 1', price: 1400, stars: 5, score: 9.5, reviews: 900,
      distance: 'Klippkant mot Stilla havet',
      description: 'Prisbelönt arkitektur som smälter samman med naturen på Big Surs klippor.',
      amenities: [{ icon: <Mountain size={16} />, label: 'Naturstigar' }, { icon: <Star size={16} />, label: 'Stjärnskådning' }],
      image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=800",
      category: 'Natur'
    },
    { 
      id: 'h10', name: 'Belmond Hotel Splendido', city: 'Portofino', country: 'Italien', 
      address: 'Salita San Giorgio', price: 1150, stars: 5, score: 9.7, reviews: 1500,
      distance: 'Ovanför Portofino hamn',
      description: 'Ett gammalt kloster förvandlat till en sofistikerad tillflyktsort för eliten.',
      amenities: [{ icon: <Globe size={16} />, label: 'Historisk guide' }, { icon: <Coffee size={16} />, label: 'Vinterträdgård' }],
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800",
      category: 'Lyx'
    }
  ], []);

  const filteredHotels = useMemo(() => {
    return hotels.filter(h => 
      h.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, hotels]);

  const selectedHotel = hotels.find(h => h.id === selectedHotelId);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const nameFromEmail = loginEmail.split('@')[0];
      // // setSession({ 
      //   user: { 
      //     id: "user_" + Math.random().toString(36).substr(2, 9), 
      //     name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1), 
      //     email: loginEmail 
      //   } 
      // });
      setIsSubmitting(false);
      setView('rooms');
      setLoginEmail("");
      setLoginPassword("");
    }, 1200);
  };

  const handleBookingClick = (id: string) => {
    if (!session) {
      setView('login');
      return;
    }
    setSelectedHotelId(id);
    setView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPayment = () => {
    if (!selectedDate) return;
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finalizePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel || !session || !selectedDate) return;
    setIsSubmitting(true);
    const newBooking: BookingRecord = {
      id: `RESO-${Math.floor(Math.random() * 100000)}`,
      hotelId: selectedHotel.id,
      hotel: selectedHotel,
      date: selectedDate,
      totalPrice: selectedHotel.price,
      userId: session.user.id,
      status: 'Bekräftad',
      createdAt: new Date()
    };
    setTimeout(() => {
      setUserBookings(prev => [newBooking, ...prev]);
      setIsSubmitting(false);
      setView('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const cancelBooking = async (id: string) => {
    setUserBookings(prev => prev.filter(b => b.id !== id));
  };

  const CheckoutSteps = ({ activeStep }: { activeStep: number }) => (
    <div className="flex items-center justify-center gap-4 mb-12">
      {[ { l: 'Detaljer', s: 1 }, { l: 'Betalning', s: 2 }, { l: 'Klart', s: 3 }].map((step, i) => (
        <React.Fragment key={step.s}>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${activeStep >= step.s ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
              {activeStep > step.s ? <CheckCircle size={16} /> : step.s}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${activeStep >= step.s ? 'text-slate-800' : 'text-slate-400'}`}>{step.l}</span>
          </div>
          {i < 2 && <div className={`h-[2px] w-12 rounded-full ${activeStep > step.s ? 'bg-amber-500' : 'bg-slate-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  if (view === 'home') {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-8 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
             <div className="bg-amber-500 p-2 rounded-xl"><Bed size={20} className="text-white" /></div>
             <span className="text-2xl font-black italic tracking-tighter">RESOBOOKNING</span>
          </div>
          <div className="flex gap-4">
              <button onClick={() => setView(session ? 'my-bookings' : 'login')} className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/20">
                  {session ? 'Mina Resor' : 'Logga In'}
              </button>
          </div>
        </nav>

        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920" 
               className="w-full h-full object-cover scale-105" 
               alt="Resebakgrund"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-white"></div>
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-5xl">
            <span className="inline-block bg-amber-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-6 shadow-xl">Upptäck Världen</span>
            <h1 className="text-7xl md:text-[9rem] font-black text-white leading-[0.85] tracking-tighter italic mb-10 drop-shadow-2xl">
              Ditt nästa <br/> <span className="text-amber-500">Äventyr</span>
            </h1>
            <button onClick={() => setView('rooms')} className="bg-white text-slate-950 px-12 py-6 rounded-full font-black text-xl hover:bg-amber-500 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-4 mx-auto">
                Se Hotell & Destinationer <ArrowRight size={24} />
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <nav className="bg-slate-950 text-white px-6 md:px-20 py-6 flex justify-between items-center sticky top-0 z-[60] shadow-2xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-amber-500 p-2 rounded-xl"><Bed size={20} className="text-white" /></div>
          <span className="text-xl font-black italic tracking-tighter">RESOBOOKNING</span>
        </div>
        <div className="flex gap-6 items-center">
          <button onClick={() => setView('my-bookings')} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <Clock size={16} /> Historik
          </button>
          {session ? (
            <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-[10px] font-black">{session.user.name[0]}</div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{session.user.name}</span>
              <button onClick={() => authClient.signOut()} className="text-slate-500 hover:text-red-400"><LogOut size={16} /></button>
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-white text-slate-950 px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-amber-500 transition-all">Logga in</button>
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-10 w-full flex-grow flex flex-col">
        
        {view === 'login' && (
          <div className="flex-grow flex items-center justify-center py-10">
            <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
              <div className="text-center mb-10">
                <div className="bg-amber-500 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-200">
                  <Lock className="text-white" size={28} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter mb-2">Välkommen <span className="text-amber-500">Tillbaka</span></h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Logga in för att hantera dina resor</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">E-postadress</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="namn@epost.se"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-amber-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Lösenord</label>
                  <div className="relative">
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-amber-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <input 
                      required
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-amber-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-6 bg-slate-950 text-white rounded-full font-black text-xl hover:bg-amber-500 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Logga In <ArrowRight /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {view === 'rooms' && (
          <>
            <div className="mb-12">
               <h2 className="text-5xl font-black italic tracking-tighter mb-8 text-center md:text-left">Hitta ditt <span className="text-amber-500">Boende</span></h2>
               <section className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center">
                <div className="flex-grow relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    className="w-full pl-16 pr-6 py-6 bg-slate-50 border-none rounded-[2rem] outline-none text-sm font-bold"
                    placeholder="Vart vill du resa? Skriv stad eller hotell..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </section>
            </div>

            <div className="grid gap-10 lg:grid-cols-1 pb-20">
              {filteredHotels.length > 0 ? filteredHotels.map(hotel => (
                <div key={hotel.id} className="bg-white rounded-[3rem] p-6 md:p-8 flex flex-col lg:flex-row gap-10 shadow-xl border border-slate-100 group transition-all hover:shadow-2xl">
                  <div className="lg:w-[400px] h-[300px] relative rounded-[2.5rem] overflow-hidden flex-shrink-0">
                    <img src={hotel.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={hotel.name} />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-3xl font-black tracking-tight text-slate-900">{hotel.name}</h3>
                        <div className="bg-slate-900 text-white px-3 py-1 rounded-xl font-black text-xs flex items-center gap-1">
                          <Star size={12} className="fill-amber-500 text-amber-500" /> {hotel.score}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-4 uppercase tracking-widest">
                        <MapPin size={14} className="text-amber-500" /> {hotel.city}, {hotel.country}
                      </div>
                      <p className="text-slate-500 font-medium leading-relaxed mb-6">{hotel.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.map((am, idx) => (
                           <span key={idx} className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
                             {am.icon} {am.label}
                           </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                      <div className="text-3xl font-black text-slate-950">{hotel.price} € <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/ natt</span></div>
                      <button onClick={() => handleBookingClick(hotel.id)} className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-amber-500 transition-all active:scale-95 shadow-lg flex items-center gap-2">Välj destination <ArrowRight size={18}/></button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                  <Camera size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-black italic">Inga resultat matchade din sökning.</p>
                </div>
              )}
            </div>
          </>
        )}

        {view === 'details' && (
          <div className="max-w-4xl mx-auto w-full">
            <CheckoutSteps activeStep={1} />
            <div className="grid md:grid-cols-2 gap-12 bg-white p-10 rounded-[4rem] shadow-2xl border border-slate-100">
              <div className="space-y-6">
                <h2 className="text-3xl font-black italic tracking-tighter mb-4">Ankomstdatum</h2>
                <CustomCalendar selected={selectedDate} onSelect={setSelectedDate} />
              </div>
              <div className="space-y-8 flex flex-col justify-between">
                <div>
                    <h2 className="text-3xl font-black italic tracking-tighter mb-6">Din Summering</h2>
                    <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                       <div className="flex items-center gap-4">
                         <img src={selectedHotel?.image} className="w-16 h-16 rounded-2xl object-cover" />
                         <div>
                           <p className="font-black text-slate-800">{selectedHotel?.name}</p>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedHotel?.city}</p>
                         </div>
                       </div>
                       <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Totalpris</span>
                         <span className="text-4xl font-black text-slate-900">{selectedHotel?.price} €</span>
                       </div>
                    </div>
                </div>
                <button 
                  onClick={goToPayment} 
                  disabled={!selectedDate}
                  className={`w-full py-6 rounded-full font-black text-xl transition-all shadow-xl flex justify-center items-center gap-3 ${selectedDate ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-100 text-slate-300'}`}
                >
                  Fortsätt till betalning <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'checkout' && (
          <div className="max-w-4xl mx-auto w-full">
            <CheckoutSteps activeStep={2} />
            <div className="grid lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3 space-y-8">
                <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="text-amber-500" size={18} />
                    <h2 className="font-black text-xl italic tracking-tighter uppercase">Kortuppgifter</h2>
                  </div>
                  <form onSubmit={finalizePayment} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Namn på kortet</label>
                      <input required className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-amber-500 transition-all" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="T.ex. Rei Taho" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Kortnummer</label>
                      <input required className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-amber-500 transition-all" maxLength={19} value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} placeholder="XXXX XXXX XXXX XXXX" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Giltig till</label>
                        <input required className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-amber-500 transition-all" maxLength={5} value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/ÅÅ" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">CVC</label>
                        <input required className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-amber-500 transition-all" maxLength={3} value={cardCVC} onChange={(e) => setCardCVC(e.target.value)} placeholder="XXX" />
                      </div>
                    </div>
                    <button disabled={isSubmitting} className="w-full mt-6 py-6 bg-slate-950 text-white rounded-full font-black text-xl hover:bg-amber-500 transition-all flex items-center justify-center gap-4 shadow-xl">
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Betala {selectedHotel?.price} € <ShieldCheck /></>
                      )}
                    </button>
                  </form>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="sticky top-32 space-y-6">
                  <div className="aspect-[1.6/1] w-full bg-gradient-to-br from-slate-800 to-slate-950 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-8 opacity-20"><CardIcon size={120} /></div>
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="w-12 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center border border-amber-500/50">
                        <div className="w-8 h-6 bg-amber-500/40 rounded shadow-inner" />
                      </div>
                      <div className="font-black italic text-sm tracking-tighter">RESO CARD</div>
                    </div>
                    <div className="relative z-10 space-y-1">
                      <div className="text-xl font-mono tracking-[0.2em]">{cardNumber || "•••• •••• •••• ••••"}</div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Innehavare</p>
                          <p className="text-xs font-black uppercase tracking-widest">{cardName || "Ditt Namn"}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Valid</p>
                          <p className="text-xs font-black">{cardExpiry || "MM/ÅÅ"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'my-bookings' && (
          <div>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-6xl font-black tracking-tighter italic">Mina <span className="text-amber-500">Resor</span></h2>
              <button onClick={() => setView('rooms')} className="bg-slate-100 text-slate-600 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                <ArrowRight className="rotate-180" size={14} /> Fler hotell
              </button>
            </div>
            {userBookings.length === 0 ? (
              <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-slate-200">
                <h3 className="text-2xl font-black text-slate-400 italic">Inga planerade resor än.</h3>
              </div>
            ) : (
              <div className="grid gap-6">
                {userBookings.map(booking => (
                  <div key={booking.id} className="bg-white rounded-[3rem] p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl transition-all">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0">
                      <img src={booking.hotel.image} className="w-full h-full object-cover" alt={booking.hotel.name} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Bekräftad</span>
                        <span className="text-slate-300 font-bold text-[10px] font-mono tracking-widest">ID: {booking.id}</span>
                      </div>
                      <h4 className="text-2xl font-black tracking-tight">{booking.hotel.name}</h4>
                      <p className="text-slate-400 font-bold flex items-center gap-2 mt-1 text-sm">
                        <CalendarIcon size={14} className="text-amber-500" /> {booking.date.toLocaleDateString('sv-SE', { dateStyle: 'full' })}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-3">
                        <span className="text-2xl font-black text-slate-950">{booking.totalPrice} €</span>
                        <button onClick={() => cancelBooking(booking.id)} className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl">
                          <Trash2 size={12} /> Avboka
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'success' && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <CheckoutSteps activeStep={3} />
            <div className="w-32 h-32 bg-green-500 text-white rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-12">
              <CheckCircle size={64} />
            </div>
            <h2 className="text-5xl font-black mb-4 tracking-tighter italic">Betalningen Lyckades!</h2>
            <p className="text-slate-500 font-medium text-lg mb-10">Ditt kvitto har skickats till din e-post.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setView('my-bookings')} className="bg-slate-950 text-white px-10 py-6 rounded-full font-black text-lg hover:bg-amber-500 transition-all shadow-xl">Se min historik</button>
              <button onClick={() => setView('rooms')} className="bg-white border-2 border-slate-100 px-10 py-6 rounded-full font-black text-lg hover:bg-slate-50 transition-all">Gå till hem</button>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-white border-t border-slate-100 py-10 px-6 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">© 2025 RESOBOOKNING PRO • GLOBAL TRAVEL SYSTEMS</p>
      </footer>
    </div>
  );
}