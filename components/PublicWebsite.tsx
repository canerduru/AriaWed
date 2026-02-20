import React from 'react';
import { WeddingWebsite, WebsitePage } from '../types';
import { MapPin, Clock, Heart, Menu, Calendar, User } from 'lucide-react';

interface PublicWebsiteProps {
  website: WeddingWebsite;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({ website }) => {
  const { theme, pages } = website;

  // Font Styles Injection
  const styles = {
    fontFamily: theme.fontBody,
    backgroundColor: theme.backgroundColor,
  };
  
  const headingStyle = {
    fontFamily: theme.fontHeading,
    color: theme.primaryColor,
  };

  const primaryBtnStyle = {
    backgroundColor: theme.primaryColor,
    color: '#fff',
    fontFamily: theme.fontBody,
  };

  // Helper to get page by type
  const getPage = (type: string) => pages.find(p => p.type === type && p.isEnabled);

  const HomePage = getPage('home');
  const StoryPage = getPage('story');
  const EventsPage = getPage('events');
  const TravelPage = getPage('travel');
  const RSVPPage = getPage('rsvp');
  const FAQPage = getPage('faq');

  return (
    <div style={styles} className="min-h-full flex flex-col">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="text-xl font-bold" style={headingStyle}>
          {website.coupleNames}
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
           {pages.filter(p => p.isEnabled).map(page => (
             <a 
               key={page.id} 
               href={`#${page.type}`} 
               className="hover:text-black transition-colors uppercase tracking-wider text-xs"
             >
               {page.title}
             </a>
           ))}
        </div>
        <button className="md:hidden text-slate-800">
           <Menu size={24} />
        </button>
      </nav>

      {/* Hero Section */}
      <header 
        id="home"
        className="relative h-[80vh] flex items-center justify-center text-center bg-slate-900"
      >
        <img 
           src={website.heroImageUrl} 
           alt="Hero" 
           className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 p-6 max-w-2xl mx-auto text-white animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <p className="uppercase tracking-[0.2em] text-sm mb-4">We are getting married</p>
           <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: theme.fontHeading }}>
             {website.coupleNames}
           </h1>
           <div className="flex items-center justify-center gap-4 text-lg md:text-xl font-light mb-8">
              <span>{website.weddingDate}</span>
              <span>•</span>
              <span>Istanbul, Turkey</span>
           </div>
           {RSVPPage && (
             <a 
               href="#rsvp"
               className="inline-block px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform"
               style={primaryBtnStyle}
             >
               RSVP Now
             </a>
           )}
        </div>
      </header>

      {/* Main Content Container */}
      <div className="flex-1">
        
        {/* Welcome / Intro */}
        {HomePage && (
           <section className="py-20 px-6 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6" style={headingStyle}>{HomePage.title}</h2>
              <p className="text-lg leading-relaxed text-slate-600">
                {HomePage.content}
              </p>
           </section>
        )}

        {/* Story */}
        {StoryPage && (
           <section id="story" className="py-20 px-6 bg-white">
              <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                 <div className="order-2 md:order-1">
                    <img 
                      src={StoryPage.images?.[0] || 'https://via.placeholder.com/600x800'} 
                      alt="Our Story" 
                      className="rounded-lg shadow-xl w-full h-[500px] object-cover"
                    />
                 </div>
                 <div className="order-1 md:order-2">
                    <h2 className="text-4xl font-bold mb-6" style={headingStyle}>{StoryPage.title}</h2>
                    <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">
                       {StoryPage.content}
                    </p>
                    <div className="flex gap-2 text-rose-500">
                       <Heart fill="currentColor" />
                    </div>
                 </div>
              </div>
           </section>
        )}

