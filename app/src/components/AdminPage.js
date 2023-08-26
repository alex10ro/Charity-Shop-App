/**
 * Admin Page Component
 *
 * Allows the user to see received messages, their status, and who changed their status.
 *
 * @author Cristian Mitoi
 */

import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import ModalPopUp from "./ModalPopUp";
import badwordsList from "badwords-list";
import "./AdminPage.css";

function AdminPage(props) {
  const username = localStorage.getItem("username");
  const [selectValue, setSelectValue] = useState("pending");
  const [selectDate, setSelectDate] = useState("newest");
  const [limit, setLimit] = useState(24);
  const [modalShow, setModalShow] = useState(false);
  const [selectedMessageID, setSelectedMessageID] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  // eslint-disable-next-line
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [updatedBy, setUpdatedBy] = useState(null);
  const { isAdmin, loading } = props;
  const navigate = useNavigate();

  const onChangeSelect = (event) => setSelectValue(event.target.value);
  const onChangeSelect2 = (event) => setSelectDate(event.target.value);

  const handleLogout = () => {
    props.handleLogout();
    navigate("/login");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const showMore = () => {
    if (limit < props.messages.length) {
      setLimit(limit + 12);
    }
  };

  const selectMessages = (value) => {
    if (selectValue === "pending") return value.status === "pending";
    if (selectValue === "approved") return value.status === "approved";
    if (selectValue === "dismissed") return value.status === "dismissed";
    if (selectValue === "all") return true;
  };

  const dateSorting = () => {
    if (selectDate === "newest")
      return (a, b) => new Date(b.created_at) - new Date(a.created_at);
    if (selectDate === "oldest")
      return (a, b) => new Date(a.created_at) - new Date(b.created_at);
  };

  //filtering the bad words from our array using badwordsList
  const filterBadWords = (message) => {
    let filteredMessage = message;
    badwordsList.array.forEach((word) => {
      const re = new RegExp(word, "gi");
      filteredMessage = filteredMessage.replace(
        re,
        `<span style="background-color: #bfc412;">${word}</span>`
      );
    });
    return <div dangerouslySetInnerHTML={{ __html: filteredMessage }} />;
  };

  //storing important data so it can be accessed when the modal PopUp is activated
  const handleShowModal = (messageID, message, status, updatedBY) => {
    setSelectedMessageID(messageID);
    setSelectedMessage(message);
    setSelectedStatus(status);
    setUpdatedBy(updatedBY);
    console.log(updatedBY);
    setModalShow(true);
  };

  //Defining each message from the database as a constant
  //messages are can be sorted by date, approved, dismissed, pending, or all
  const allMessages = props.messages
    .filter(selectMessages)
    .sort(dateSorting())
    .slice(0, limit)
    .map((value, key) => (
      <div key={key}>
        <div
          className="border"
          onClick={() =>
            handleShowModal(
              value.message_id,
              filterBadWords(value.message),
              value.status,
              value.updated_by
            )
          }
        >
          <div className="title">
            {"Message Reference #" + value.message_id}
          </div>
          <div className="message">
            {value.message.length > 80
              ? filterBadWords(value.message.substring(0, 80) + "...")
              : filterBadWords(value.message)}
          </div>
        </div>
      </div>
    ));

  //Function to handle the back/next arrows within the modal PopUp
  //Those two functions take into consideration the selected filters (Oldest/Newest options)
  const handlePrevMessage = () => {
    const currentIndex = props.messages.findIndex(
      (msg) => msg.message_id === selectedMessageID
    );
    let prevIndex = currentIndex - 1;

    if (selectDate === "newest") {
      prevIndex = currentIndex + 1;
    }

    while (prevIndex >= 0 && prevIndex < props.messages.length) {
      if (selectMessages(props.messages[prevIndex])) {
        setSelectedMessageID(props.messages[prevIndex].message_id);
        setSelectedMessage(filterBadWords(props.messages[prevIndex].message));
        setSelectedStatus(props.messages[prevIndex].status);
        setUpdatedBy(props.messages[prevIndex].updated_by);
        break;
      }
      prevIndex = selectDate === "newest" ? prevIndex + 1 : prevIndex - 1;
    }
  };

  const handleNextMessage = () => {
    const index = props.messages.findIndex(
      (message) => message.message_id === selectedMessageID
    );
    let nextIndex = index + 1;

    if (selectDate === "newest") {
      nextIndex = index - 1;
    }

    while (nextIndex < props.messages.length && nextIndex >= 0) {
      if (selectMessages(props.messages[nextIndex])) {
        setSelectedMessageID(props.messages[nextIndex].message_id);
        setSelectedMessage(filterBadWords(props.messages[nextIndex].message));
        setSelectedStatus(props.messages[nextIndex].status);
        setUpdatedBy(props.messages[nextIndex].updated_by);
        break;
      }
      nextIndex = selectDate === "newest" ? nextIndex - 1 : nextIndex + 1;
    }
  };

  //Can scroll through the messages when the modal PopUp is active using the keyboard arrows
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowRight") {
        handleNextMessage();
      }
      if (event.key === "ArrowLeft") {
        handlePrevMessage();
      }
    };
    if (modalShow) {
      window.addEventListener("keydown", handleKeyPress);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleNextMessage, handlePrevMessage]);

  //used for the Modal PopUp
  const backdrop = "static";

  return (
    <div className="AdminPage">
      {isAdmin ? (
        <div>
          <NavBar
            handleLogout={handleLogout}
            username={username}
            settings={<button onClick={handleSettings}>Settings</button>}
            link={"/dissertation/app/admin"}
          />
          <div className="selectSort">
            <select
              className="selectStatus"
              value={selectValue}
              onChange={onChangeSelect}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="dismissed">Dismissed</option>
              <option value="all">All</option>
            </select>

            <select
              className="selectDate"
              value={selectDate}
              onChange={onChangeSelect2}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {/* Loading icon */}
          {props.loading && <div className="loading"></div>}

          <div className="allMessages">{allMessages}</div>

          {/* show/hide "showMore" button. It takes into consideration status filters (e.g: "pending") */}
          {limit < props.messages.filter(selectMessages).length && !loading && (
            <div className="showButtonContainer">
              <button className="showButton" onClick={showMore}>
                Show More
              </button>
            </div>
          )}

          <ModalPopUp
            show={modalShow}
            onHide={() => setModalShow(false)}
            backdrop={backdrop}
            title={"Message Reference #" + selectedMessageID}
            body={selectedMessage}
            footer={
              selectedStatus === "pending"
                ? "Pending message"
                : selectedStatus === "approved"
                ? "Message was APPROVED by " + updatedBy
                : "Message was DISMISSED by " + updatedBy
            }
          />
          {modalShow && (
            <>
              <div
                className="arrow arrow-right"
                onClick={handleNextMessage}
              ></div>
              <div
                className="arrow arrow-left"
                onClick={handlePrevMessage}
              ></div>
            </>
          )}
        </div>
      ) : (
        <div className="notLogged">
          <h1>Please log in to continue.</h1>
          <a href="/dissertation/app/login">Press Here</a>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
