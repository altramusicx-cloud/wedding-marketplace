// app/categories/page.tsx - Categories listing page
// Dynamic route [slug] temporarily disabled

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CATEGORIES = [
  { id: "venue", name: "Venue", count: 42 },
  { id: "photographer", name: "Photographer", count: 28 },
  { id: "catering", name: "Catering", count: 35 },
  { id: "decoration", name: "Decoration", count: 19 },
  { id: "wedding-dress", name: "Wedding Dress", count: 24 },
  { id: "makeup", name: "Makeup Artist", count: 17 },
  { id: "music", name: "Music & Entertainment", count: 15 },
  { id: "invitation", name: "Invitation", count: 8 },
]

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-charcoal">Kategori Wedding</h1>
        <p className="text-gray-600 mt-2">
          Temukan vendor berdasarkan kategori
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((category) => (
          <Card 
            key={category.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader>
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{category.count} vendors tersedia</p>
              <div className="mt-4">
                <button className="text-sm text-blush hover:text-blush/80 font-medium">
                  Lihat Semua →
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info message */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <p className="text-blue-700">
            <strong>Catatan:</strong> Halaman kategori detail (dynamic route [slug]) 
            akan diimplementasikan setelah type system stabil. Untuk sekarang, 
            menggunakan halaman listing sederhana.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
