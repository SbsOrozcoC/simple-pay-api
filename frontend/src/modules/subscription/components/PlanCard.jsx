export default function PlanCard({ onSubscribe, isLoading = false }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
            <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Premium</h3>
                <p className="text-gray-600 mb-4">Acceso completo a todas las funciones</p>

                <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">$10</span>
                    <span className="text-gray-600">/mes</span>
                </div>

                <ul className="text-left space-y-2 mb-6">
                    <li className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Pagos ilimitados
                    </li>
                    <li className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Historial completo
                    </li>
                    <li className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Soporte prioritario
                    </li>
                </ul>

                <button
                    onClick={onSubscribe}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                    {isLoading ? 'Procesando...' : 'Suscribirse ahora'}
                </button>

                <p className="text-xs text-gray-500 mt-3">
                    Pago seguro • Cancelación en cualquier momento
                </p>
            </div>
        </div>
    );
}