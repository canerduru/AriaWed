import React, { useState } from 'react';
import { 
  Palette, Layout, Wand2, Upload, Plus, Heart, 
  Download, Share2, Sparkles, RefreshCw, Layers, Image as ImageIcon 
} from 'lucide-react';
import { ColorPalette, MoodBoardItem, DesignStyle, AiRenderResult } from '../types';
import { MOCK_PALETTES, MOCK_MOOD_BOARD, generateAiRender, generatePaletteFromAI } from '../services/designService';

type Tab = 'moodboard' | 'palette' | 'ai-render' | 'design-library';

export const CreativeStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('moodboard');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-serif">Creative Studio</h2>
          <p className="text-slate-500">Visualize your dream wedding with AI and design tools.</p>
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex overflow-x-auto max-w-full">
           {[
             { id: 'moodboard', label: 'Mood Board', icon: Layout },
             { id: 'palette', label: 'Color Palette', icon: Palette },
             { id: 'ai-render', label: 'AI Venue Render', icon: Wand2 },
             { id: 'design-library', label: 'Design Library', icon: Layers },
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as Tab)}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                 activeTab === tab.id 
                 ? 'bg-rose-500 text-white shadow-md' 
                 : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
               }`}
             >
               <tab.icon size={16} />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'moodboard' && <MoodBoardView />}
        {activeTab === 'palette' && <PaletteView />}
        {activeTab === 'ai-render' && <AiRenderView />}
        {activeTab === 'design-library' && <DesignLibraryView />}
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const MoodBoardView: React.FC = () => {
  const [pins, setPins] = useState<MoodBoardItem[]>(MOCK_MOOD_BOARD);
  const [filter, setFilter] = useState<string>('All');
  const categories = ['All', 'Ceremony', 'Reception', 'Flowers', 'Attire', 'Cake'];

  const filteredPins = filter === 'All' ? pins : pins.filter(p => p.category === filter);

  return (
    <div className="space-y-6">
       {/* Toolbar */}
       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
             {categories.map(cat => (
               <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === cat ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
               >
                 {cat}
               </button>
             ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors">
             <Plus size={16} /> Add Pin
          </button>
       </div>

       {/* Grid */}
       <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredPins.map(pin => (
            <div key={pin.id} className="break-inside-avoid bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
               <div className="relative">
                  <img src={pin.imageUrl} alt={pin.category} className="w-full h-auto" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button className="p-1.5 bg-white/90 rounded-full text-rose-500 hover:bg-white shadow-sm">
                        <Heart size={14} fill={pin.likes > 0 ? "currentColor" : "none"} />
                      </button>
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold uppercase rounded backdrop-blur-sm">
                    {pin.category}
                  </span>
               </div>
               {pin.note && (
                 <div className="p-3 text-xs text-slate-600 italic border-t border-slate-50">
                    "{pin.note}"
                 </div>
               )}
            </div>
          ))}
       </div>
    </div>
  );
};

const PaletteView: React.FC = () => {
  const [palettes, setPalettes] = useState<ColorPalette[]>(MOCK_PALETTES);
  const [activePalette, setActivePalette] = useState<string>(MOCK_PALETTES[0].id);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    const newPalette = await generatePaletteFromAI(aiPrompt);
    setPalettes([newPalette, ...palettes]);
    setActivePalette(newPalette.id);
    setIsGenerating(false);
    setAiPrompt('');
  };

  const selected = palettes.find(p => p.id === activePalette);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       {/* List & Generator */}
       <div className="space-y-6">
          <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                   <Sparkles className="text-rose-400" size={20} /> AI Palette Generator
                 </h3>
                 <p className="text-slate-300 text-sm mb-4">Describe your vibe (e.g., "Tuscan sunset", "Winter wonderland") and let Aria design it.</p>
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Enter a vibe..."
                      className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button 
                      onClick={handleAiGenerate}
                      disabled={isGenerating}
                      className="p-2 bg-rose-500 rounded-lg hover:bg-rose-600 disabled:opacity-50 transition-colors"
                    >
                      {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
                    </button>
                 </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-100 font-bold text-slate-800">Saved Palettes</div>
             <div className="max-h-[400px] overflow-y-auto">
                {palettes.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setActivePalette(p.id)}
                    className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 flex items-center justify-between ${activePalette === p.id ? 'bg-rose-50/50' : ''}`}
                  >
                     <div>
                        <div className="font-medium text-slate-800 text-sm">{p.name}</div>
                        <div className="flex gap-1 mt-2">
                           {p.colors.map(c => (
                             <div key={c} className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                           ))}
                        </div>
                     </div>
                     {activePalette === p.id && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                  </div>
                ))}
             </div>
          </div>
       </div>

       {/* Detail View */}
       <div className="lg:col-span-2">
          {selected && (
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col justify-center">
               <div className="text-center mb-8">
                  <h2 className="text-3xl font-serif font-bold text-slate-800">{selected.name}</h2>
                  <div className="flex justify-center gap-2 mt-2">
                    {selected.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full uppercase tracking-wider font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
               </div>

               <div className="grid grid-cols-5 h-64 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
                  {selected.colors.map((color, idx) => (
                    <div key={idx} className="h-full flex flex-col justify-end items-center pb-4 group relative" style={{ backgroundColor: color }}>
                       <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm">
                         {color}
                       </span>
                    </div>
                  ))}
               </div>

               <div className="mt-8 flex justify-center gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors">
                     <Share2 size={18} /> Share with Vendors
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                     <Download size={18} /> Export PDF
                  </button>
               </div>
            </div>
          )}
       </div>
    </div>
  );
};

