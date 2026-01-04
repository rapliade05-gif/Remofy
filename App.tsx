
import React, { useState, useEffect } from 'react';
import { fetchStoreData } from './services/geminiService';
import { StoreDetails, AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isLoading: true,
    error: null,
    store: null,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchStoreData();
        setState({ isLoading: false, error: null, store: data });
      } catch (err: any) {
        setState({ isLoading: false, error: err.message, store: null });
      }
    };
    init();
  }, []);

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold text-slate-800 animate-pulse">Menyiapkan Website Anda...</h2>
        <p className="text-slate-500 mt-2">Mengambil data terbaru dari Google Maps</p>
      </div>
    );
  }

  if (state.error || !state.store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center">
          <i className="fa-solid fa-triangle-exclamation text-5xl text-red-500 mb-6"></i>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ups! Terjadi Kesalahan</h2>
          <p className="text-slate-600 mb-8">{state.error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const { store } = state;

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-shop"></i>
            </div>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {store.name}
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8 font-medium text-slate-600">
            <a href="#about" className="hover:text-indigo-600 transition-colors">Tentang Kami</a>
            <a href="#location" className="hover:text-indigo-600 transition-colors">Lokasi</a>
            <a href="#contact" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md">Hubungi Kami</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span>{store.category}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-slate-900">
              {store.name} <br />
              <span className="text-indigo-600">Pelayanan Terbaik</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
              {store.summary}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#location" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-3">
                <i className="fa-solid fa-map-location-dot"></i>
                <span>Lihat Lokasi</span>
              </a>
              <a href={store.mapUri} target="_blank" className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center space-x-3">
                <i className="fa-solid fa-route"></i>
                <span>Petunjuk Arah</span>
              </a>
            </div>
            
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-1">
                <i className="fa-solid fa-star text-yellow-400"></i>
                <span className="font-bold text-slate-900">{store.rating || 'N/A'}</span>
                <span className="text-slate-400 text-sm">({store.user_ratings_total || 0} Ulasan)</span>
              </div>
              <div className="w-px h-4 bg-slate-200"></div>
              <div className="flex items-center space-x-2 text-green-600 font-semibold text-sm">
                <i className="fa-solid fa-circle-check"></i>
                <span>Terverifikasi di Maps</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in animation-delay-300">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-10"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80" 
                alt="Store Interior" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Alamat Kami</h3>
                    <p className="text-slate-600 text-sm mt-1">{store.address}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-location-arrow"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Mengapa Memilih Kami?</h2>
            <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: "fa-thumbs-up", title: "Kualitas Terjamin", desc: "Produk dan layanan kami melewati kontrol kualitas yang ketat untuk kepuasan pelanggan." },
              { icon: "fa-handshake", title: "Pelayanan Ramah", desc: "Tim kami siap melayani Anda dengan senyum dan bantuan profesional setiap saat." },
              { icon: "fa-tag", title: "Harga Kompetitif", desc: "Dapatkan penawaran terbaik dengan harga yang bersahabat untuk kantong Anda." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-8">
                  <i className={`fa-solid ${feature.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {store.reviews && store.reviews.length > 0 && (
        <section className="py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Apa Kata Pelanggan?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {store.reviews.map((rev, i) => (
                <div key={i} className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex text-yellow-400 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <i key={j} className={`fa-solid fa-star text-sm ${j < (rev.rating || 5) ? 'text-yellow-400' : 'text-slate-200'}`}></i>
                      ))}
                    </div>
                    <p className="text-slate-600 italic">"{rev.text}"</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                      {rev.author[0]}
                    </div>
                    <span className="font-bold text-slate-900">{rev.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location & Contact Section */}
      <section id="location" className="py-24 bg-slate-900 text-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-8">Kunjungi Kami</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Alamat</h4>
                  <p className="text-slate-400 mt-1">{store.address}</p>
                </div>
              </div>
              
              {store.opening_hours && (
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-indigo-400">Jam Buka</h4>
                    <ul className="text-slate-400 mt-2 space-y-1 text-sm">
                      {store.opening_hours.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-12 p-8 bg-indigo-600 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Butuh Bantuan?</p>
                <h3 className="text-2xl font-bold">Hubungi Kami Sekarang</h3>
              </div>
              <a href={`tel:${store.phone || '#'}`} className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center space-x-2">
                <i className="fa-solid fa-phone"></i>
                <span>Hubungi Sekarang</span>
              </a>
            </div>
          </div>
          
          <div className="h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 border-4 border-white/5">
            <iframe 
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.API_KEY}&q=${encodeURIComponent(store.address)}`}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <i className="fa-solid fa-shop text-xs"></i>
            </div>
            <span className="text-xl font-bold text-slate-900">{store.name}</span>
          </div>
          <div className="flex items-center space-x-8 text-slate-500 text-sm font-medium">
            <a href="#" className="hover:text-indigo-600">Beranda</a>
            <a href="#about" className="hover:text-indigo-600">Tentang</a>
            <a href="#location" className="hover:text-indigo-600">Kontak</a>
          </div>
          <div className="text-slate-400 text-sm">
            © 2024 {store.name}. Dipersembahkan oleh AI.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
