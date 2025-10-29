'use client';

import { useState, useEffect } from 'react';
import { Item, Participant } from '@/types';
import { saveItems, loadItems, saveParticipants, loadParticipants, clearAllData } from '@/lib/storage';
import ItemEntry from '@/components/ItemEntry';
import ParticipantEntry from '@/components/ParticipantEntry';
import Summary from '@/components/Summary';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(loadItems());
    setParticipants(loadParticipants());
    setMounted(true);
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      saveItems(items);
    }
  }, [items, mounted]);

  // Save participants to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      saveParticipants(participants);
    }
  }, [participants, mounted]);

  const handleClearAll = () => {
    if (confirm('আপনি কি সব ডেটা মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।')) {
      clearAllData();
      setItems([]);
      setParticipants([]);
    }
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-indigo-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:bg-purple-600 dark:opacity-30 dark:mix-blend-screen"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:bg-indigo-600 dark:opacity-30 dark:mix-blend-screen"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-600 dark:opacity-30 dark:mix-blend-screen"></div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Header with Theme Toggle and GitHub */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <a
            href="https://github.com/Shariar-Hasan/vagavagi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700 cursor-pointer"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline font-medium text-sm">⭐ Star on GitHub</span>
            <span className="sm:hidden text-base">⭐</span>
          </a>
          <ThemeToggle />
        </div>

        <div className="mb-12 text-center">
          <div className="inline-block mb-4 px-6 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-lg border border-purple-200 dark:border-purple-800/50">
            <span className="text-sm font-medium text-purple-600 dark:text-purple-300">✨ সম্পূর্ণ বিনামূল্যে</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4 mt-3 animate-fade-in drop-shadow-lg">
            ভাগাভাগি
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto font-medium">
            সহজে খরচ ভাগাভাগি এবং হিসাব করুন - দ্রুত, নিরাপদ এবং সুবিধাজনক
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Alert className="mb-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-purple-200 dark:border-purple-700/50 shadow-xl">
            <AlertDescription className="flex items-start gap-2">
              <span className="text-2xl">💡</span>
              <div className="dark:text-gray-100">
                <strong className="text-purple-700 dark:text-purple-300">নির্দেশনা:</strong> খাবার, ভ্রমণ, বাজার, সাবস্ক্রিপশন কিংবা অফিসের খরচ— যেকোনো ধরণের শেয়ারড খরচ সহজেই ট্র্যাক করতে পারবেন এই অ্যাপের মাধ্যমে।
                আপনার সব ডেটা নিরাপদভাবে সংরক্ষিত থাকে আপনার ব্রাউজারে। 🔒
              </div>
            </AlertDescription>
          </Alert>

          <div className="flex justify-end mb-6">
            <Button 
              onClick={handleClearAll} 
              variant="destructive" 
              size="sm"
              className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer dark:bg-red-700 dark:hover:bg-red-800"
            >
              🗑️ সব ডেটা মুছুন
            </Button>
          </div>

          <div className="space-y-8">
            <ItemEntry items={items} onItemsChange={setItems} />
            <ParticipantEntry
              items={items}
              participants={participants}
              onParticipantsChange={setParticipants}
            />
            <Summary items={items} participants={participants} />
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md py-4 rounded-lg border border-purple-100 dark:border-purple-800/30 shadow-lg">
          <p className="mb-1 dark:text-gray-200">© {new Date().getFullYear()} ভাগাভাগি - সহজ খরচ ব্যবস্থাপনা 💰</p>
          <p className="flex items-center justify-center gap-1 text-xs">
            Made with ❤️ and ☕ by{' '}
            <a 
              href="https://github.com/Shariar-Hasan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200 transition-colors cursor-pointer underline decoration-dotted"
            >
              Shariar Hasan
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
