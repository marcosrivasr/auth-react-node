import { useEffect, useState } from "react";
import PortalLayout from "../layout/PortalLayout";
import { useAuth } from "../auth/AuthProvider";
import Cookies from "js-cookie";

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

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
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
  }, []);

  return (
    <PortalLayout>
      <h1>Dashboard de {auth.getUser()?.name ?? ""}</h1>
      <div>
        {posts.map((post: Todo) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.completed}</p>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
