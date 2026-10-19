import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import { useState } from "react";
function Login() {

  const navigate = useNavigate();
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
    const handleLogin = async (e) => {
  e.preventDefault();

  const response = await fetch(
    "/api/token/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }
  );

  const data = await response.json();

  console.log("LOGIN DATA:", data);

  if (response.ok) {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
      navigate("/dashboard");
  }
};
  
  return (
    <div className="login-page">
      <Form  onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit">Login</button>
      </Form>
    </div>
  )
}
export default Login;