import { useNavigate } from "react-router";

const { createContext, useState, useEffect } = require("react");

export const EnvContext = createContext();

const UserContext = ({ children }) => {
  const [env, setEnv] = useState({ environment: 'Development' });
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:3000/chatQuery", {
      credentials: "include",
    })
      .catch(err => {
        setEnv({ environment: 'Development' });
        return;
      })
      .then(r => {
        if (!r || !r.ok || r.status >= 400) {
            setEnv({ environment: 'Development' });
          return;
        }
        return r.json();
      })
      .then(data => {
        if (!data) {
            setEnv({ environment: 'Development' });
          return;
        }
        setEnv({ ...data });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <EnvContext.Provider value={{ env, setEnv }}>
      {children}
    </EnvContext.Provider>
  );
};

export default UserContext;