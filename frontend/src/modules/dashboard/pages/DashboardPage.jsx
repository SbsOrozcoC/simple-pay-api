import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import { subscriptionService } from '../../subscription/services/subscriptionService';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await subscriptionService.getSubscription();
      setSubscription(response.subscription);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Calcular estadísticas basadas en la suscripción
  const successfulPayments = subscription?.status === 'active' ? 1 : 0;
  const recentActivity = subscription ? 1 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Header with Subscription Status */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">Bienvenido al Dashboard</h1>
                  <p className="mt-2 text-gray-600">Has iniciado sesión correctamente en SimplePay</p>

                  {/* Subscription Status */}
                  {!isLoading && (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${subscription?.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : subscription?.status === 'canceled'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {subscription ? `Suscripción ${subscription.status}` : 'Sin suscripción activa'}
                      </span>
                      {subscription?.activated_at && (
                        <span className="text-sm text-gray-600">
                          Desde: {new Date(subscription.activated_at).toLocaleDateString()}
                        </span>
                      )}
                      {subscription?.transaction_id && (
                        <span className="text-sm text-gray-500">
                          ID: {subscription.transaction_id.substring(0, 8)}...
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {subscription?.status !== 'active' && (
                    <button
                      onClick={() => navigate('/subscription')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                    >
                      Mejorar a Premium
                    </button>
                  )}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 text-sm font-medium">Sesión activa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
          <StatsCard
            icon={
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
            title="Saldo Actual"
            value="$0.00"
            color="blue"
          />

          <StatsCard
            icon={
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Pagos Exitosos"
            value={successfulPayments.toString()}
            color="green"
          />

          <StatsCard
            icon={
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            title="Actividad Reciente"
            value={recentActivity.toString()}
            color="purple"
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-0">
          {/* Quick Actions */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Acciones Rápidas</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => navigate('/subscription')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 text-center flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Gestionar Suscripción
                </button>
                <button
                  onClick={() => navigate('/panel')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 text-center flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mi Panel de Usuario
                </button>
                <button
                  onClick={() => navigate('/subscription')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 text-center flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Ver Historial de Pagos
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Actividad Reciente</h2>
            </div>
            <div className="p-6">
              {subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Suscripción Premium Activada</p>
                        <p className="text-xs text-gray-500">
                          {new Date(subscription.activated_at).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded">
                      +${subscription.amount}
                    </span>
                  </div>

                  {subscription.status === 'canceled' && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Suscripción Cancelada</p>
                          <p className="text-xs text-gray-500">
                            {new Date(subscription.canceled_at).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2 text-gray-600">No hay actividad reciente</p>
                  <p className="text-sm text-gray-500 mt-1">Los pagos y transacciones aparecerán aquí</p>
                  <button
                    onClick={() => navigate('/subscription')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Comenzar con Premium
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}