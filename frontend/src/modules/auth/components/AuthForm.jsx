import { useState } from "react";

export default function AuthForm({ type = "login", onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      {type === "register" && (
        <input name="name" placeholder="Nombre" onChange={handleChange} required />
      )}
      <input name="email" placeholder="Correo" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
      {type === "register" && (
        <input type="password" name="password_confirmation" placeholder="Confirmar contraseña" onChange={handleChange} required />
      )}
      <button type="submit">{type === "login" ? "Iniciar sesión" : "Registrarse"}</button>
    </form>
  );
}
