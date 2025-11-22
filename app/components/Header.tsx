'use client';

import { ArrowLeftIcon, ArrowRightIcon, MoreVertical } from 'lucide-react';
import { ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface HeaderProps {
  currentLocale: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
  children?: ReactNode;
}

export default function Header({
  currentLocale,
  onLanguageChange,
  children,
}: HeaderProps) {
  const t = useTranslations('header');
  
  return (
    <header className="sticky top-0 z-40 bg-[#151726]">
      {/* Mobile Layout */}
      <div className="md:hidden px-3 py-5 flex items-center justify-between gap-3 text-white">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={40}
          height={43}
          className="flex-shrink-0"
        />
        
        <div className="flex-1">{children}</div>

        <button
          onClick={() => onLanguageChange(currentLocale === 'en' ? 'ar' : 'en')}
          className="h-8 w-8 rounded-full border border-white/10 text-xs font-semibold uppercase tracking-wide text-white/80 hover:bg-white/10 transition flex-shrink-0"
        >
          {currentLocale === 'en' ? 'AR' : 'EN'}
        </button>

        <button className="flex items-center justify-center text-white/60 hover:text-white transition flex-shrink-0">
          <MoreVertical />
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex px-2 py-2 items-center gap-4 text-white">
        <div className="flex items-center gap-2 text-white/60">
           {currentLocale === 'ar' ? (
             <>
               <ArrowRightIcon className="w-5 h-5 text-white/60" />
               <ArrowLeftIcon className="w-5 h-5 text-white/60" />
             </>
           ) : (
             <>
               <ArrowLeftIcon className="w-5 h-5 text-white/60" />
               <ArrowRightIcon className="w-5 h-5 text-white/60" />
             </>
           )}
        </div>

        <div className="flex-1">{children}</div>

        <div className="flex items-center gap-3">
          <button className="w-15 p-1.5 text-sm  rounded-md bg-[#456C91] text-white hover:opacity-90 transition">{t('login')}</button>
          <button className="w-15 p-1.5 text-sm  rounded-md bg-[#456C91] text-white hover:opacity-90 transition">{t('signup')}</button>
          <button
            onClick={() => onLanguageChange(currentLocale === 'en' ? 'ar' : 'en')}
            className="h-10 w-10 rounded-full border border-white/10 text-xs font-semibold uppercase tracking-wide text-white/80 hover:bg-white/10 transition"
          >
            {currentLocale === 'en' ? 'AR' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
}
