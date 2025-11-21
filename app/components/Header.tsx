'use client';

interface HeaderProps {
  currentLocale: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
}

export default function Header({ currentLocale, onLanguageChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Podbay
            </h1>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLanguageChange(currentLocale === 'en' ? 'ar' : 'en')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              aria-label={currentLocale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              {currentLocale === 'en' ? 'AR' : 'EN'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
