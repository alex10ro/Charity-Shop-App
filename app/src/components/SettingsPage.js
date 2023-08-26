/**
 * Settings Page component
 *
 * This would allow the user to change the colour and brand logo of the app 
 * It is not functional, it is just to show how would a setting page for this app would look like 
 *
 * @author Cristian Mitoi
 */


import React, { useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import Wheel from "@uiw/react-color-wheel";
import "./SettingsPage.css";

function SettingsPage(props) {
  const { isAdmin } = props;
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 });
  const [show, setShow] = useState(false);

  const handleLogout = () => {
    props.handleLogout();
    navigate("/login");
  };

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <div className="SettingsPage">
      {isAdmin ? (
        <div>
          <div>
            <NavBar
              handleLogout={handleLogout}
              username={username}
              link={"/dissertation/app/admin"}
            />

            <h1>Settings Page</h1>
          </div>

          <div className="borderSettings">
            <div className="settings">
              <div className="colourBtn">
                <button onClick={handleClick}>Change Colour</button>
              </div>

              {show && (
                <div className="wheel">
                  <Wheel
                    color={hsva}
                    onChange={(color) => {
                      setHsva({ ...hsva, ...color.hsva });
                    }}
                  />
                </div>
              )}

              <div className="imgBtn">
                <label htmlFor="logo">Choose a logo: &nbsp;</label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/png, image/jpeg"
                ></input>
              </div>

              <div className="applyBtn">
                <button>Apply</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="notLogged">
          <h1>You have to be logged in as and admin to see this page</h1>
          <a href="/dissertation/app/login">Press Here to Log In</a>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
