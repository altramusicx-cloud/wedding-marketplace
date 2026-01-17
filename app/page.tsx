import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, Heart, Star } from 'lucide-react'

export default function Home() {
  const categories = [
    { name: 'Venue', count: 45 },
    { name: 'Fotografer', count: 32 },
    { name: 'Katering', count: 28 },
    { name: 'Dekorasi', count: 51 },
    { name: 'Gaun Pengantin', count: 24 },
    { name: 'Makeup', count: 36 },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blush/20 to-sage/20 py-20">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
              Temukan Vendor Wedding{' '}
              <span className="text-blush">Terbaik</span> di Kalimantan
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Marketplace wedding lokal pertama di Kalimantan yang membantu Anda
              menemukan vendor terpercaya untuk hari bahagia Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blush hover:bg-blush/90 text-charcoal">
                Cari Vendor Sekarang
              </Button>
              <Button size="lg" variant="outline">
                Lihat Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12">
        <div className="container-custom">
          <Card className="p-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari vendor atau layanan..."
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blush"
                  />
                </div>
              </div>
              <div className="flex-1">
                <select className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blush">
                  <option value="">Pilih Kategori</option>
                  <option value="venue">Venue</option>
                  <option value="photographer">Fotografer</option>
                  <option value="catering">Katering</option>
                </select>
              </div>
              <div className="flex-1">
                <select className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blush">
                  <option value="">Pilih Lokasi</option>
                  <option value="balikpapan">Balikpapan</option>
                  <option value="samarinda">Samarinda</option>
                  <option value="banjarmasin">Banjarmasin</option>
                </select>
              </div>
              <Button className="bg-sage hover:bg-sage/90 text-white">
                <Search className="mr-2 h-4 w-4" />
                Cari
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              Jelajahi Kategori
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan semua kebutuhan pernikahan Anda dalam satu tempat
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-blush-light flex items-center justify-center">
                  <Heart className="h-6 w-6 text-blush" />
                </div>
                <h3 className="font-semibold text-charcoal">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} vendor</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-charcoal mb-2">
                Vendor Terpopuler
              </h2>
              <p className="text-gray-600">
                Vendor terbaik dengan rating tertinggi
              </p>
            </div>
            <Button variant="outline">Lihat Semua</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Vendor Card */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-blush/30 to-sage/30"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Venue Indah Pernikahan</h3>
                      <p className="text-gray-600 text-sm">Balikpapan</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    Venue eksklusif dengan kapasitas hingga 500 tamu, view kota yang memukau.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-charcoal">
                      Rp 25.000.000
                    </span>
                    <Button className="bg-blush hover:bg-blush/90 text-charcoal">
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}