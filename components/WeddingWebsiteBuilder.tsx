import React, { useState } from 'react';
import { 
  Layout, Type, Image as ImageIcon, Globe, Settings, 
  Eye, Check, Save, ExternalLink, Smartphone, Monitor
} from 'lucide-react';
import { WeddingWebsite, WebsiteTheme, WebsitePage } from '../types';
import { MOCK_WEBSITE, MOCK_THEMES, updateWebsite } from '../services/websiteService';
import { PublicWebsite } from './PublicWebsite';

export const WeddingWebsiteBuilder: React.FC = () => {
  const [website, setWebsite] = useState<WeddingWebsite>(MOCK_WEBSITE);
  const [activeTab, setActiveTab] = useState<'content' | 'theme' | 'settings'>('content');
  const [activePageId, setActivePageId] = useState<string>('page-home');
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const handleSave = () => {
    // Simulate save
    alert('Website saved successfully!');
  };

  const handlePublish = () => {
    setWebsite(prev => ({ ...prev, isPublished: !prev.isPublished }));
  };

  const currentTheme = MOCK_THEMES.find(t => t.id === website.theme.id) || MOCK_THEMES[0];
  const activePage = website.pages.find(p => p.id === activePageId);

  // If preview mode is active, show the PublicWebsite component in a modal/overlay
  if (showPreview) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col">
         {/* Preview Toolbar */}
         <div className="bg-slate-800 text-white p-4 flex justify-between items-center border-b border-slate-700">
             <div className="flex items-center gap-4">
                <h3 className="font-bold">Website Preview</h3>
                <div className="flex bg-slate-700 rounded-lg p-1">
                    <button 
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                       <Monitor size={18} />
                    </button>
                    <button 
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                       <Smartphone size={18} />
                    </button>
                </div>
             </div>
             <button 
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-100"
             >
                Close Preview
             </button>
         </div>
         
         {/* Preview Container */}
         <div className="flex-1 overflow-auto flex justify-center p-8">
             <div 
                className={`bg-white shadow-2xl transition-all duration-300 ${
                  previewDevice === 'mobile' 
                  ? 'w-[375px] h-[812px] rounded-3xl border-8 border-slate-800 overflow-hidden' 
                  : 'w-full max-w-[1400px] h-full rounded-xl overflow-y-auto'
                }`}
             >
                <PublicWebsite website={website} />
             </div>
         </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* LEFT: Builder Controls */}
      <div className="w-1/3 min-w-[320px] flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
         {/* Builder Header */}
         <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
               <h2 className="font-bold text-slate-800">Website Builder</h2>
               <p className="text-xs text-slate-500">{website.subdomain}.ariawed.com</p>
            </div>
            <div className="flex gap-2">
               <button onClick={handleSave} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Save">
                  <Save size={18} />
               </button>
               <button onClick={() => setShowPreview(true)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Preview">
                  <Eye size={18} />
               </button>
            </div>
         </div>

         {/* Tabs */}
         <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'content' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Content
            </button>
            <button 
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'theme' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Theme
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settings' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Settings
            </button>
         </div>

         {/* Content Area */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* --- CONTENT TAB --- */}
            {activeTab === 'content' && (
               <div className="space-y-6">
                  {/* Global Fields */}
                  <div className="space-y-4 pb-6 border-b border-slate-100">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">General Info</h3>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Couple Names</label>
                        <input 
                           type="text" 
                           value={website.coupleNames}
                           onChange={(e) => setWebsite(prev => ({...prev, coupleNames: e.target.value}))}
                           className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Wedding Date</label>
                        <input 
                           type="date" 
                           value={website.weddingDate}
                           onChange={(e) => setWebsite(prev => ({...prev, weddingDate: e.target.value}))}
                           className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                     </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hero Image URL</label>
                        <div className="flex gap-2">
                           <input 
                              type="text" 
                              value={website.heroImageUrl}
                              onChange={(e) => setWebsite(prev => ({...prev, heroImageUrl: e.target.value}))}
                              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm truncate"
                           />
                           <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
                              <ImageIcon size={18} className="text-slate-500" />
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Page Selector */}
                  <div>
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Pages</h3>
                     <div className="flex flex-wrap gap-2 mb-4">
                        {website.pages.map(page => (
                           <button
                              key={page.id}
                              onClick={() => setActivePageId(page.id)}
                              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                                 activePageId === page.id 
                                 ? 'bg-slate-800 text-white border-slate-800' 
                                 : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                              }`}
                           >
                              {page.title}
                           </button>
                        ))}
                     </div>

                     {/* Active Page Editor */}
                     {activePage && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4 animate-in fade-in">
                           <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-700">{activePage.title} Page</span>
                              <label className="flex items-center gap-2 cursor-pointer">
                                 <input 
                                    type="checkbox" 
                                    checked={activePage.isEnabled}
                                    onChange={(e) => {
                                       const newPages = website.pages.map(p => 
                                          p.id === activePage.id ? { ...p, isEnabled: e.target.checked } : p
                                       );
                                       setWebsite(prev => ({ ...prev, pages: newPages }));
                                    }}
                                    className="rounded text-rose-500 focus:ring-rose-500"
                                 />
                                 <span className="text-xs font-medium text-slate-600">Enabled</span>
                              </label>
                           </div>

                           <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Page Title</label>
                              <input 
                                 type="text" 
                                 value={activePage.title}
                                 onChange={(e) => {
                                    const newPages = website.pages.map(p => 
                                       p.id === activePage.id ? { ...p, title: e.target.value } : p
                                    );
                                    setWebsite(prev => ({ ...prev, pages: newPages }));
                                 }}
                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                              />
                           </div>

                           <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Main Content</label>
                              <textarea 
                                 rows={6}
                                 value={activePage.content}
                                 onChange={(e) => {
                                    const newPages = website.pages.map(p => 
                                       p.id === activePage.id ? { ...p, content: e.target.value } : p
                                    );
                                    setWebsite(prev => ({ ...prev, pages: newPages }));
                                 }}
                                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                              />
                           </div>
                           
                           {/* Specific fields based on page type could go here (e.g., FAQ inputs) */}
                        </div>
                     )}
                  </div>
               </div>
            )}

            {/* --- THEME TAB --- */}
            {activeTab === 'theme' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Select Theme</h3>
                     <div className="grid grid-cols-2 gap-3">
                        {MOCK_THEMES.map(theme => (
                           <div 
                              key={theme.id}
                              onClick={() => setWebsite(prev => ({ ...prev, theme }))}
                              className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                                 website.theme.id === theme.id ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-200 hover:border-slate-300'
                              }`}
                           >
                              <div className="h-20 bg-slate-100 relative">
                                 {theme.backgroundImage && (
                                    <img src={theme.backgroundImage} alt="bg" className="w-full h-full object-cover opacity-50" />
                                 )}
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <span 
                                       className="text-lg font-bold" 
                                       style={{ fontFamily: theme.fontHeading.split(',')[0], color: theme.primaryColor }}
                                    >
                                       Aa
                                    </span>
                                 </div>
                              </div>
                              <div className="p-2 text-center text-xs font-bold text-slate-600 bg-white">
                                 {theme.name}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Customize</h3>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1">Primary Color</label>
                           <div className="flex items-center gap-2">
                              <input 
                                 type="color" 
                                 value={website.theme.primaryColor}
                                 onChange={(e) => setWebsite(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: e.target.value } }))}
                                 className="w-8 h-8 rounded-lg cursor-pointer border-none p-0"
                              />
                              <span className="text-xs text-slate-500 uppercase">{website.theme.primaryColor}</span>
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 mb-1">Secondary Color</label>
                           <div className="flex items-center gap-2">
                              <input 
                                 type="color" 
                                 value={website.theme.secondaryColor}
                                 onChange={(e) => setWebsite(prev => ({ ...prev, theme: { ...prev.theme, secondaryColor: e.target.value } }))}
                                 className="w-8 h-8 rounded-lg cursor-pointer border-none p-0"
                              />
                              <span className="text-xs text-slate-500 uppercase">{website.theme.secondaryColor}</span>
                           </div>
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Heading Font</label>
                        <select 
                           value={website.theme.fontHeading}
                           onChange={(e) => setWebsite(prev => ({ ...prev, theme: { ...prev.theme, fontHeading: e.target.value } }))}
                           className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                        >
                           <option value="Merriweather, serif">Merriweather (Serif)</option>
                           <option value="Playfair Display, serif">Playfair Display (Serif)</option>
                           <option value="Cinzel, serif">Cinzel (Display)</option>
                           <option value="Inter, sans-serif">Inter (Sans)</option>
                           <option value="Lato, sans-serif">Lato (Sans)</option>
                        </select>
                     </div>
                  </div>
               </div>
            )}

            {/* --- SETTINGS TAB --- */}
            {activeTab === 'settings' && (
               <div className="space-y-6">
                  <div>
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Domain</h3>
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Subdomain</label>
                        <div className="flex items-center">
                           <input 
                              type="text" 
                              value={website.subdomain}
                              onChange={(e) => setWebsite(prev => ({...prev, subdomain: e.target.value}))}
                              className="flex-1 px-3 py-2 border border-slate-200 rounded-l-lg text-sm text-right"
                           />
                           <span className="bg-slate-200 border border-l-0 border-slate-200 px-3 py-2 rounded-r-lg text-sm text-slate-600">
                              .ariawed.com
                           </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                           Your site will be live at: <a href="#" className="text-rose-600 hover:underline">{website.subdomain}.ariawed.com</a>
                        </p>
                     </div>
                  </div>

                  <div>
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Visibility</h3>
                     <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                        <div>
                           <div className="font-bold text-slate-800">Publish Website</div>
                           <p className="text-xs text-slate-500">Make your site visible to guests</p>
                        </div>
                        <button 
                           onClick={handlePublish}
                           className={`w-12 h-6 rounded-full transition-colors relative ${website.isPublished ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                           <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${website.isPublished ? 'left-7' : 'left-1'}`} />
                        </button>
                     </div>
                  </div>
                  
                  {/* QR Code Placeholder */}
                  <div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Photo Upload QR</h3>
                      <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-4">
                          <div className="w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                              <ExternalLink />
                          </div>
                          <div className="flex-1">
                              <p className="font-bold text-slate-800">Guest Photo Upload</p>
                              <p className="text-xs text-slate-500 mb-2">Guests scan this to upload photos.</p>
                              <button className="text-rose-600 text-xs font-bold hover:underline">Download QR Code</button>
                          </div>
                      </div>
                  </div>
               </div>
            )}
         </div>
      </div>

      {/* RIGHT: Live Preview (Desktop view scaled down) */}
      <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner flex flex-col overflow-hidden relative group">
         <div className="bg-white border-b border-slate-200 p-2 flex items-center justify-between">
            <div className="flex gap-1.5 ml-2">
               <div className="w-3 h-3 rounded-full bg-red-400" />
               <div className="w-3 h-3 rounded-full bg-yellow-400" />
               <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="bg-slate-100 px-4 py-1 rounded-md text-xs text-slate-500 flex items-center gap-2">
               <Globe size={12} />
               {website.subdomain}.ariawed.com
            </div>
            <div className="w-12" />
         </div>
         
         <div className="flex-1 overflow-y-auto bg-white scrollbar-hide">
            <PublicWebsite website={website} />
         </div>

         <button 
            onClick={() => setShowPreview(true)}
            className="absolute bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
         >
            <Eye size={16} /> Full Screen Preview
         </button>
      </div>
    </div>
  );
};
