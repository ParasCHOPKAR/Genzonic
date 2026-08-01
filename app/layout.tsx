import "./globals.css";
import Loader from "@/components/Loader/Loader";
import ClientLayout from "@/components/ClientLayout/ClientLayout";
import Script from "next/script";
import { Providers } from "./providers";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.genzonic.com';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "GenZonic - Premium Gen-Z Streetwear",
    template: "%s | GenZonic",
  },
  description: "Premium Gen-Z Streetwear Brand redefining modern fashion.",
  openGraph: {
    title: "GenZonic - Premium Gen-Z Streetwear",
    description: "Premium Gen-Z Streetwear Brand redefining modern fashion.",
    url: BASE_URL,
    siteName: "GenZonic",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>

        {/* Razorpay Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GenZonic",
              url: BASE_URL,
              logo: `${BASE_URL}/favicon.ico`,
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-800-555-1234",
                contactType: "Customer Service"
              }
            })
          }}
        />

        <Providers>
          <Loader />
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>

      </body>
    </html>
  );
}