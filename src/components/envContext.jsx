import { useNavigate } from "react-router";

const { createContext, useState, useEffect } = require("react");

export const EnvContext = createContext();

const UserContext = ({ children }) => {
  const [env, setEnv] = useState({ 
    environment: null, 
    targetAddress: null, 
    portNumber: null,
    chatHistory: null,
    searchHistoryDocs: null,
    searchHistoryGoogleDocs: null});
  useEffect(() => {
    fetch("http://localhost:4000/environmentSettings", {
      credentials: "include",
    })
      .then(r => {
        return r.json();
      })
      .then(data => {
        setEnv({
          environment: data.environment,
          targetAddress: data.targetAddress, 
          portNumber: data.portNumber,
          chatHistory: data.chatHistory,
          searchHistoryDocs: data.searchHistoryDocs,
          searchHistoryGoogleDocs: data.searchHistoryGoogleDocs
        })})
        }, []);
  return (
    <EnvContext.Provider value={{ env, setEnv }}>
      {children}
    </EnvContext.Provider>
  );
};

export default UserContext;