import { useNavigate } from "react-router";

const { createContext, useState, useEffect } = require("react");

export const EnvContext = createContext();

const UserContext = ({ children }) => {
  const [env, setEnv] = useState({ environment: null });
  useEffect(() => {
    fetch("http://localhost:4000/environmentSettings", {
      credentials: "include",
    })
      .then(r => {
        return r.json();
      })
      .then(data => {
        console.log(data.environment, ' From EnvContext')
        setEnv(data.environment);
      });
  }, []);
  return (
    <EnvContext.Provider value={{ env, setEnv }}>
      {children}
    </EnvContext.Provider>
  );
};

export default UserContext;