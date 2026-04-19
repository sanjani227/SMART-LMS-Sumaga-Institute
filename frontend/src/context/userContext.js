/**
 * ========== USER CONTEXT PROVIDER ==========
 * File: frontend/src/context/userContext.js
 * Purpose: React context for managing global user state (name, type)
 * 
 * @section Context Definition
 */

import { createContext, useEffect, useState } from "react";

// ========== USER CONTEXT CREATION ==========
/**
 * Global context for user information
 * @property {string} name - Current user's display name
 * @property {string} userType - Current user's role (student, teacher, parent, admin)
 */
export const UserContext = createContext({
  name: "",
  setName: (name) => {},
  userType: "",
  setUserType: (userType) => {}
});

// ========== USER PROVIDER COMPONENT ==========
/**
 * Wraps app with user context provider
 * Loads user data from localStorage on mount
 */
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
