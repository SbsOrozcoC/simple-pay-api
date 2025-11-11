import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import PlanCard from '../components/PlanCard';
import SubscriptionStatus from '../components/SubscriptionStatus';
import { subscriptionService } from '../services/subscriptionService';
import Navbar from '../../dashboard/components/Navbar';
import useAuthStore from '../../auth/store/authStore';

export default function SubscriptionPage() {
    const navigate = useNavigate();
    const { subscription, setSubscription, loadSubscription } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingStripe, setIsLoadingStripe] = useState(false);
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);

    useEffect(() => {
        const initializeSubscription = async () => {
            await loadSubscription();
            setIsLoadingStatus(false);
        };
        initializeSubscription();
    }, [loadSubscription]);

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const result = await subscriptionService.checkout();

            if (result.status === 'success') {
                await Swal.fire({
                    icon: 'success',
                    title: '¡Suscripción Exitosa!',
                    text: result.message,
                    confirmButtonText: 'Continuar al Panel'
                });
                setSubscription(result.subscription);
                navigate('/panel');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Pago Rechazado',
                    text: result.message,
                    confirmButtonText: 'Intentar Nuevamente'
                });
            }
        } catch (error) {
            console.error('Subscription error:', error);

            if (error.response?.data?.errors?.subscription) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Suscripción Activa',
                    text: error.response.data.errors.subscription[0],
                    confirmButtonText: 'Ir al Panel'
                }).then(() => {
                    navigate('/panel');
                });
            } else {
                Swal.fire('Error', 'Ocurrió un error al procesar la suscripción, ya cuenta con una suscripción activa', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleStripeSubscribe = async () => {
        setIsLoadingStripe(true);
        try {
            const response = await subscriptionService.createStripeCheckoutSession();
            console.log('Respuesta del backend:', response);

            const sessionId = response.sessionId || response.data?.sessionId;

            if (!sessionId) {
                throw new Error('No se recibió sessionId del servidor');
            }

            console.log('Session ID obtenido:', sessionId);

            await subscriptionService.redirectToStripeCheckout(sessionId);

        } catch (error) {
            console.error('Stripe checkout error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error en el pago',
                text: error.message || 'No se pudo iniciar el proceso de pago',
                confirmButtonText: 'Entendido'
            });
        } finally {
            setIsLoadingStripe(false);
        }
    };

    if (isLoadingStatus) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando información...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 overflow-auto">
            <Navbar />

            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Suscripción Premium</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Mejora tu experiencia con nuestro plan premium y accede a todas las funciones exclusivas
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <PlanCard
                            onSubscribe={handleSubscribe}
                            isLoading={isLoading}
                        />

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pago con Stripe</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Pago seguro con tarjeta de crédito a través de Stripe
                            </p>
                            <button
                                onClick={handleStripeSubscribe}
                                disabled={isLoadingStripe}
                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                            >
                                {isLoadingStripe ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Procesando...
                                    </>
                                ) : (
                                    'Suscribirse con Stripe - $10/mes'
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado de tu Suscripción</h2>
                            <SubscriptionStatus
                                subscription={subscription}
                                onCancel={null}
                                showCancelButton={false}
                            />
                            {subscription?.status === 'active' && (
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-700 text-center">
                                        Para cancelar tu suscripción, ve a la sección "Mi Panel"
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-medium text-blue-800">Opciones de pago</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        <strong>Simulado:</strong> 50% de probabilidad de éxito
                                        <br />
                                        <strong>Stripe:</strong> Pago real con tarjeta (modo prueba)
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