"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RotationalCaptcha } from "@/components/RotationalCaptcha"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [isCaptchaSolved, setIsCaptchaSolved] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (email === "admin@motofull.com" && password === "admin123") {
        localStorage.setItem("user", JSON.stringify({ email, role: "admin", name: "Administrador" }))
        router.push("/admin/dashboard")
      } else if (email && password.length >= 6) {
        localStorage.setItem("user", JSON.stringify({ email, role: "user", name: email.split("@")[0] }))
        router.push("/")
      } else {
        setError("Credenciales inválidas. Intenta con admin@motofull.com / admin123")
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Por favor, ingresa tu correo y contraseña.")
      return
    }

    if (!showCaptcha && !isCaptchaSolved) {
      setShowCaptcha(true)
      setError("")
      return
    }

    if (showCaptcha && !isCaptchaSolved) {
      setError("Por favor, resuelve el CAPTCHA para iniciar sesión.")
      return
    }

    if (isCaptchaSolved) {
      handleLogin()
    }
  }

  const handleCaptchaValidation = (isValid: boolean) => {
    setIsCaptchaSolved(isValid)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Motofull
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa a tu cuenta de Motofull</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {showCaptcha && (
                <RotationalCaptcha 
                  onValidate={handleCaptchaValidation} 
                  isLoading={isLoading} 
                />
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Recordarme
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-orange-600 hover:text-orange-700">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700" 
                disabled={isLoading || (showCaptcha && !isCaptchaSolved)}
              >
                {isLoading 
                  ? "Iniciando sesión..." 
                  : showCaptcha 
                    ? "Verificar y Continuar" 
                    : "Iniciar Sesión"
                }
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link href="/auth/register" className="text-orange-600 hover:text-orange-700 font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>

            {typeof window !== "undefined" && window.location.search.includes("admin=true") && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800 font-medium mb-1">Credenciales de prueba (Solo Admin):</p>
                <p className="text-xs text-blue-700">Admin: admin@motofull.com / admin123</p>
                <p className="text-xs text-blue-700">Usuario: cualquier@email.com / 123456</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

