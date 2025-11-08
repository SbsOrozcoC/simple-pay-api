export default function SubscriptionStatus({ 
  subscription, 
  onCancel, 
  isLoading = false,
  showCancelButton = true 
}) {
    if (!subscription) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-yellow-800 font-medium">No tienes una suscripción activa</span>
                </div>
            </div>
        );
    }

    const isActive = subscription.status === 'active';
    const isCanceled = subscription.status === 'canceled';

    return (
        <div className={`border rounded-lg p-6 ${isActive
                ? 'bg-green-50 border-green-200'
                : isCanceled
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-yellow-50 border-yellow-200'
            }`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Plan Premium - ${subscription.amount}/mes
                    </h3>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                                ? 'bg-green-100 text-green-800'
                                : isCanceled
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {subscription.status}
                        </span>

                        {subscription.activated_at && (
                            <span>Activa desde: {new Date(subscription.activated_at).toLocaleDateString()}</span>
                        )}

                        {subscription.transaction_id && (
                            <span>ID: {subscription.transaction_id}</span>
                        )}
                    </div>
                </div>

                {isActive && showCancelButton && (
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                        {isLoading ? 'Cancelando...' : 'Cancelar Suscripción'}
                    </button>
                )}
            </div>
        </div>
    );
}