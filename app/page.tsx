// File: app/admin/page.tsx (SIMPLE VERSION)
export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">Pending Products</h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
          <p className="text-sm text-gray-500">Waiting for approval</p>
        </div>

        <div className="p-6 bg-white border rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">Total Vendors</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500">Registered vendors</p>
        </div>

        <div className="p-6 bg-white border rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">Total Contacts</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
          <p className="text-sm text-gray-500">WhatsApp contacts</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Quick Links</h2>
        <div className="flex gap-4">
          <a
            href="/admin/products"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Product Approval
          </a>
          <a
            href="/admin/contacts"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Contact Logs
          </a>
          <a
            href="/admin/vendors"
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Vendor Management
          </a>
        </div>
      </div>
    </div>
  )
}