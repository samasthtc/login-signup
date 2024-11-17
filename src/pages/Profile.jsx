import EditForm from "@/components/EditForm";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { saveProfile } from "../auth/authService";

export default function Profile() {
  const location = useLocation();
  const [queries, setQueries] = useState({
    userId: null,
    isCurrent: null,
  });

  useEffect(() => {
    const currentQueries = new URLSearchParams(location.search);
    const newQueries = {
      userId: currentQueries.get("id"),
      isCurrent: currentQueries.get("current"),
    };
    if (JSON.stringify(newQueries) !== JSON.stringify(queries)) {
      setQueries(newQueries);
    }
  }, [location, queries]);

  return (
    <main
      className="container-fluid my-5 d-flex justify-content-center
     align-items-center align-content-center"
    >
      <div
        className="row d-flex justify-content-center
     align-items-center align-content-center w-100"
      >
        {!!queries.userId && (
          <EditForm
            userId={queries.userId}
            isCurrent={queries.isCurrent}
            onSubmit={saveProfile}
          />
        )}
      </div>
    </main>
  );
}
