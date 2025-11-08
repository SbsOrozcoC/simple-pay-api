import Swal from "sweetalert2";
import AuthForm from "../components/AuthForm";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (form) => {
    try {
      const res = await authService.login(form);

      if (res.errors?.email || res.message?.includes("Credenciales inválidas")) {
        Swal.fire("Error", "Correo o contraseña incorrectos.", "error");
      } else if (res.token) {
        // Guarda el token (para futuras peticiones)
        localStorage.setItem("token", res.token);

        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: "Inicio de sesión exitoso",
          confirmButtonText: "Continuar",
        }).then(() => {
          navigate("/dashboard");
        });
      } else {
        Swal.fire("Error", "Ocurrió un problema al iniciar sesión.", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Error de conexión con el servidor.", "error");
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}