"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Star, Grid, List, Filter } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/CartContext"

const allProducts = [
  {
    id: 1,
    name: "Kit de Frenos Brembo Racing",
    price: 299.99,
    originalPrice: 349.99,
    image: "/brembo-brake-kit-motorcycle-racing-red-calipers.jpg",
    category: "Frenos",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    description: "Kit completo de frenos Brembo para competición",
    brand: "Brembo",
    tags: ["racing", "frenos", "brembo", "kit"],
  },
  {
    id: 2,
    name: "Escape Akrapovic Titanio",
    price: 899.99,
    originalPrice: 1099.99,
    image: "/akrapovic-titanium-exhaust-motorcycle-carbon-fiber.jpg",
    category: "Escapes",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    description: "Escape deportivo de titanio con fibra de carbono",
    brand: "Akrapovic",
    tags: ["escape", "titanio", "akrapovic", "deportivo"],
  },
  // ... más productos
]

const categories = [
  { name: "Frenos", icon: "🛑", count: 156 },
  { name: "Escapes", icon: "🔥", count: 89 },
  { name: "Filtros", icon: "🌪️", count: 234 },
  { name: "Transmisión", icon: "⚙️", count: 178 },
  { name: "Suspensión", icon: "🏍️", count: 123 },
  { name: "Llantas", icon: "⭕", count: 67 },
  { name: "Lubricantes", icon: "🛢️", count: 89 },
  { name: "Encendido", icon: "⚡", count: 45 },
]

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 3000])
  const { addToCart } = useCart()

  const filteredProducts = useMemo(() => {
    let filtered = allProducts

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      )
    }

    if (selectedCategory !== "Todos") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [searchQuery, selectedCategory, sortBy, priceRange])

  const handleAddToCart = (product: (typeof allProducts)[0]) => {
    if (product.inStock) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        inStock: product.inStock,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white border-2 border-orange-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-orange-700 font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Motofull</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Inicio
              </Link>
              <Link href="/offers" className="text-gray-700 hover:text-gray-900">
                Ofertas
              </Link>
              <Link href="/help" className="text-gray-700 hover:text-gray-900">
                Ayuda
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-gray-900">
                Carrito
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </h3>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categorías</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("Todos")}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      selectedCategory === "Todos" ? "bg-orange-100 text-orange-700" : "hover:bg-gray-100"
                    }`}
                  >
                    Todas las categorías
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between ${
                        selectedCategory === category.name ? "bg-orange-100 text-orange-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <span>
                        {category.icon} {category.name}
                      </span>
                      <span className="text-xs text-gray-500">({category.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Rango de Precio</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-20 text-sm"
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-20 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
                <p className="text-gray-600 mt-1">{filteredProducts.length} productos encontrados</p>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-3 py-2 bg-white"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                  <option value="rating">Mejor Calificados</option>
                  <option value="name">Nombre A-Z</option>
                </select>

                <div className="flex border border-gray-300 rounded bg-white">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron productos.</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("Todos")
                    setPriceRange([0, 3000])
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {!product.inStock && (
                          <Badge className="absolute top-3 left-3 bg-red-600 text-white">Agotado</Badge>
                        )}
                        {product.originalPrice > product.price && (
                          <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{product.category}</Badge>
                        <Badge variant="outline">{product.brand}</Badge>
                      </div>
                      <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                      <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-orange-600">${product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" disabled={!product.inStock} onClick={() => handleAddToCart(product)}>
                        {product.inStock ? "Agregar al Carrito" : "Notificar Disponibilidad"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
