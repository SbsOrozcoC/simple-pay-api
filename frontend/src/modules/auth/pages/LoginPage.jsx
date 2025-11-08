import AuthForm from "../components/AuthForm";
import { authService } from "../services/authService";

export default function LoginPage() {
  const handleLogin = async (form) => {
    const res = await authService.login(form);
    console.log(res);
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
}
