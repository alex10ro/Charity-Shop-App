/**
 * Succes page component
 *
 * User gets redirected here if the message was successfully sent. 
 *
 * @author Cristian Mitoi
 */

import React from "react";
import BrandBar from "./BrandBar";
import "./Success.css";

function Success() {
  return (
    <div className="Success">
      <BrandBar />
      <div className="message">
        <p>Your message was successfully sent.</p>
        <p>Thank you for being part of this community!</p>
        <p>
          Press{" "}
          <a href="/dissertation/app/">
            <strong>here</strong>
          </a>{" "}
          if you want to send another message.
        </p>
      </div>
    </div>
  );
}

export default Success;
