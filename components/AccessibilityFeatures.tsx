"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accessibility,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  Palette,
  Type,
  Volume2,
  RotateCcw,
  Settings,
  Font,
} from "lucide-react"

interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  darkMode: boolean
  reducedMotion: boolean
  screenReader: boolean
  largeButtons: boolean
  colorBlindFriendly: boolean
  fontFamily: string
}

const DEFAULTS: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  darkMode: false,
  reducedMotion: false,
  screenReader: false,
  largeButtons: false,
  colorBlindFriendly: false,
  fontFamily: "sans-serif",
}

export default function AccessibilityFeatures() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULTS)

  // cargar
  useEffect(() => {
    const saved = localStorage.getItem("accessibility-settings")
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch {
        setSettings(DEFAULTS)
      }
    }
  }, [])

  // guardar y aplicar
  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings))
    applySettings(settings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  const applySettings = (s: AccessibilitySettings) => {
    const root = document.documentElement

    // tamaño y tipografía
    root.style.fontSize = `${s.fontSize}%`
    root.style.fontFamily = s.fontFamily

    // clases de utilidad
    toggleClass(root, "high-contrast", s.highContrast)
    toggleClass(root, "reduce-motion", s.reducedMotion)
    toggleClass(root, "large-buttons", s.largeButtons)
    toggleClass(root, "color-blind-friendly", s.colorBlindFriendly)

    // modo oscuro: además de clase, escribimos variables para cubrir todo
    if (s.darkMode) {
      root.classList.add("dark")
      // variables que cubren elementos no diseñados con dark:...
      setDarkVariables(root)
      // cambiar images with data-dark
      swapImagesForDarkMode(true)
      // meta theme-color (mobile address bar)
      setMetaThemeColor("#0b0b0f")
    } else {
      root.classList.remove("dark")
      setLightVariables(root)
      swapImagesForDarkMode(false)
      setMetaThemeColor("#ffffff")
    }

    // high contrast + color blind may change accent colors
    if (s.highContrast) setHighContrastVariables(root)
    else if (s.colorBlindFriendly) setColorBlindVariables(root)
  }

  // helpers para variables
  const setDarkVariables = (root: HTMLElement) => {
    root.style.setProperty("--bg", "#0b0b0f")
    root.style.setProperty("--text", "#e6e6e6")
    root.style.setProperty("--card", "#111217")
    root.style.setProperty("--muted", "#9a9aa0")
    root.style.setProperty("--primary", "#8ab4ff")
    root.style.setProperty("--input-bg", "#0f1113")
    root.style.setProperty("--border", "#1f2937")
  }

  const setLightVariables = (root: HTMLElement) => {
    root.style.setProperty("--bg", "#ffffff")
    root.style.setProperty("--text", "#111827")
    root.style.setProperty("--card", "#f6f6f9")
    root.style.setProperty("--muted", "#6b7280")
    root.style.setProperty("--primary", "#1a73e8")
    root.style.setProperty("--input-bg", "#ffffff")
    root.style.setProperty("--border", "#e5e7eb")
  }

  const setHighContrastVariables = (root: HTMLElement) => {
    root.style.setProperty("--text", "#000000")
    root.style.setProperty("--bg", "#ffff00")
    root.style.setProperty("--card", "#ffffff")
    root.style.setProperty("--primary", "#000000")
  }

  const setColorBlindVariables = (root: HTMLElement) => {
    // paleta amigable (ejemplo)
    root.style.setProperty("--primary", "#0b85a6")
  }

  const setMetaThemeColor = (color: string) => {
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement("meta")
      meta.name = "theme-color"
      document.head.appendChild(meta)
    }
    meta.content = color
  }

  const toggleClass = (el: Element, cls: string, enabled: boolean) => {
    if (enabled) el.classList.add(cls)
    else el.classList.remove(cls)
  }

  // intercambio de imágenes con atributo data-dark
  const swapImagesForDarkMode = (enable: boolean) => {
    // imgs y svgs con data-dark
    const nodes = Array.from(document.querySelectorAll<HTMLImageElement | HTMLSourceElement | HTMLVideoElement>("img[data-dark], source[data-dark]"))
    nodes.forEach((node) => {
      const el = node as HTMLImageElement
      const dark = el.getAttribute("data-dark")
      const light = el.getAttribute("src") || el.getAttribute("data-light")
      if (!dark) return
      if (enable) {
        // guardar src original si no está guardado
        if (!el.dataset.light) el.dataset.light = el.getAttribute("src") || ""
        if (el.dataset.light !== dark) el.setAttribute("src", dark)
      } else {
        // restaurar
        if (el.dataset.light) el.setAttribute("src", el.dataset.light)
      }
    })

    // para backgrounds inline (data-bg-dark)
    const bgEls = Array.from(document.querySelectorAll<HTMLElement>("[data-bg-dark]"))
    bgEls.forEach((el) => {
      const darkBg = el.getAttribute("data-bg-dark")
      const lightBg = el.getAttribute("data-bg-light") || ""
      if (enable && darkBg) el.style.backgroundImage = `url(${darkBg})`
      else el.style.backgroundImage = lightBg ? `url(${lightBg})` : ""
    })
  }

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(DEFAULTS)
  }

  const increaseFontSize = () => {
    if (settings.fontSize < 150) updateSetting("fontSize", settings.fontSize + 10)
  }

  const decreaseFontSize = () => {
    if (settings.fontSize > 80) updateSetting("fontSize", settings.fontSize - 10)
  }

  const changeFontFamily = () => {
    const order = ["sans-serif", "serif", "monospace"]
    const currentIndex = order.indexOf(settings.fontFamily)
    const nextIndex = (currentIndex + 1) % order.length
    updateSetting("fontFamily", order[nextIndex])
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        aria-label="Abrir opciones de accesibilidad"
      >
        <Accessibility className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Card className="w-80 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Accessibility className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Accesibilidad</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar opciones de accesibilidad"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Tamaño de texto */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tamaño de Texto</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={settings.fontSize <= 80}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Badge variant="secondary" className="min-w-[60px] justify-center">
                  {settings.fontSize}%
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseFontSize}
                  disabled={settings.fontSize >= 150}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Opciones visuales */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Opciones Visuales</label>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">Alto Contraste</span>
                </div>
                <Button
                  variant={settings.highContrast ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting("highContrast", !settings.highContrast)}
                >
                  {settings.highContrast ? "ON" : "OFF"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span className="text-sm">Modo Oscuro</span>
                </div>
                <Button
                  variant={settings.darkMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting("darkMode", !settings.darkMode)}
                >
                  {settings.darkMode ? "ON" : "OFF"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span className="text-sm">Colores Amigables</span>
                </div>
                <Button
                  variant={settings.colorBlindFriendly ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting("colorBlindFriendly", !settings.colorBlindFriendly)}
                >
                  {settings.colorBlindFriendly ? "ON" : "OFF"}
                </Button>
              </div>
            </div>

            {/* Movimiento e Interacción */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Movimiento e Interacción</label>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <EyeOff className="h-4 w-4" />
                  <span className="text-sm">Reducir Animaciones</span>
                </div>
                <Button
                  variant={settings.reducedMotion ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting("reducedMotion", !settings.reducedMotion)}
                >
                  {settings.reducedMotion ? "ON" : "OFF"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4" />
                  <span className="text-sm">Botones Grandes</span>
                </div>
                <Button
                  variant={settings.largeButtons ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting("largeButtons", !settings.largeButtons)}
                >
                  {settings.largeButtons ? "ON" : "OFF"}
                </Button>
              </div>
            </div>

            {/* 🔤 Cambio de Tipografía (nuevo botón) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Font className="h-4 w-4" />
                <span className="text-sm">Cambiar Tipografía</span>
              </div>
              <Button variant="outline" size="sm" onClick={changeFontFamily}>
                {settings.fontFamily === "sans-serif" ? "Sans" : settings.fontFamily === "serif" ? "Serif" : "Mono"}
              </Button>
            </div>

            {/* Lector de pantalla */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">Lector de Pantalla</span>
              </div>
              <Button
                variant={settings.screenReader ? "default" : "outline"}
                size="sm"
                onClick={() => updateSetting("screenReader", !settings.screenReader)}
              >
                {settings.screenReader ? "ON" : "OFF"}
              </Button>
            </div>

            {/* Restablecer */}
            <Button variant="outline" className="w-full bg-transparent" onClick={resetSettings}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restablecer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

