// File: components/shared/error-boundary.tsx
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
    children: ReactNode
    fallback?: ReactNode
    onReset?: () => void
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        this.setState({
            error,
            errorInfo
        })

        // Bisa ditambahkan error logging ke service seperti Sentry
        // logErrorToService(error, errorInfo)
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null })
        if (this.props.onReset) {
            this.props.onReset()
        }
    }

    private handleGoHome = () => {
        window.location.href = '/'
    }

    private handleRefresh = () => {
        window.location.reload()
    }

    public render() {
        if (this.state.hasError) {
            // Custom fallback jika disediakan
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-ivory p-4">
                    <Card className="w-full max-w-md border-blush/30">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="rounded-full bg-red-50 p-3">
                                    <AlertTriangle className="h-10 w-10 text-red-500" />
                                </div>
                            </div>
                            <CardTitle className="text-xl text-charcoal">
                                Terjadi Kesalahan
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="text-center">
                            <p className="text-gray-600 mb-4">
                                Maaf, ada masalah teknis. Silakan coba lagi atau hubungi support jika masalah berlanjut.
                            </p>

                            <div className="bg-gray-50 rounded-lg p-3 text-left text-sm font-mono overflow-auto max-h-32">
                                <p className="text-red-600 font-medium">
                                    {this.state.error?.message || 'Unknown error'}
                                </p>
                                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-gray-500">
                                            Stack trace
                                        </summary>
                                        <pre className="text-xs mt-2 whitespace-pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={this.handleRefresh}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Coba Lagi
                            </Button>

                            <Button
                                onClick={this.handleGoHome}
                                className="flex items-center gap-2 bg-blush hover:bg-blush/90"
                            >
                                <Home className="h-4 w-4" />
                                Ke Beranda
                            </Button>

                            {this.props.onReset && (
                                <Button
                                    variant="ghost"
                                    onClick={this.handleReset}
                                >
                                    Reset
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            )
        }

        return this.props.children
    }
}

// Hook untuk error handling yang lebih simple
export function useAsyncError() {
    const [, setError] = React.useState() // ✅ SEKARANG PAKAI React.useState()
    return (error: any) => {
        setError(() => {
            throw error
        })
    }
}