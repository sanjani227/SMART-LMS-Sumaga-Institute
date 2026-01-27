

import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({
  name: "",
  setName: (name) => {},
  userType: "",
  setUserType: (userType) => {}
});



export function UserProvider({children}) {
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("NAME") || "GUEST";
    const userType = localStorage.getItem("USER_TYPE") || "guest";
    setName(name);
    setUserType(userType)
  }, []);

  return (
    <UserContext.Provider value={{ name, setName , userType, setUserType}}>
      {children}
    </UserContext.Provider>
  );
}
