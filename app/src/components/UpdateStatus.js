/**
 * Updating Status Component
 *
 *
 * @author Cristian Mitoi
 */

import Button from "react-bootstrap/Button";
import badwordsList from "badwords-list";

function UpdateStatus(props) {
  const handlePress = (event) => {
    props.handleNextMessage();

    const hasBadWords = badwordsList.array.some((word) =>
      props.messages.message.toLowerCase().includes(word.toLowerCase())
    );

    // show confirmation pop-up if message contains bad words
    if (event.target.value === "approved" && hasBadWords) {
      const confirmApprove = window.confirm(
        "This message contains bad words. Are you sure you want to approve it?"
      );
      if (!confirmApprove) {
        return;
      }
    }

    //Create form data to pass the award and paper_id to the API
    const formData = new FormData();
    formData.append("status", event.target.value);
    formData.append("message_id", props.messages.message_id);
    formData.append("updated_by", props.username);

    //get token from the local storage
    const token = localStorage.getItem("token");

    fetch("https://cashed-benches.000webhostapp.com/dissertation/api/update", {
      method: "POST",
      headers: new Headers({ Authorization: "Bearer " + token }),
      body: formData,
    })
      .then((response) => response.text())
      .then((json) => {
        props.handleUpdate();
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  return (
    <div>
      {props.messages.status === "dismissed" ? (
        <div className="buttons">
          <Button
            variant="success"
            value="approved"
            id="approved"
            onClick={handlePress}
          >
            Approve
          </Button>
        </div>
      ) : (
        <>
          <div className="buttons">
            <Button
              variant="success"
              value="approved"
              id="approved"
              onClick={handlePress}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              value="dismissed"
              id="dismissed"
              onClick={handlePress}
            >
              Dismiss
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
export default UpdateStatus;
