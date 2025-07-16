
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 const [resultado,setResultado] = useState('')  
  return (
    <AuthContext.Provider value={{resultado,setResultado}}>
      {children}
    </AuthContext.Provider>
  );
};