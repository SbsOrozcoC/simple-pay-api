import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../../dashboard/components/Navbar';
import SubscriptionStatus from '../components/SubscriptionStatus';
import { subscriptionService } from '../services/subscriptionService';
import useAuthStore from '../../auth/store/authStore';

export default function UserPanelPage() {
    const navigate = useNavigate();
    const { subscription, setSubscription, loadSubscription } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);

    useEffect(() => {
        const initializePanel = async () => {
            await loadSubscription();
            setIsLoadingStatus(false);
        };
        initializePanel();
    }, [loadSubscription]);

    const handleCancelSubscription = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción cancelará tu suscripción premium",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'Mantener'
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                const response = await subscriptionService.cancelSubscription();
                if (response.status === 'success') {
                    Swal.fire('Cancelada', response.message, 'success');
                    setSubscription(response.subscription);
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo cancelar la suscripción', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isLoadingStatus) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando panel de usuario...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Panel de Usuario</h1>
                    <p className="text-gray-600 mt-2">Gestiona tu cuenta y suscripción</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Subscription Status Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Tu Suscripción</h2>
                                {(!subscription || subscription.status !== 'active') && (
                                    <button
                                        onClick={() => navigate('/subscription')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                    >
                                        Mejorar Plan
                                    </button>
                                )}
                            </div>
                            <SubscriptionStatus
                                subscription={subscription}
                                onCancel={handleCancelSubscription}
                                isLoading={isLoading}
                                showCancelButton={true}
                            />
                        </div>

                        {/* Account Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de la Cuenta</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Actual</label>
                                    <p className="text-gray-900 font-medium">
                                        {subscription?.status === 'active' ? 'Premium' : 'Básico'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscription?.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : subscription?.status === 'canceled'
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {subscription?.status || 'inactive'}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Miembro desde</label>
                                    <p className="text-gray-900">
                                        {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Próxima renovación</label>
                                    <p className="text-gray-900">
                                        {subscription?.status === 'active' ? 'En 30 días' : 'No aplica'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/subscription')}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
                                >
                                    Gestionar Suscripción
                                </button>
                                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 text-center">
                                    Descargar Facturas
                                </button>
                                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 text-center">
                                    Contactar Soporte
                                </button>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-medium text-blue-800">Soporte Premium</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Los usuarios premium reciben soporte prioritario. Contáctanos para ayuda inmediata.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}