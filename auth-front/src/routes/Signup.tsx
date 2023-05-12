import { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(username, password, name);

    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name }),
      });
      if (response.ok) {
        const json = await response.json();
        console.log(json);
        //auth.setIsAuthenticated(true);
        //auth.setAccessToken(json.token);
      }
    } catch (error) {
      console.log(error);
    }

    setUsername("");
    setPassword("");
    setName("");
    window.location.href = "/";
  }

  return (
    <DefaultLayout>
      <h1>Signup</h1>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <label>Username</label>
        <input
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button>Create account</button>
      </form>
    </DefaultLayout>
  );
}
