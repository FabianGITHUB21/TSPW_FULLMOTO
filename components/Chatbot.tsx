"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  suggestions?: string[]
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "¡Hola! Soy el asistente virtual de Motofull. Soy especialista en repuestos para motocicletas y puedo ayudarte con información detallada sobre productos, precios, compatibilidad y más. ¿En qué puedo ayudarte hoy?",
    sender: "bot",
    timestamp: new Date(),
    suggestions: [
      "¿Qué repuestos tienes para mi moto?",
      "¿Cuáles son los tiempos de envío?",
      "¿Tienen garantía los productos?",
      "¿Cómo puedo rastrear mi pedido?",
    ],
  },
]

const botResponses: Record<string, { text: string; suggestions?: string[] }> = {
  default: {
    text: "Entiendo tu consulta. Como especialista en repuestos para motocicletas, puedo ayudarte con información sobre productos, compatibilidad, instalación, precios y más. ¿Podrías ser más específico sobre lo que necesitas? Por ejemplo, ¿qué modelo de moto tienes o qué tipo de repuesto buscas?",
    suggestions: [
      "Tengo una Honda",
      "Tengo una Yamaha",
      "Tengo una Kawasaki",
      "Busco frenos",
      "Busco escape",
      "Ver productos destacados",
    ],
  },
  greeting: {
    text: "¡Hola! Bienvenido a Motofull, tu tienda especializada en repuestos premium para motocicletas. Trabajamos con las mejores marcas como Brembo, Akrapovic, Öhlins, DID, K&N y muchas más. Todos nuestros productos cuentan con garantía de fábrica y soporte técnico especializado. ¿Qué modelo de moto tienes y qué tipo de repuesto necesitas?",
    suggestions: [
      "Honda CBR",
      "Yamaha R1/R6",
      "Kawasaki Ninja",
      "Suzuki GSX-R",
      "Ducati",
      "BMW",
      "KTM",
      "¿Qué garantías ofrecen?",
    ],
  },
  products: {
    text: "Tenemos más de 5,000 repuestos en stock de las mejores marcas mundiales:\n\n🔧 **Frenos**: Brembo, EBC, Galfer - Garantía 12 meses\n🏍️ **Escapes**: Akrapovic, Yoshimura, Arrow - Garantía 24 meses\n⚙️ **Suspensión**: Öhlins, YSS, Showa - Garantía 12 meses\n🔗 **Transmisión**: DID, RK, JT Sprockets - Garantía 6-12 meses\n🌪️ **Filtros**: K&N, BMC, DNA - Garantía de por vida (K&N)\n\n¿Para qué marca y modelo de moto necesitas repuestos?",
    suggestions: [
      "Honda CBR 600/1000",
      "Yamaha R1/R6/MT",
      "Kawasaki Ninja ZX",
      "Suzuki GSX-R",
      "Ducati Panigale",
      "¿Qué garantías específicas?",
    ],
  },
  shipping: {
    text: "📦 **Envíos a toda México:**\n\n🚚 **Envío Estándar**: 2-4 días hábiles - $99 MXN\n⚡ **Envío Express**: 24-48 horas - $199 MXN\n🆓 **Envío GRATIS**: En compras mayores a $2,500 MXN\n📍 **Entrega en CDMX**: Mismo día disponible (zona metropolitana)\n📱 **Rastreo**: Código de seguimiento por WhatsApp y email\n🛡️ **Seguro**: Todos los envíos incluyen seguro contra daños\n\n¿A qué ciudad necesitas el envío?",
    suggestions: [
      "Ciudad de México",
      "Guadalajara",
      "Monterrey",
      "Puebla",
      "¿Cuánto cuesta a mi ciudad?",
      "¿Tienen entrega inmediata?",
    ],
  },
  warranty: {
    text: "🛡️ **Garantías Completas por Producto:**\n\n✅ **Frenos Brembo**: 12 meses contra defectos de fabricación\n🔥 **Escapes Akrapovic**: 24 meses + certificado de autenticidad\n⚙️ **Suspensión Öhlins**: 12 meses + servicio técnico especializado\n🔗 **Cadenas DID**: 6-12 meses según modelo (X-Ring: 12 meses)\n🌪️ **Filtros K&N**: Garantía de por vida + kit de limpieza\n📋 **Pastillas EBC**: 12 meses o 15,000 km\n\n🔄 **Política de Devoluciones**: 30 días para cambios\n📞 **Soporte**: Asesoría técnica gratuita de por vida\n🏪 **Instalación**: Red de 50+ talleres certificados\n\n¿Qué producto específico te interesa para darte detalles exactos de garantía?",
    suggestions: [
      "Garantía frenos Brembo",
      "Garantía escapes Akrapovic",
      "Garantía suspensión Öhlins",
      "¿Cómo hago una devolución?",
      "Talleres certificados cerca",
      "¿Qué cubre la garantía?",
    ],
  },
  tracking: {
    text: "📱 **Rastreo de Pedidos en Tiempo Real:**\n\n1️⃣ **Confirmación**: Email inmediato con número de orden\n2️⃣ **Preparación**: Notificación cuando empacamos tu pedido\n3️⃣ **Envío**: Código de seguimiento por WhatsApp al +52 55 3718 76\n4️⃣ **En Tránsito**: Actualizaciones automáticas cada 4 horas\n5️⃣ **Entrega**: Confirmación con foto y firma digital\n\n🔍 **Portal Web**: Rastrea en tiempo real en nuestra página\n📞 **Soporte**: Atención personalizada si hay retrasos\n\n¿Ya tienes tu número de orden o necesitas ayuda para encontrarlo?",
    suggestions: [
      "Tengo mi número de orden",
      "No encuentro mi orden",
      "¿Cuándo llega mi pedido?",
      "Problemas con entrega",
      "Cambiar dirección de entrega",
    ],
  },
  prices: {
    text: "💰 **Precios y Promociones Actuales:**\n\n🏷️ **Precios Competitivos**: Igualamos cualquier precio de la competencia\n💳 **Formas de Pago**: Tarjetas, OXXO, transferencia, PayPal, Mercado Pago\n📅 **Meses Sin Intereses**: 3, 6, 9 y 12 MSI con tarjetas participantes\n🎯 **Ofertas Semanales**: Hasta 30% de descuento en marcas seleccionadas\n🛒 **Descuento por Volumen**: 5% extra en compras mayores a $5,000\n💎 **Programa VIP**: Descuentos exclusivos para clientes frecuentes\n\n📊 **Ejemplos de Precios**:\n• Pastillas Brembo: desde $1,200 MXN\n• Escape Akrapovic: desde $8,500 MXN\n• Suspensión Öhlins: desde $15,000 MXN\n\n¿Qué producto específico te interesa para darte el precio exacto?",
    suggestions: [
      "Ver ofertas actuales",
      "Frenos Brembo precios",
      "Escapes Akrapovic precios",
      "¿Aceptan todas las tarjetas?",
      "Programa VIP",
      "Descuento por volumen",
    ],
  },
  honda: {
    text: "🏍️ **Honda - Repuestos Disponibles:**\n\n🔧 **CBR 600RR/1000RR**: Frenos Brembo, escapes Akrapovic, filtros K&N\n🏁 **CBR 250R/300R**: Pastillas EBC, escapes Yoshimura, cadenas DID\n🛣️ **CB650F/CB1000R**: Suspensión YSS, frenos Galfer, filtros BMC\n⚡ **CRF**: Repuestos off-road especializados\n\n¿Qué modelo específico de Honda tienes?",
    suggestions: ["CBR 600RR", "CBR 1000RR", "CBR 250R", "CB650F", "CRF 250/450", "Ver todos Honda"],
  },
  yamaha: {
    text: "🏍️ **Yamaha - Repuestos Premium:**\n\n⚡ **R1/R6**: Frenos Brembo Racing, escapes Akrapovic, suspensión Öhlins\n🔥 **MT-07/MT-09**: Escapes Arrow, frenos Galfer, filtros DNA\n🏁 **YZF-R3/R25**: Pastillas EBC, escapes Yoshimura, cadenas RK\n🛣️ **FZ**: Repuestos deportivos y touring\n\n¿Cuál es tu modelo de Yamaha?",
    suggestions: ["Yamaha R1", "Yamaha R6", "MT-07", "MT-09", "R3", "Ver catálogo Yamaha"],
  },
  kawasaki: {
    text: "🏍️ **Kawasaki - Repuestos Racing:**\n\n🥷 **Ninja ZX-6R/10R**: Frenos Brembo GP, escapes Akrapovic Racing, Öhlins TTX\n💚 **Z650/Z900**: Frenos Galfer Wave, escapes Arrow, filtros K&N\n🏁 **Ninja 300/400**: Pastillas EBC HH, escapes Yoshimura, cadenas DID\n🏆 **ZX-14R**: Repuestos para alta velocidad\n\n¿Qué Kawasaki tienes?",
    suggestions: ["Ninja ZX-6R", "Ninja ZX-10R", "Z650", "Z900", "Ninja 300", "ZX-14R"],
  },
  brakes: {
    text: "🔧 **Sistemas de Frenos - Especialistas Certificados:**\n\n🏆 **Brembo Racing**: Pinzas GP4-RX, discos T-Drive, pastillas Z04\n   • Garantía: 12 meses\n   • Mejora: +40% potencia de frenado\n   • Precio: desde $3,500 MXN\n\n⚡ **EBC**: Pastillas HH sintered, discos MD, kits completos\n   • Garantía: 12 meses o 15,000 km\n   • Ideal para: Uso diario y touring\n   • Precio: desde $800 MXN\n\n🌊 **Galfer**: Discos Wave, pastillas G1651, latiguillos\n   • Garantía: 12 meses\n   • Especialidad: Discos flotantes\n   • Precio: desde $1,200 MXN\n\n🔧 **Instalación**: Incluida en talleres certificados\n\n¿Para qué moto y qué tipo de uso (calle/pista)?",
    suggestions: [
      "Brembo para pista",
      "EBC para calle",
      "Galfer Wave",
      "¿Cuál me recomiendas?",
      "Instalación incluida",
      "Ver talleres cerca",
    ],
  },
  exhaust: {
    text: "🏍️ **Escapes - Rendimiento y Sonido Premium:**\n\n🔥 **Akrapovic**: Titanio, fibra de carbono\n   • Garantía: 24 meses + certificado\n   • Ganancia: +8HP, -3kg peso\n   • Precio: desde $8,500 MXN\n\n⚡ **Yoshimura**: R-77, Alpha T, acero inoxidable\n   • Garantía: 18 meses\n   • Ganancia: +6HP, sonido deportivo\n   • Precio: desde $4,200 MXN\n\n🏁 **Arrow**: Pro-Race, Thunder, diseño italiano\n   • Garantía: 12 meses\n   • Ganancia: +7HP, peso reducido\n   • Precio: desde $3,800 MXN\n\n📊 **Incluye**: Mapeo ECU recomendado para máximo rendimiento\n\n¿Buscas más rendimiento o mejor sonido?",
    suggestions: [
      "Akrapovic Titanio",
      "Yoshimura R-77",
      "Arrow Pro-Race",
      "¿Cuánta potencia gano?",
      "¿Necesito mapeo ECU?",
      "Sonido vs rendimiento",
    ],
  },
  suspension: {
    text: "⚙️ **Suspensión - Precisión Sueca y Japonesa:**\n\n🏆 **Öhlins**: TTX GP, NIX 30, tecnología MotoGP\n   • Garantía: 12 meses + servicio técnico\n   • Mejora: +50% precisión, ajuste personalizado\n   • Precio: desde $15,000 MXN\n\n🔧 **YSS**: G-Racing, Topline\n   • Garantía: 12 meses\n   • Relación precio/calidad excelente\n   • Precio: desde $4,500 MXN\n\n⚡ **Showa**: BPF, SFF-BP, tecnología OEM\n   • Garantía: 12 meses\n   • Calidad de fábrica\n   • Precio: desde $6,800 MXN\n\n🔧 **Instalación**: Requiere ajuste profesional incluido\n\n¿Para qué tipo de conducción (calle/pista/touring)?",
    suggestions: [
      "Öhlins TTX",
      "YSS G-Racing",
      "Showa BPF",
      "¿Cuál necesito?",
      "Instalación profesional",
      "Ajuste personalizado",
    ],
  },
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase()

    // Saludos
    if (
      message.includes("hola") ||
      message.includes("buenos") ||
      message.includes("buenas") ||
      message.includes("saludos")
    ) {
      return botResponses.greeting
    }

    // Marcas específicas de motos
    if (message.includes("honda") || message.includes("cbr") || message.includes("cb650") || message.includes("crf")) {
      return botResponses.honda
    }
    if (
      message.includes("yamaha") ||
      message.includes(" r1") ||
      message.includes(" r6") ||
      message.includes("mt-") ||
      message.includes("yzf")
    ) {
      return botResponses.yamaha
    }
    if (
      message.includes("kawasaki") ||
      message.includes("ninja") ||
      message.includes("zx-") ||
      message.includes("z650") ||
      message.includes("z900")
    ) {
      return botResponses.kawasaki
    }
    if (message.includes("suzuki") || message.includes("gsx-r") || message.includes("gsxr")) {
      return {
        text: "🏍️ **Suzuki - Repuestos Deportivos:**\n\n🏁 **GSX-R 600/750/1000**: Frenos Brembo, escapes Yoshimura, suspensión Öhlins\n⚡ **GSX-S**: Frenos Galfer, escapes Arrow, filtros K&N\n🔧 **SV650**: Repuestos touring y deportivos\n\n¿Qué modelo de Suzuki tienes?",
        suggestions: ["GSX-R 600", "GSX-R 1000", "GSX-S 750", "SV650", "Ver catálogo Suzuki"],
      }
    }
    if (message.includes("ducati") || message.includes("panigale") || message.includes("monster")) {
      return {
        text: "🏍️ **Ducati - Repuestos Premium Italianos:**\n\n🔥 **Panigale V2/V4**: Frenos Brembo Stylema, escapes Akrapovic, Öhlins Smart EC\n👹 **Monster**: Frenos Brembo M4, escapes Termignoni, suspensión Öhlins\n🏁 **Streetfighter**: Repuestos racing de alta gama\n\n¿Qué Ducati tienes?",
        suggestions: ["Panigale V4", "Panigale V2", "Monster 821/1200", "Streetfighter", "Ver Ducati premium"],
      }
    }

    // Tipos de repuestos específicos
    if (
      message.includes("freno") ||
      message.includes("pastilla") ||
      message.includes("disco") ||
      message.includes("brembo")
    ) {
      return botResponses.brakes
    }
    if (
      message.includes("escape") ||
      message.includes("akrapovic") ||
      message.includes("yoshimura") ||
      message.includes("arrow")
    ) {
      return botResponses.exhaust
    }
    if (
      message.includes("suspensión") ||
      message.includes("suspension") ||
      message.includes("ohlins") ||
      message.includes("öhlins") ||
      message.includes("amortiguador")
    ) {
      return botResponses.suspension
    }
    if (
      message.includes("cadena") ||
      message.includes("transmisión") ||
      message.includes("did") ||
      message.includes("corona") ||
      message.includes("piñón")
    ) {
      return {
        text: "🔗 **Transmisión - Precisión Japonesa:**\n\n⛓️ **DID**: Cadenas X-Ring, O-Ring, VX3 para racing\n🔧 **JT Sprockets**: Coronas y piñones de acero y aluminio\n🏁 **RK**: Cadenas GB y GV para alta performance\n📊 **Kits Completos**: Cadena + corona + piñón con descuento\n\n¿Para qué cilindrada y uso?",
        suggestions: ["DID X-Ring", "Kit completo", "¿Cada cuándo cambiar?", "JT Sprockets", "Para pista"],
      }
    }
    if (message.includes("filtro") || message.includes("k&n") || message.includes("bmc") || message.includes("dna")) {
      return {
        text: "🌪️ **Filtros de Aire - Más Potencia:**\n\n🔥 **K&N**: Filtros lavables, +3-5HP, garantía 1 millón de km\n⚡ **BMC**: Tecnología F1, fibra de algodón, +4-6HP\n🧬 **DNA**: Filtros premium, excelente flujo de aire\n📈 **Beneficios**: Más potencia, mejor respuesta, reutilizables\n\n¿Para qué moto necesitas el filtro?",
        suggestions: ["K&N lavable", "BMC Racing", "DNA Premium", "¿Cuánta potencia gano?", "Kit de limpieza"],
      }
    }

    // Consultas sobre servicios
    if (
      message.includes("producto") ||
      message.includes("repuesto") ||
      message.includes("marca") ||
      message.includes("catálogo")
    ) {
      return botResponses.products
    }
    if (
      message.includes("envío") ||
      message.includes("entrega") ||
      message.includes("tiempo") ||
      message.includes("enviar")
    ) {
      return botResponses.shipping
    }
    if (
      message.includes("garantía") ||
      message.includes("devol") ||
      message.includes("cambio") ||
      message.includes("warranty")
    ) {
      return botResponses.warranty
    }
    if (
      message.includes("rastrear") ||
      message.includes("seguir") ||
      message.includes("pedido") ||
      message.includes("orden")
    ) {
      return botResponses.tracking
    }
    if (
      message.includes("precio") ||
      message.includes("costo") ||
      message.includes("pago") ||
      message.includes("tarjeta") ||
      message.includes("financiamiento")
    ) {
      return botResponses.prices
    }
    if (message.includes("cuánto tiempo") || message.includes("duración") || message.includes("dura")) {
      return {
        text: "⏰ **Duración de Garantías por Categoría:**\n\n🔧 **Frenos**: 12 meses o 15,000 km (lo que ocurra primero)\n🏍️ **Escapes**: 18-24 meses según marca (Akrapovic: 24 meses)\n⚙️ **Suspensión**: 12 meses + servicio técnico gratuito\n🔗 **Transmisión**: 6-12 meses (cadenas X-Ring: 12 meses)\n🌪️ **Filtros K&N**: Garantía de por vida con registro\n🔋 **Eléctricos**: 6-12 meses según componente\n\n📋 **Condiciones**: Uso normal, instalación profesional requerida\n🛡️ **Cobertura**: Defectos de fabricación y materiales\n\n¿Qué producto específico te interesa?",
        suggestions: [
          "Garantía frenos",
          "Garantía escapes",
          "Garantía suspensión",
          "¿Qué no cubre?",
          "Registro de garantía",
        ],
      }
    }
    if (
      message.includes("defecto") ||
      message.includes("problema") ||
      message.includes("falla") ||
      message.includes("reclamo")
    ) {
      return {
        text: "🛠️ **Soporte por Defectos o Problemas:**\n\n📞 **Contacto Inmediato**: WhatsApp +52 55 3718 76\n📧 **Email**: soporte@motofull.com\n📋 **Información Necesaria**: \n   • Número de orden\n   • Fotos del producto\n   • Descripción del problema\n\n⚡ **Respuesta**: Máximo 24 horas\n🔄 **Soluciones**: Cambio, reparación o reembolso\n🚚 **Envío**: Gratis para productos defectuosos\n\n🛡️ **Garantía Total**: Si no quedas satisfecho, te devolvemos tu dinero\n\n¿Qué problema específico tienes?",
        suggestions: [
          "Producto defectuoso",
          "No funciona correctamente",
          "Llegó dañado",
          "Hablar con soporte",
          "Proceso de devolución",
        ],
      }
    }

    // Respuesta por defecto más inteligente
    return {
      text: "Entiendo que necesitas información específica. Como especialista en repuestos para motocicletas, puedo ayudarte con:\n\n🏍️ **Compatibilidad** por marca y modelo\n💰 **Precios** y formas de pago\n🔧 **Instalación** y soporte técnico\n📦 **Envíos** y tiempos de entrega\n🛡️ **Garantías** y devoluciones\n\n¿Podrías decirme qué marca y modelo de moto tienes, y qué tipo de repuesto buscas?",
      suggestions: [
        "Tengo una Honda CBR",
        "Tengo una Yamaha R6",
        "Busco frenos",
        "Busco escape",
        "¿Cuánto cuesta envío?",
        "Hablar con técnico",
      ],
    }
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(
      () => {
        const botResponse = getBotResponse(text)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse.text,
          sender: "bot",
          timestamp: new Date(),
          suggestions: botResponse.suggestions,
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-12 right-6 w-14 h-14 rounded-full bg-orange-600 hover:bg-orange-700 shadow-lg z-50"
        aria-label="Abrir chat de soporte"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-12 right-6 z-50">
      <Card className={`w-80 shadow-xl transition-all duration-300 ${isMinimized ? "h-16" : "h-96"}`}>
        <CardHeader className="p-4 bg-orange-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-sm">Asistente Motofull</CardTitle>
                <p className="text-xs opacity-90">En línea</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-orange-700 p-1 h-auto"
                aria-label={isMinimized ? "Maximizar chat" : "Minimizar chat"}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-orange-700 p-1 h-auto"
                aria-label="Cerrar chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    {message.sender === "bot" && (
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-orange-600" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        message.sender === "user" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-900 border"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs h-auto py-1 px-2 mr-1 mb-1 bg-white hover:bg-gray-50"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    {message.sender === "user" && (
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1"
                  aria-label="Mensaje para el chatbot"
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-orange-600 hover:bg-orange-700"
                  aria-label="Enviar mensaje"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
