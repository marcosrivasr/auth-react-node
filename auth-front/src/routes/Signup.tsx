import { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  function handleChange(e: React.ChangeEvent) {
    const { name, value } = e.target as HTMLInputElement;
    if (name === "username") {
      setUsername(value);
    }
    if (name === "password") {
      setPassword(value);
    }
    if (name === "name") {
      setName(value);
    }
  }

  function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(username, password, name);
    fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
    setUsername("");
    setPassword("");
    setName("");
    // window.location.href = "/";
  }

  return (
    <DefaultLayout>
      <h1>Signup</h1>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" onChange={handleChange} value={name} />
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
