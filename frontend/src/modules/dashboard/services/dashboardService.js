// Servicios específicos del dashboard
export const dashboardService = {
  getStats: async () => {
    // Aquí iría la llamada a la API para obtener estadísticas
    return {
      balance: 0,
      successfulPayments: 0,
      recentActivity: 0
    };
  },
  
  getRecentActivity: async () => {
    // Aquí iría la llamada a la API para obtener actividad reciente
    return [];
  }
};