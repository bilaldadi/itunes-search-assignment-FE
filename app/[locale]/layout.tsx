import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import localFont from "next/font/local";
import '../globals.css';

const ibmArabic = localFont({
  src: [
    {
      path: "../../public/fonts/IBM-Plex-Sans-Arabic/IBMPlexSansArabic-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/IBM-Plex-Sans-Arabic/IBMPlexSansArabic-Bold.otf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../../public/fonts/IBM-Plex-Sans-Arabic/IBMPlexSansArabic-Medium.otf",
      weight: "500",
      style: "medium",
    },
  ],
  variable: "--font-ibm-arabic",
});

export const metadata: Metadata = {
  title: "Podbay - Podcast Search",
  description: "Search and discover your favorite podcasts",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={`${ibmArabic.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

