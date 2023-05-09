import { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleChange(e: React.ChangeEvent) {
    const { name, value } = e.target as HTMLInputElement;
    if (name === "username") {
      setUsername(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  }
  return (
    <DefaultLayout>
      <h1>Login</h1>
      <form>
        <label>Username</label>
        <input name="username" onChange={handleChange} value={username} />
        <label>Password</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={password}
        />

        <button>Login</button>
      </form>
    </DefaultLayout>
  );
}
