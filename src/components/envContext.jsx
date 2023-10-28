const { createContext, useState, useEffect } = require("react");

export const EnvContext = createContext();

const UserContext = ({ children }) => {
  const [env, setEnv] = useState({ 
    llamaEnvironment: null, 
    llamaTargetAddress: null, 
    llamaPortNumber: null,
    solrEnvironment: null, 
    solrTargetAddress: null, 
    solrPortNumber: null,
    chatHistory: null,
    searchHistoryDocs: null,
    searchHistoryGoogleDocs: null,
    documentBuildContents: null,
    currentDocument: null});
  useEffect(() => {
    fetch("http://localhost:4000/environmentSettings", {
      credentials: "include",
    })
      .then(r => {
        return r.json();
      })
      .then(data => {
        setEnv({
          llamaEnvironment: data.llamaEnvironment, 
          llamaTargetAddress: data.solrTargetAddress, 
          llamaPortNumber: data.llamaPortNumber,
          solrEnvironment: data.solrEnvironment, 
          solrTargetAddress: data.solrTargetAddress, 
          solrPortNumber: data.solrPortNumber,
          chatHistory: data.chatHistory,
          searchHistoryDocs: data.searchHistoryDocs,
          searchHistoryGoogleDocs: data.searchHistoryGoogleDocs,
          documentBuildContents: data.documentBuildContents,
          currentDocument: data.currentDocument
        })})
        }, []);
  return (
    <EnvContext.Provider value={{ env, setEnv }}>
      {children}
    </EnvContext.Provider>
  );
};

export default UserContext;