        {/* Events */}
        {EventsPage && (
           <section id="events" className="py-20 px-6" style={{ backgroundColor: theme.secondaryColor + '20' }}>
              <div className="max-w-4xl mx-auto text-center">
                 <h2 className="text-4xl font-bold mb-12" style={headingStyle}>{EventsPage.title}</h2>
                 
                 <div className="grid md:grid-cols-2 gap-8">
                    {/* Ceremony */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
                       <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-slate-800">The Ceremony</h3>
                       <div className="space-y-4 text-slate-600">
                          <div className="flex flex-col items-center gap-2">
                             <Calendar className="text-rose-500" size={24} />
                             <span className="font-medium">{website.weddingDate}</span>
                             <span>{EventsPage.meta?.ceremonyTime || '15:30'}</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                             <MapPin className="text-rose-500" size={24} />
                             <span className="font-medium">{EventsPage.meta?.ceremonyLocation || 'Main Venue'}</span>
                             <span className="text-sm">Sariyer, Istanbul</span>
                          </div>
                       </div>
                    </div>

                    {/* Reception */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
                       <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-slate-800">The Reception</h3>
                       <div className="space-y-4 text-slate-600">
                          <div className="flex flex-col items-center gap-2">
                             <Clock className="text-rose-500" size={24} />
                             <span className="font-medium">{EventsPage.meta?.receptionTime || '17:30'}</span>
                             <span>Until late</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                             <MapPin className="text-rose-500" size={24} />
                             <span className="font-medium">{EventsPage.meta?.receptionLocation || 'Ballroom'}</span>
                             <span className="text-sm">Dinner & Dancing</span>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="mt-12 text-slate-600 max-w-2xl mx-auto">
                    {EventsPage.content}
                 </div>
              </div>
           </section>
        )}

        {/* Travel */}
        {TravelPage && (
          <section id="travel" className="py-20 px-6 bg-white">
             <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8" style={headingStyle}>{TravelPage.title}</h2>
                <div className="prose prose-slate mx-auto">
                   <p>{TravelPage.content}</p>
                   {/* Mock Hotel Block */}
                   <div className="mt-8 grid sm:grid-cols-2 gap-6 text-left not-prose">
                      <div className="border rounded-lg p-4">
                         <h4 className="font-bold text-lg">Grand Hotel Istanbul</h4>
                         <p className="text-sm text-slate-500 mb-2">5 stars • 2km from venue</p>
                         <button className="text-rose-600 text-sm font-bold hover:underline">Book with code ARIA24</button>
                      </div>
                      <div className="border rounded-lg p-4">
                         <h4 className="font-bold text-lg">Bosphorus View Inn</h4>
                         <p className="text-sm text-slate-500 mb-2">Boutique • 1km from venue</p>
                         <button className="text-rose-600 text-sm font-bold hover:underline">Book with code ARIA24</button>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        )}
        
        {/* FAQ */}
        {FAQPage && website.faqs.length > 0 && (
          <section id="faq" className="py-20 px-6" style={{ backgroundColor: theme.backgroundColor }}>
             <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center" style={headingStyle}>{FAQPage.title}</h2>
                <div className="space-y-6">
                   {website.faqs.map(faq => (
                      <div key={faq.id} className="bg-white p-6 rounded-lg shadow-sm">
                         <h3 className="font-bold text-lg text-slate-800 mb-2">{faq.question}</h3>
                         <p className="text-slate-600">{faq.answer}</p>
                      </div>
                   ))}
                </div>
             </div>
          </section>
        )}

        {/* RSVP Section */}
        {RSVPPage && (
          <section id="rsvp" className="py-24 px-6 text-center text-white relative">
             <div 
               className="absolute inset-0 bg-slate-900" 
               style={{ backgroundColor: theme.primaryColor }}
             />
             <div className="relative z-10 max-w-xl mx-auto">
                <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: theme.fontHeading }}>{RSVPPage.title}</h2>
                <p className="text-lg mb-8 opacity-90">{RSVPPage.content}</p>
                
                <form className="bg-white p-8 rounded-xl shadow-2xl text-slate-800 text-left space-y-4">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg" placeholder="John Doe" />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                      <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg" placeholder="john@example.com" />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Will you attend?</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
                         <option>Joyfully Accept</option>
                         <option>Regretfully Decline</option>
                      </select>
                   </div>
                   <button 
                      type="button" 
                      className="w-full py-4 rounded-lg font-bold text-white mt-4"
                      style={{ backgroundColor: theme.secondaryColor }}
                   >
                      Send RSVP
                   </button>
                </form>
             </div>
          </section>
        )}

      </div>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 text-center text-slate-400 text-sm">
         <p className="mb-2 font-serif text-slate-600">{website.coupleNames} • {website.weddingDate}</p>
         <p>Powered by AriaWed</p>
      </footer>
    </div>
  );
};
