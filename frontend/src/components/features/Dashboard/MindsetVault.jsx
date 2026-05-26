import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const MOTIVATIONAL_QUOTES = [
  { text: "The major value in life is not what you get. The major value in life is what you become.", author: "Jim Rohn" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "He who has a why to live for can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "Concentrate every minute like a Roman—on doing what's in front of you with precise seriousness.", author: "Marcus Aurelius" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The best way to predict your future is to create it.", author: "Peter Drucker" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do.", author: "Lou Holtz" },
  { text: "Opportunities are usually disguised as hard work, so most people don't recognize them.", author: "Ann Landers" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "If you want to achieve greatness stop asking for permission.", author: "Anonymous" },
  { text: "Things work out best for those who make the best of how things work out.", author: "John Wooden" },
  { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
  { text: "The question isn't who is going to let me; it's who is going to stop me.", author: "Ayn Rand" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "A creative man is motivated by the desire to achieve, not by the desire to beat others.", author: "Ayn Rand" },
  { text: "The future belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" }
];

const CURATED_BOOKS = [
  { id: 1, title: "Meditations", author: "Marcus Aurelius", category: "Philosophy", url: "https://gutenberg.org/cache/epub/68239/pg68239-images.html" },
  { id: 2, title: "Beyond Good and Evil", author: "Friedrich Nietzsche", category: "Mindset", url: "https://www.gutenberg.org/cache/epub/4363/pg4363-images.html" },
  { id: 3, title: "The Art of War", author: "Sun Tzu", category: "Strategy", url: "https://gutenberg.org/cache/epub/132/pg132-images.html" },
  { id: 4, title: "The Republic", author: "Plato", category: "Philosophy", url: "https://gutenberg.org/cache/epub/1497/pg1497-images.html" },
  { id: 5, title: "Walden", author: "Henry David Thoreau", category: "Mindset", url: "https://gutenberg.org/cache/epub/205/pg205-images.html" },
  { id: 6, title: "Algorithms & Problem Solving", author: "Classic Text", category: "Computer Science", url: "https://gutenberg.org/cache/epub/38226/pg38226-images.html" }
];

export default function MindsetVault() {
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  const [activeReadingUrl, setActiveReadingUrl] = useState(null);
  const [activeReadingTitle, setActiveReadingTitle] = useState('');
  const [isEyeCareDimmed, setIsEyeCareDimmed] = useState(false);

  const shuffleQuote = () => {
    const nextIdx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setCurrentQuote(MOTIVATIONAL_QUOTES[nextIdx]);
  };

  const ReaderOverlay = () => (
    <div className="fixed inset-0 z-[99999] bg-white flex flex-col" style={{ margin: 0, padding: 0 }}>
      <div className="flex justify-between items-center px-8 py-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] uppercase tracking-widest opacity-40 block font-semibold text-black">Currently Reading</span>
          <h3 className="text-sm md:text-lg font-serif font-medium text-black">{activeReadingTitle}</h3>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsEyeCareDimmed(!isEyeCareDimmed)}
            className={`text-xs uppercase tracking-wider border px-6 py-2 transition-all font-medium cursor-pointer rounded ${isEyeCareDimmed ? 'bg-black text-white border-black' : 'border-black text-black'}`}
          >
            {isEyeCareDimmed ? 'Eye Care: ON' : 'Dim Light'}
          </button>
          <button
            onClick={() => { setActiveReadingUrl(null); setIsEyeCareDimmed(false); }}
            className="text-xs uppercase font-medium tracking-widest border border-black px-6 py-2 hover:bg-red-500 hover:text-white transition-all cursor-pointer rounded text-black"
          >
            Close Reader
          </button>
        </div>
      </div>
      <div className="flex-1 w-full relative bg-white">
        <iframe src={activeReadingUrl} title={activeReadingTitle} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" />
        <div className="absolute inset-0 pointer-events-none transition-all duration-300 mix-blend-multiply" style={{ backgroundColor: isEyeCareDimmed ? '#f4ecd8' : 'transparent', opacity: isEyeCareDimmed ? '0.9' : '0' }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in w-full pb-12 relative h-full">
      <div>
        <h2 className="text-3xl font-serif tracking-tight">Inspiration</h2>
        <p className="text-sm opacity-60 mt-1">Daily wisdom and embedded classic library.</p>
      </div>

      <div className="border p-8 relative overflow-hidden flex flex-col justify-between min-h-[220px]" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
        <svg className="absolute -right-4 -top-8 opacity-[0.03] pointer-events-none transform rotate-12" width="250" height="250" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M10 50 Q 30 20 50 50 T 90 50" /> <path d="M40 40 Q 50 20 60 40" /> <path d="M45 45 L 55 45" />
        </svg>
        <div className="relative z-10 space-y-3 max-w-3xl">
          <span className="text-[10px] tracking-widest uppercase opacity-40 font-semibold">Mindset Spark</span>
          <p className="text-xl md:text-2xl font-serif italic leading-relaxed">"{currentQuote.text}"</p>
          <p className="text-xs uppercase tracking-widest opacity-50">— {currentQuote.author}</p>
        </div>
        <button onClick={shuffleQuote} className="mt-6 text-xs font-semibold uppercase tracking-wider border px-5 py-2.5 transition-all duration-200 self-start relative z-10 cursor-pointer" style={{ borderColor: 'var(--text-primary)', backgroundColor: 'transparent', color: 'var(--text-primary)' }}>Shuffle Wisdom</button>
      </div>

      <div className="space-y-4 pb-16">
        <h3 className="text-lg font-serif tracking-wide">Reading List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURATED_BOOKS.map((book) => (
            <div key={book.id} onClick={() => { setActiveReadingUrl(book.url); setActiveReadingTitle(book.title); }} className="border p-6 flex flex-col justify-between relative transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-[1.01] group cursor-pointer" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-wider opacity-40 font-bold">{book.category}</span>
                  <span className="text-[10px] uppercase opacity-0 group-hover:opacity-60 transition-opacity flex items-center gap-1 font-medium tracking-wide">Open Codex &rarr;</span>
                </div>
                <h4 className="text-base font-serif font-medium truncate mt-2 group-hover:underline">{book.title}</h4>
                <p className="text-xs opacity-50 truncate mt-0.5">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {activeReadingUrl && ReactDOM.createPortal(<ReaderOverlay />, document.body)}
    </div>
  );
}