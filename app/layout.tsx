import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/contexts/CartContext"
import { AccessibilityProvider } from "@/contexts/AccessibilityContext" // AGREGADO
import { Suspense } from "react"
import Chatbot from "@/components/Chatbot"
import AccessibilityFeatures from "@/components/AccessibilityFeatures"
import "./globals.css"

export const metadata: Metadata = {
 title: "Motofull - Repuestos para Motocicletas",
 description:
 "Tu tienda especializada en repuestos y accesorios para motocicletas. Calidad garantizada, envío rápido y precios competitivos.",
 generator: "v0.app",
 keywords: "repuestos, motocicletas, motos, frenos, escapes, filtros, transmisión, suspensión",
 authors: [{ name: "Motofull" }],
 viewport: "width=device-width, initial-scale=1",
 robots: "index, follow",
}

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode
}>) {
 return (
 <html lang="es">
 <head>
 <meta name="theme-color" content="#ff6b35" />
<meta name="color-scheme" content="light dark" />
</head>
<body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <a href="#main-content" className="skip-link">
 Saltar al contenido principal
 </a>
        <Suspense fallback={null}>
            <AccessibilityProvider> {/* ENVUELVE TODA LA APLICACIÓN */}
                <CartProvider>
                    <main id="main-content">{children}</main>
                    <Chatbot />
                    <AccessibilityFeatures />
                </CartProvider>
            </AccessibilityProvider>
        </Suspense>
 <Analytics />
 </body>
 </html>
 )
}
