/** 
 * 
 * Handles Routes to the landing pages
 * 
 * @author Cristian Mitoi
 */

import React, {useEffect, useState} from "react";
import { Routes, Route } from "react-router-dom";
import './App.css';
import HomePage from './components/HomePage';
import Success from "./components/Success";
import ApprovePage from "./components/ApprovePage";
import LogIn from "./components/LogIn";
import AdminPage from "./components/AdminPage";
import SettingsPage from "./components/SettingsPage";
import Documentation from "./components/Documentation";

function App() {

  const [messages, setMessages] = useState([]);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [update, setUpdated] = useState(0);
  const handleUpdate = () => { setUpdated(update + 1) }
  const [authenticated, setAuthenticated] = useState(false);;

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("authenticated");
  };


useEffect( () => {
  fetch("https://cashed-benches.000webhostapp.com/dissertation/api/messages")
  .then(
      (response) => response.json()
  )
  .then(
      (json) => {
          setMessages(json.data)
          setLoading(false)
      }
  )
  .catch(
      (e) => {
          console.log(e.message)
      }
  )
  
},[update]);

useEffect(() => {
  const authenticated = localStorage.getItem('authenticated') === 'true';
  setAuthenticated(authenticated);
}, []);


  return (
    <div className="App">
 <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/success" element={<Success />}/>
        <Route path="/login" element={<LogIn setAuthenticated={setAuthenticated}/>}/>
        <Route path="/approve" element={<ApprovePage messages={messages} handleUpdate={handleUpdate} authenticated={authenticated} setAuthenticated={setAuthenticated} handleLogout={handleLogout} loading={loading}/>}/> 
        <Route path="/admin" element={<AdminPage isAdmin={isAdmin} messages={messages} handleLogout={handleLogout} loading={loading}/>} />
        <Route path="/settings" element={<SettingsPage isAdmin={isAdmin} handleLogout={handleLogout}/>} />
        <Route path="/documentation" element={<Documentation />}/>
        <Route path="*" element={<p>404 Not found</p>}/>
 </Routes>
      </div>
  );
}

export default App;