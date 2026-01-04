
import React, { useState, useCallback } from 'react';
import { removeBackground } from './services/geminiService';
import { ImageData, ProcessingState } from './types';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [state, setState] = useState<ProcessingState>({
    isProcessing: false,
    error: null,
    resultUrl: null,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSelectedImage({
          base64: base64String,
          mimeType: file.type,
          previewUrl: URL.createObjectURL(file),
        });
        setState({ isProcessing: false, error: null, resultUrl: null });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const result = await removeBackground(selectedImage.base64, selectedImage.mimeType);
      setState({
        isProcessing: false,
        error: null,
        resultUrl: result,
      });
    } catch (err: any) {
      setState({
        isProcessing: false,
        error: err.message || "Failed to process image. Please try again.",
        resultUrl: null,
      });
    }
  };

  const downloadImage = () => {
    if (state.resultUrl) {
      const link = document.createElement('a');
      link.href = state.resultUrl;
      link.download = 'remofy-processed-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Remofy</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Sign In</a>
          </nav>
        </div>
      </header>

      {/* Hero & Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Hapus Background Foto <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Secara Otomatis</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gunakan kekuatan AI untuk menghapus latar belakang gambar apa pun hanya dalam hitungan detik. 
            Cepat, mudah, dan gratis. Cukup unggah foto Anda dan klik generate!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="mb-6">
              <label className="block mb-4 text-center">
                <span className="sr-only">Pilih foto</span>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center">
                    {selectedImage ? (
                      <img 
                        src={selectedImage.previewUrl} 
                        alt="Selected Preview" 
                        className="max-h-64 rounded-lg shadow-md mb-4"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="fa-solid fa-cloud-arrow-up text-4xl text-indigo-400 mb-4 group-hover:scale-110 transition-transform"></i>
                        <p className="text-gray-900 font-semibold mb-1">Klik untuk mengunggah</p>
                        <p className="text-gray-500 text-sm">PNG, JPG, JPEG (Maks. 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </label>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedImage || state.isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center space-x-2 
                ${!selectedImage || state.isProcessing 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-200 hover:scale-[1.02]'}`}
            >
              {state.isProcessing ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Sedang Memproses...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-sparkles"></i>
                  <span>Generate</span>
                </>
              )}
            </button>
            
            {state.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center space-x-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{state.error}</span>
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[400px] flex flex-col items-center justify-center">
            {state.resultUrl ? (
              <div className="w-full h-full flex flex-col items-center">
                <div className="relative group w-full flex justify-center mb-6">
                  {/* Checkerboard background for transparency visualization */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 rounded-xl"></div>
                  <div 
                    className="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100"
                    style={{ backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                  >
                    <img src={state.resultUrl} alt="Result" className="max-h-[350px] relative z-10" />
                  </div>
                </div>
                <div className="w-full flex space-x-4">
                  <button 
                    onClick={downloadImage}
                    className="flex-1 py-3 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="fa-solid fa-download"></i>
                    <span>Download</span>
                  </button>
                  <button 
                    onClick={() => {
                      setState({ isProcessing: false, error: null, resultUrl: null });
                      setSelectedImage(null);
                    }}
                    className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                {state.isProcessing ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                    <p className="text-lg font-medium text-gray-600">AI sedang bekerja keras...</p>
                    <p className="text-sm mt-2">Ini biasanya memakan waktu 5-10 detik</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <i className="fa-solid fa-image text-3xl text-gray-300"></i>
                    </div>
                    <p className="text-lg">Hasil akan muncul di sini</p>
                    <p className="text-sm mt-1">Unggah foto terlebih dahulu</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Feature Highlights */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Kecepatan Kilat</h3>
            <p className="text-gray-500">Proses penghapusan background hanya membutuhkan beberapa detik berkat teknologi Gemini AI.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
              <i className="fa-solid fa-gem"></i>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Kualitas Premium</h3>
            <p className="text-gray-500">AI kami sangat cerdas dalam mendeteksi tepi subjek untuk hasil yang halus dan profesional.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
              <i className="fa-solid fa-lock"></i>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Privasi Terjaga</h3>
            <p className="text-gray-500">Foto Anda diproses dengan aman dan tidak akan disimpan secara permanen di server kami.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">Remofy</span>
          </div>
          <p className="text-gray-500 text-sm">© 2024 Remofy. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-6 md:mt-0 text-gray-400">
            <a href="#" className="hover:text-indigo-600 transition-colors"><i className="fa-brands fa-twitter text-xl"></i></a>
            <a href="#" className="hover:text-indigo-600 transition-colors"><i className="fa-brands fa-instagram text-xl"></i></a>
            <a href="#" className="hover:text-indigo-600 transition-colors"><i className="fa-brands fa-github text-xl"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
