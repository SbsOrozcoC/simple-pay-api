import React from 'react';

const SubscriptionStatus = ({ subscription, onCancel, isLoading, showCancelButton }) => {
    if (!subscription) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-500">No tienes una suscripción activa</p>
            </div>
        );
    }

    const isActive = subscription.status === 'active';
    const isCanceled = subscription.status === 'canceled';

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Plan Premium - ${subscription.amount || '10.00'}/mes
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                        {isActive ? 'Activa' : 'Inactiva'} desde: {new Date(subscription.activated_at).toLocaleDateString()}
                    </p>
                    {subscription.transaction_id && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1 font-medium">ID de transacción:</p>
                            <p className="text-xs text-gray-600 break-all font-mono">
                                {subscription.transaction_id}
                            </p>
                        </div>
                    )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {isActive ? 'Activa' : 'Inactiva'}
                </span>
            </div>

            {isActive && showCancelButton && onCancel && (
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Cancelando...
                        </>
                    ) : (
                        'Cancelar Suscripción'
                    )}
                </button>
            )}

            {isCanceled && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700 text-center">
                        Tu suscripción ha sido cancelada y permanecerá activa hasta el final del período actual.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SubscriptionStatus;