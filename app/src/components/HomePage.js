/**
 * Home page component
 *
 * This is the main landing page for when the QR code is scanned
 *
 * @author Cristian Mitoi
 */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import BarcodeScanner from "./BarcodeScanner";
import "./HomePage.css";
import BrandBar from "./BrandBar";
import Popup from "./Popup";
import ModalPopUp from "./ModalPopUp";

function HomePage() {
  const [visible, setVisible] = useState(false);
  const [expand, setExpand] = useState(false);
  const [value, setValue] = useState("Type your message here");
  const [productId, setProductId] = useState("");
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [donorAlert, setDonorAlert] = useState(false);
  const [productAlert, setProductAlert] = useState(false);
  const [textAlert, setTextAlert] = useState(false);
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(true);
  const homePageElement = document.getElementsByClassName("HomePage")[0];
  const navigate = useNavigate();

  const toggleExpand = () => {
    setExpand(!expand);
  };

  const messageRef = useRef(null);

  //function to delete initial message when focused
  const handleFocus = (event) => {
    if (value === "Type your message here") {
      const messageBoxElement =
        document.getElementsByClassName("messageBox")[0];
      messageBoxElement.classList.add("show");
      setValue("");
      messageRef.current.removeEventListener("focus", handleFocus);
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleScan = (result) => {
    setProductId(result);
    setVisible(false);
    setExpand(false);
    homePageElement.classList.remove("expanded");
  };

  //function to get data from the API
  const handleSubmit = (event) => {
    event.preventDefault();

    if (value === "Type your message here") {
      setTextAlert(true);
    }

    fetch(
      "https://cashed-benches.000webhostapp.com/dissertation/api/donor?product_id=" +
        productId
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setData(json.data);
        if (json.data.length === 0) {
          setProductAlert(true);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  //when user clicks the confirm button, his message will be sent to the API
  const handleConfirm = () => {
    const messageInput = document.getElementById("message");
    const donorInput = document.getElementById("donor");

    const message = messageInput.value;
    const donor = donorInput.value;

    //Communicating with the API
    fetch("https://cashed-benches.000webhostapp.com/dissertation/api/receive", {
      method: "POST",
      body: new URLSearchParams({ message: message, donor: donor }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
        if (json.message === "succes") {
          navigate("/success");
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.checked;
    const textToBold = document.getElementById("textToBold");
    if (value) {
      setCheckboxChecked(true);
      textToBold.style.fontWeight = "bold";
    } else {
      setCheckboxChecked(false);
      textToBold.style.fontWeight = "normal";
    }
  };

  //storing in the local storage if the user checked the checkbox before
  const handleConfirmCheckbox = () => {
    if (checkboxChecked === true) {
      setShowCheckbox(false);
      localStorage.setItem("showCheckbox", JSON.stringify(checkboxChecked));
      localStorage.setItem("showInstructions", JSON.stringify(false));
    }
    setShowInstructions(false);
  };

  //checks if the donor id matches the item id
  const checkDonorId = (donorId) => {
    const matchingDonor = data.find(
      (donor) => donor.donor_id.trim() === donorId.trim()
    );

    //if matched, then show the confirmation popup
    if (matchingDonor && !textAlert) {
      setShowPopup(true);
      setProductName(matchingDonor.name);
      setProductImage(matchingDonor.image);
    } else {
      setDonorAlert(true);
    }
  };

  useEffect(() => {
    if (homePageElement) {
      if (expand) {
        homePageElement.classList.add("expanded");
      } else {
        homePageElement.classList.remove("expanded");
      }
    }

    if (messageRef.current) {
      messageRef.current.addEventListener("focus", handleFocus);
    }

    const instructionsValue = localStorage.getItem("showInstructions");
    const checkboxValue = JSON.parse(localStorage.getItem("showCheckbox"));
    if (instructionsValue !== null) {
      setShowInstructions(JSON.parse(instructionsValue));
      setCheckboxChecked(checkboxValue);
      setShowCheckbox(!checkboxValue);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expand]);

  useEffect(() => {
    if (data.length > 0) {
      const donorIdInput = document.getElementById("donor");
      checkDonorId(donorIdInput.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="HomePage">
      <BrandBar />

      <button
        className="instructions"
        onClick={() => setShowInstructions(true)}
      >
        Instructions
      </button>

      <form onSubmit={handleSubmit}>
        <div className="IDs">
          <label htmlFor="donor">Gift AID</label>
          <p>
            <input id="donor" required />
          </p>
          <label htmlFor="product">Item ID</label>
          <p>
            <input
              id="product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            />
          </p>
          <button
            id="scannerBtn"
            type="button"
            onClick={(event) => {
              event.preventDefault();
              setVisible(!visible);
              toggleExpand();
            }}
          >
            {visible ? "Hide" : "Show"}
          </button>
          <div className="scanner">
            {visible && <BarcodeScanner onScan={handleScan} />}
          </div>
        </div>

        <div className="messageBox">
          <p>
            Write a nice message and we will make sure
            the donor receives it. Thank you for spreading positivity in our
            community!{" "}
          </p>
          <textarea
            id="message"
            value={value}
            rows={4}
            cols={40}
            onChange={handleChange}
            ref={messageRef}
            required
          />
        </div>
        <p>
          <button className="submit" type="submit">
            Submit
          </button>
        </p>
      </form>

      <Popup trigger={showPopup} setTrigger={setShowPopup}>
        <h3>One more step</h3>
        <p className="productName">{`Is the item you bought a ${productName}?`}</p>
        <img src={`${productImage}`} alt="" width="180" height="200" />
        <p className="productText">
          &nbsp;&nbsp;&nbsp; If yes, then press confirm and your message will be
          sent to the donor, otherwise press cancel and make sure you entered
          the correct ID details
        </p>
        <button className="confirmButton" onClick={handleConfirm}>
          Confirm
        </button>
        <button className="cancelButton" onClick={() => setShowPopup(false)}>
          Cancel
        </button>
      </Popup>

      <ModalPopUp
        show={showInstructions}
        onHide={() => setShowInstructions(false)}
        title={"How to use"}
        body={
          <>
            <p>You just bought a nice Item and you want to thank the donor?</p>
            <p>
              It is as simple as it can get. All you have to do is enter the
              Gift Aid* situated on the item label.
            </p>
            <p>
              Once entered, you will have to scan the item barcode by simply
              pressing the "show" button.
            </p>
            <p>
              Enter your message in the box below, then press "Submit" and we
              will make sure the donor will receive it.
            </p>
            <p>Thank you for being part of our community!</p>
            <br></br>
            <p>
              * Gift Aid is the number that connects the donor to the item you
              just bought.
            </p>
            <p>
              * The message will be sent anonymously and no personal data will
              be collected.
            </p>
            <div>
              {showCheckbox && (
                <label>
                  <input type="checkbox" onChange={handleCheckboxChange} />
                  <span id="textToBold"> Don't show it again</span>
                </label>
              )}
            </div>
          </>
        }
        footer={
          showCheckbox ? (
            <button className="instructionsBtn" onClick={handleConfirmCheckbox}>
              Confirm
            </button>
          ) : (
            <button
              className="instructionsBtn"
              onClick={() => setShowInstructions(false)}
            >
              Confirm
            </button>
          )
        }
      />
      {donorAlert && (
        <Alert
          variant="warning"
          onClose={() => setDonorAlert(false)}
          dismissible
        >
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>It seems that the Gift Aid is incorrect. Please try again.</p>
        </Alert>
      )}

      {productAlert && (
        <Alert
          variant="warning"
          onClose={() => setProductAlert(false)}
          dismissible
        >
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>It seems that the Item ID is incorrect. Please try again.</p>
        </Alert>
      )}

      {textAlert && !productAlert && !donorAlert && (
        <Alert
          variant="warning"
          onClose={() => setTextAlert(false)}
          dismissible
        >
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>It seems that you have not entered a message.</p>
        </Alert>
      )}
    </div>
  );
}

export default HomePage;
