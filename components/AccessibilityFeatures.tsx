"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accessibility, ZoomIn, ZoomOut, Eye, EyeOff, Palette, Type, Volume2, RotateCcw, Settings } from "lucide-react"

interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  darkMode: boolean
  reducedMotion: boolean
  screenReader: boolean
  largeButtons: boolean
  colorBlindFriendly: boolean
}

export default function AccessibilityFeatures() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    highContrast: false,
    darkMode: false,
    reducedMotion: false,
    screenReader: false,
    largeButtons: false,
    colorBlindFriendly: false,
  })

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("accessibility-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem("accessibility-settings", JSON.stringify(settings))

    // Apply settings to document
    applySettings(settings)
  }, [settings])

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement

    // Font size
    root.style.fontSize = `${newSettings.fontSize}%`

    // High contrast
    if (newSettings.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    // Dark mode
    if (newSettings.darkMode) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }

    // Large buttons
    if (newSettings.largeButtons) {
      root.classList.add("large-buttons")
    } else {
      root.classList.remove("large-buttons")
    }

    // Color blind friendly
    if (newSettings.colorBlindFriendly) {
      root.classList.add("color-blind-friendly")
    } else {
      root.classList.remove("color-blind-friendly")
    }
  }

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 100,
      highContrast: false,
      darkMode: false,
      reducedMotion: false,
      screenReader: false,
      largeButtons: false,
      colorBlindFriendly: false,
    }
    setSettings(defaultSettings)
  }

  const increaseFontSize = () => {
    if (settings.fontSize < 150) {
      updateSetting("fontSize", settings.fontSize + 10)
    }
  }

  const decreaseFontSize = () => {
    if (settings.fontSize > 80) {
      updateSetting("fontSize", settings.fontSize - 10)
    }
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
            {/* Font Size */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tamaño de Texto</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={settings.fontSize <= 80}
                  aria-label="Disminuir tamaño de texto"
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
                  aria-label="Aumentar tamaño de texto"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Visual Options */}
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
                  aria-label={settings.highContrast ? "Desactivar alto contraste" : "Activar alto contraste"}
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
                  aria-label={settings.darkMode ? "Desactivar modo oscuro" : "Activar modo oscuro"}
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
                  aria-label={
                    settings.colorBlindFriendly ? "Desactivar colores amigables" : "Activar colores amigables"
                  }
                >
                  {settings.colorBlindFriendly ? "ON" : "OFF"}
                </Button>
              </div>
            </div>

            {/* Motion & Interaction */}
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
                  aria-label={settings.reducedMotion ? "Activar animaciones" : "Reducir animaciones"}
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
                  aria-label={settings.largeButtons ? "Desactivar botones grandes" : "Activar botones grandes"}
                >
                  {settings.largeButtons ? "ON" : "OFF"}
                </Button>
              </div>
            </div>

            {/* Screen Reader */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">Lector de Pantalla</span>
              </div>
              <Button
                variant={settings.screenReader ? "default" : "outline"}
                size="sm"
                onClick={() => updateSetting("screenReader", !settings.screenReader)}
                aria-label={settings.screenReader ? "Desactivar lector de pantalla" : "Activar lector de pantalla"}
              >
                {settings.screenReader ? "ON" : "OFF"}
              </Button>
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={resetSettings}
              aria-label="Restablecer configuración de accesibilidad"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restablecer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
