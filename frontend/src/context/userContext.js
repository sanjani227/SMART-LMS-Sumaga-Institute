

import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({
  name: "",
  setName: (name) => {},
});

export function UserProvider({children}) {
  const [name, setName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("NAME") || "GUEST";
    setName(name);
  }, []);

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
}