const AiRenderView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [style, setStyle] = useState<DesignStyle>('Bohemian');
  const [result, setResult] = useState<AiRenderResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock Upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;
    setIsProcessing(true);
    const res = await generateAiRender(image, style, 'p1'); // p1 is mock palette
    setResult(res);
    setIsProcessing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       {/* Controls */}
       <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
             <div>
               <label className="block text-sm font-bold text-slate-800 mb-2">1. Upload Venue Photo</label>
               <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                  <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  {image ? (
                    <img src={image} alt="Uploaded" className="max-h-32 mx-auto rounded-lg shadow-sm" />
                  ) : (
                    <div className="text-slate-400">
                       <Upload className="mx-auto mb-2" size={32} />
                       <span className="text-sm">Click to upload empty room</span>
                    </div>
                  )}
               </div>
             </div>

             <div>
               <label className="block text-sm font-bold text-slate-800 mb-2">2. Select Design Style</label>
               <select 
                  value={style} 
                  onChange={(e) => setStyle(e.target.value as DesignStyle)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-200"
               >
                  <option value="Bohemian">Bohemian</option>
                  <option value="Classic">Classic</option>
                  <option value="Modern">Modern</option>
                  <option value="Rustic">Rustic</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Garden">Garden</option>
               </select>
             </div>

             <button 
                onClick={handleGenerate}
                disabled={!image || isProcessing}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
             >
                {isProcessing ? (
                   <>
                     <RefreshCw className="animate-spin" /> Designing...
                   </>
                ) : (
                   <>
                     <Wand2 /> Generate Design
                   </>
                )}
             </button>
             
             <p className="text-xs text-center text-slate-400">
               Uses DALL-E 3 technology. Costs 1 credit per render.
             </p>
          </div>
       </div>

       {/* Preview Area */}
       <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl h-[500px] relative flex items-center justify-center">
             {!image && !result && (
               <div className="text-slate-600 flex flex-col items-center">
                  <ImageIcon size={64} className="mb-4 opacity-20" />
                  <p>Upload a photo to start visualizing</p>
               </div>
             )}
             
             {image && !result && !isProcessing && (
               <img src={image} alt="Original" className="w-full h-full object-contain" />
             )}
             
             {isProcessing && (
               <div className="text-center text-white">
                  <div className="relative">
                     <div className="w-16 h-16 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mb-4 mx-auto" />
                     <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-400" size={24} />
                  </div>
                  <p className="text-lg font-medium animate-pulse">AI is transforming your venue...</p>
               </div>
             )}

             {result && (
               <div className="w-full h-full relative group">
                  <img src={result.renderedUrl} alt="Rendered" className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                     AI Render: {result.style}
                  </div>
                  {/* Mock Comparison Slider (Visual only) */}
                  <div className="absolute inset-0 w-1/2 border-r-2 border-white overflow-hidden group-hover:w-0 transition-all duration-700 ease-in-out">
                     <img src={result.originalUrl} alt="Original" className="w-[200%] h-full max-w-none object-cover" />
                     <div className="absolute bottom-4 left-4 bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                       Original
                     </div>
                  </div>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

const DesignLibraryView: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
       {['Modern Invitation', 'Classic Menu', 'Boho Program'].map((item, i) => (
         <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
            <div className="bg-slate-100 rounded-lg aspect-[3/4] mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                   <Layers size={48} />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-rose-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="px-6 py-2 bg-white text-rose-600 rounded-full font-bold text-sm">Customize</button>
                </div>
            </div>
            <h3 className="font-bold text-slate-800">{item}</h3>
            <p className="text-sm text-slate-500">Fully customizable template</p>
         </div>
       ))}
    </div>
  );
};
