import Swal from "sweetalert2";
import AuthForm from "../components/AuthForm";
import "../styles/auth.css";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (form) => {
    const res = await authService.register(form);

    if (res.errors?.email) {
      Swal.fire("Error", "El correo ya está registrado.", "error");
    } else if (res?.message === "Usuario registrado correctamente" || res?.success) {
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Tu cuenta ha sido creada correctamente",
        confirmButtonText: "Ir al login",
      }).then(() => navigate("/login"));
    } else {
      Swal.fire("Error", res?.message || "Ocurrió un problema. Verifica tus datos.", "error");
    }
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
}