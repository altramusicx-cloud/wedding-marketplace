import RegisterForm from './register-form'

export default function RegisterPage() {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-charcoal mb-2">
                    Buat Akun Baru
                </h1>
                <p className="text-gray-600">
                    Daftar sekarang untuk mulai menemukan vendor wedding terbaik.
                </p>
            </div>

            <RegisterForm />

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Sudah punya akun?{' '}
                    <a
                        href="/login"
                        className="font-medium text-blush hover:text-blush/80"
                    >
                        Masuk sekarang
                    </a>
                </p>
            </div>
        </div>
    )
}