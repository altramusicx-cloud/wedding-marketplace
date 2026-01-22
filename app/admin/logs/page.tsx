// app/admin/logs/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContactLogsTable } from '@/components/admin/contact-logs'
import { createClient } from '@/lib/supabase/server'
import { MessageSquare, Users, TrendingUp, Clock } from 'lucide-react'






export default async function AdminLogsPage() {
    const supabase = await createClient()

    // Fetch contact logs stats
    const [
        { count: totalContacts },
        { count: todayContacts },
        { count: uniqueUsers },
        { count: respondedContacts }
    ] = await Promise.all([
        supabase.from('contact_logs').select('*', { count: 'exact', head: true }),
        supabase.from('contact_logs').select('*', { count: 'exact', head: true })
            .gte('created_at', new Date().toISOString().split('T')[0]),
        supabase.from('contact_logs').select('user_id', { count: 'exact', head: true })
            .not('user_id', 'is', null),
        supabase.from('contact_logs').select('*', { count: 'exact', head: true })
            .eq('status', 'replied')
    ])

    // Fetch recent contact logs
    const { data: recentLogs } = await supabase
        .from('contact_logs')
        .select(`
            *,
            products:product_id (
                name,
                thumbnail_url
            ),
            vendors:vendor_id (
                full_name
            )
        `)
        .order('contacted_at', { ascending: false })
        .limit(50)

    const stats = [
        {
            title: 'Total Kontak',
            value: totalContacts || 0,
            icon: MessageSquare,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            description: 'Seluruh waktu'
        },
        {
            title: 'Hari Ini',
            value: todayContacts || 0,
            icon: Clock,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            description: 'Kontak hari ini'
        },
        {
            title: 'Pengguna Unik',
            value: uniqueUsers || 0,
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            description: 'User berbeda'
        },
        {
            title: 'Direspon',
            value: respondedContacts || 0,
            icon: TrendingUp,
            color: 'text-amber-600',
            bgColor: 'bg-amber-100',
            description: 'Telah direspon'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-charcoal">Contact Logs</h1>
                <p className="text-gray-600 mt-2">
                    Monitor semua interaksi user dengan vendor
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-gray-500">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Contact Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Contact Activity</CardTitle>
                    <CardDescription>
                        {recentLogs?.length || 0} kontak terbaru
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="all">Semua</TabsTrigger>
                            <TabsTrigger value="replied">Direspon</TabsTrigger>
                            <TabsTrigger value="booked">Dibooking</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <ContactLogsTable
                                logs={recentLogs || []}
                                showFilters={true}
                            />
                        </TabsContent>

                        <TabsContent value="replied">
                            <ContactLogsTable
                                logs={(recentLogs || []).filter(log => log.status === 'replied')}
                                showFilters={false}
                            />
                        </TabsContent>

                        <TabsContent value="booked">
                            <ContactLogsTable
                                logs={(recentLogs || []).filter(log => log.status === 'booked')}
                                showFilters={false}
                            />
                        </TabsContent>

                        <TabsContent value="pending">
                            <ContactLogsTable
                                logs={(recentLogs || []).filter(log => log.status === 'contacted')}
                                showFilters={false}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}