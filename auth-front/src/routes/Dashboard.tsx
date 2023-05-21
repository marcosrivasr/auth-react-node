import { useEffect, useState } from "react";
import PortalLayout from "../layout/PortalLayout";
import { useAuth } from "../auth/AuthProvider";

interface Token {
  accessToken: string;
  refreshToken: string;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function Dashboard() {
  const auth = useAuth();

  const [posts, setPosts] = useState<Todo[]>([]);
  const [value, setValue] = useState("");

  async function getPosts() {
    const accessToken = auth.getAccessToken();
    try {
      const response = await fetch("http://localhost:3000/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setPosts(json);
        console.log(json);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (value.length > 3) {
      try {
        const response = await fetch("http://localhost:3000/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.getAccessToken()}`,
          },
          body: JSON.stringify({ title: value }),
        });
        if (response.ok) {
          const todo = (await response.json()) as Todo;
          setPosts([...posts, todo]);
        }
      } catch (error) {}
    }
  }

  return (
    <PortalLayout>
      <div className="dashboard">
        <h1>Dashboard de {auth.getUser()?.name ?? ""}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="New task to do..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </form>
        {posts.map((post: Todo) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.completed}</p>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
