// app/force-tailwind/page.tsx
export default function ForceTailwind() {
  return (
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-3xl font-bold text-primary mb-6">🎨 Tailwind v4 Color Test</h1>
      <p className="text-neutral-700 mb-8">Testing Shopee Mall Red (#d0011b)</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-primary p-6 rounded-lg text-white font-bold">
          bg-primary (#d0011b)
        </div>
        <div className="bg-primary-dark p-6 rounded-lg text-white font-bold">
          bg-primary-dark (#b00116)
        </div>
        <div className="bg-primary-light p-6 rounded-lg text-black font-bold">
          bg-primary-light (#ffe6e9)
        </div>
        <div className="bg-gold p-6 rounded-lg text-white font-bold">
          bg-gold (#c5a368)
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-neutral-900 mb-4">Neutral Colors</h2>
      <div className="grid grid-cols-7 gap-2 mb-8">
        {[50, 100, 200, 300, 500, 700, 900].map((shade) => (
          <div key={shade} className={`bg-neutral-${shade} p-3 rounded text-xs text-center`}>
            neutral-{shade}
          </div>
        ))}
      </div>
      
      <h2 className="text-xl font-bold text-neutral-900 mb-4">Text Colors</h2>
      <div className="space-y-2">
        <p className="text-primary">text-primary - Shopee Mall Red</p>
        <p className="text-neutral-900">text-neutral-900 - Primary text</p>
        <p className="text-neutral-700">text-neutral-700 - Secondary text</p>
        <p className="text-neutral-500">text-neutral-500 - Tertiary text</p>
      </div>
    </div>
  )
}
