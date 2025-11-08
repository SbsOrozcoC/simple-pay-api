import { useState } from "react";

export default function AuthForm({ type = "login", onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {type === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {type === "login"
              ? "Ingresa a tu cuenta para continuar"
              : "Regístrate para empezar a usar SimplePay"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Campo Nombre (solo para registro) */}
            {type === "register" && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Ingresa tu nombre completo"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                />
              </div>
            )}

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@correo.com"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
            </div>

            {/* Campo Confirmar Contraseña (solo para registro) */}
            {type === "register" && (
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña
                </label>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                />
              </div>
            )}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
          >
            {type === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </button>

          {/* Información adicional */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              {type === "login"
                ? "¿No tienes una cuenta? "
                : "¿Ya tienes una cuenta? "
              }
              <span className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium">
                {type === "login" ? "Regístrate aquí" : "Inicia sesión aquí"}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}