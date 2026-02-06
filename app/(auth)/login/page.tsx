import { LoginForm } from './login-form'

export default function LoginPage() {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-charcoal mb-2">
                    Masuk ke Akun Anda
                </h1>
                <p className="text-neutral-600">
                    Selamat datang kembali! Silakan masuk untuk melanjutkan.
                </p>
            </div>

            <LoginForm />

            <div className="mt-6 text-center">
                <p className="text-neutral-600">
                    Belum punya akun?{' '}
                    <a
                        href="/register"
                        className="font-medium text-primary hover:text-primary/80"
                    >
                        Daftar sekarang
                    </a>
                </p>
            </div>
        </div>
    )
}