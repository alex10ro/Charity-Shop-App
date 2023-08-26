/**
 * LogIn page component
 *
 * Allows user to enter his Log In details
 * Stores the token in the localSotrage
 *
 * @author Cristian Mitoi
 */

import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import "./LogIn.css";

function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line
  const [authenticated, setAuthenticated] = useState(false);
  const [alert, setAlert] = useState(false);

  const handleAuthenticated = (isAuthenticated) => {
    setAuthenticated(isAuthenticated);
    localStorage.setItem("authenticated", isAuthenticated);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      handleAuthenticated(true);
    }
  });

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  // eslint-disable-next-line
  const handleClick = () => {
    const encodedString = Buffer.from(username + ":" + password).toString(
      "base64"
    );

    //Communicating with the API
    fetch("https://cashed-benches.000webhostapp.com/dissertation/api/auth", {
      method: "POST",
      headers: new Headers({ Authorization: "Basic " + encodedString }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json.message === "succes") {
          const isAdmin = username === "admin";
          localStorage.setItem("isAdmin", isAdmin);
          localStorage.setItem("username", username);

          localStorage.setItem("token", json.data.token);
          handleAuthenticated(true);

          if (isAdmin) {
            window.location.href = "/dissertation/app/admin";
          } else {
            window.location.href = "/dissertation/app/approve";
          }
        } else {
          setAlert(true);
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleClick();
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleClick]);

  return (
    <div className="LogIn">
      {alert ? (
        <div className="Alert">
          <p>Authentication failed. Please try again.</p>
        </div>
      ) : null}
      <div className="Inputs">
        <div className="Border">
          <div className="Logo"></div>
          <p className="title">Brand Name</p>
          <p className="user">
            <input
              type="text"
              id="username"
              placeholder="username"
              size="30"
              value={username}
              onChange={handleUsername}
              required
            />
          </p>
          <p className="pass">
            <input
              type="password"
              id="password"
              placeholder="password"
              size="30"
              value={password}
              onChange={handlePassword}
              required
            />
          </p>
          <p className="logBtn">
            <button onClick={handleClick}>Log In</button>
          </p>
        </div>
      </div>
      <div className="Credits">
        <p>
          &#169; Application created by{" "}
          <a href="https://github.com/alex10ro">Alex</a>
        </p>
      </div>
    </div>
  );
}

export default LogIn;
