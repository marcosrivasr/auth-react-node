import { useEffect, useState } from "react";
import PortalLayout from "../layout/PortalLayout";
import { useAuth } from "../auth/AuthProvider";

export default function Dashboard() {
  const auth = useAuth();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    getPosts();
    async function getPosts() {
      try {
        const response = await fetch("http://localhost:3000/api/posts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });

        if (response.ok) {
          const json = await response.json();
          console.log(json);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <PortalLayout>
      <h1>Dashboard</h1>
    </PortalLayout>
  );
}
