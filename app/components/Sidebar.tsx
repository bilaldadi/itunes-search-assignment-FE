'use client';

import Image from 'next/image';
import { ReactNode, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface SidebarProps {
  currentLocale: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
}

interface NavItem {
  label: string;
  icon: ReactNode;
}

const baseButtonClasses = 'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors';

export default function Sidebar({ currentLocale, onLanguageChange }: SidebarProps) {
  const t = useTranslations('sidebar');
  const mainNavigation: NavItem[] = useMemo(
    () => [
      {
        label: t('home'),
        icon: (
          <Image
            src="/SVGs/home-line.svg"
            alt="home"
            width={18}
            height={16}
            priority
          />
        ),
      },
      {
        label: t('discover'),
        icon: (
         <Image
            src="/SVGs/discover-line.svg"
            alt="discover"
            width={18}
            height={16}
            priority
          />
        ),
      },
    ],
    [t]
  );

  const libraryNavigation: NavItem[] = useMemo(
    () => [
      {
        label: t('myQueue'),
        icon: (
          <Image
            src="/SVGs/my-queue-line.svg"
            alt="queue"
            width={18}
            height={16}
            priority
          />
        ),
      },
      {
        label: t('myPodcasts'),
        icon: (
          <Image
            src="/SVGs/my-podcasts-line.svg"
            alt="podcasts"
            width={18}
            height={16}
            priority
          />
        ),
      },
      {
        label: t('recents'),
        icon: (
          <Image
            src="/SVGs/recents-line.svg"
            alt="recent"
            width={18}
            height={16}
            priority
          />
        ),
      },
    ],
    [t]
  );

  return (
    <aside className="hidden xl:flex w-55 flex-shrink-0 flex-col bg-[#141524] border-r border-white/5 sticky top-0 h-screen">
      <div className="p-6">
        <Image src="/logo.svg" alt="logo" width={45} height={49} />
      </div>

      <nav className="flex-1 px-4 space-y-8 overflow-y-auto">
        <div className="space-y-1">
          {mainNavigation.map((item) => (
            <button
              key={item.label}
              className={`${baseButtonClasses} text-white hover:text-white hover:bg-white/5`}
            >
              <span className="text-white">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-1">
          <p className="px-2 text-xs uppercase tracking-[0.3em] text-white/30">Your Stuff</p>
          {libraryNavigation.map((item) => (
            <button
              key={item.label}
              className={`${baseButtonClasses} text-white/70 hover:text-white hover:bg-white/5`}
            >
              <span className="text-white/80">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="p-6 space-y-4 text-sm text-white/60 border-t border-white/5">
        <p className="text-xs text-white/30">{t('version')} · {t('fancySoups')}</p>
      </div>
    </aside>
  );
}

