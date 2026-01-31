import { createClient } from "@/lib/supabase/server"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  MessageSquare,
  Phone,
  User,
  Download,
  Filter
} from "lucide-react"

export default async function ContactLogsPage() {
  const supabase = await createClient()

  // Fetch contact logs
  const { data: contactLogs } = await supabase
    .from('contact_logs')
    .select(`
      id,
      contacted_at,
      contact_method,
      user_name,
      user_whatsapp,
      vendor_name,
      product_name,
      status,
      notes
    `)
    .order('contacted_at', { ascending: false })
    .limit(50)

  const { count: totalContacts } = await supabase
    .from('contact_logs')
    .select('*', { count: 'exact', head: true })

  const { count: todayContacts } = await supabase
    .from('contact_logs')
    .select('*', { count: 'exact', head: true })
    .gte('contacted_at', new Date().toISOString().split('T')[0])

  const statusStats = {
    contacted: contactLogs?.filter(log => log.status === 'contacted').length || 0,
    replied: contactLogs?.filter(log => log.status === 'replied').length || 0,
    booked: contactLogs?.filter(log => log.status === 'booked').length || 0,
    cancelled: contactLogs?.filter(log => log.status === 'cancelled').length || 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Logs</h1>
        <p className="text-gray-600 mt-1">
          Track all user-vendor interactions and contact attempts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold mt-1">{totalContacts || 0}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold mt-1">{todayContacts || 0}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Replied</p>
                <p className="text-2xl font-bold mt-1">{statusStats.replied}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalContacts ? ((statusStats.replied / totalContacts) * 100).toFixed(1) : 0}% rate
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Booked</p>
                <p className="text-2xl font-bold mt-1">{statusStats.booked}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalContacts ? ((statusStats.booked / totalContacts) * 100).toFixed(1) : 0}% conversion
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-3.5 h-3.5" />
            Filter by Status
          </Button>
          <select className="border rounded-md px-3 py-1.5 text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>All time</option>
          </select>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Contact Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          {contactLogs && contactLogs.length > 0 ? (
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Vendor & Product</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="text-sm font-medium">
                          {new Date(log.contacted_at).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.contacted_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{log.user_name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {log.user_whatsapp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium truncate max-w-[200px]">
                          {log.vendor_name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {log.product_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {log.contact_method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`
                            capitalize
                            ${log.status === 'contacted' ? 'bg-blue-100 text-blue-800' : ''}
                            ${log.status === 'replied' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${log.status === 'booked' ? 'bg-green-100 text-green-800' : ''}
                            ${log.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                          `}
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                          >
                            <a 
                              href={`https://wa.me/${log.user_whatsapp}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 mr-1" />
                              WhatsApp
                            </a>
                          </Button>
                          <Button size="sm" variant="ghost">
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No contact logs yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Contact logs will appear here when users contact vendors through the platform.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
