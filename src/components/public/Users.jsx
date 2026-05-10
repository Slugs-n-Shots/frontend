import { useState, useEffect } from "react";
import DisplayUser from "./DisplayUser";
import { useApi } from "contexts/ApiContext";
export default function Users() {
  const [users, setUsers] = useState([]);
  const { get } = useApi();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUser = async () => {
      try {
        const response = await get("/employees", {
          signal: controller.signal,
        });

        console.log(JSON.stringify(response.data));
        if (isMounted) {
          setUsers(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
    return () => {
      isMounted = false;
      controller.abort();
    };
  });

  return (
    <article>
      <h2>Users list</h2>
      {users?.length ? (
        <DisplayUser data={users} />
      ) : (
        <p>No usres to display</p>
      )}
    </article>
  );
}
