import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { createPost } from "../../api/api";
import { useAuth } from "../../auth/AuthProvider";

export default function PostCreation({ setPosts }) {
  const { loggedInUser } = useAuth();
  const [postBody, setPostBody] = useState("");
  const isPostEmpty = postBody.trim() === "";
  const lengthLimit = 250;

  const [alert, setAlert] = useState({
    show: false,
    success: false,
    message: "",
  });
  if (alert.show) {
    setTimeout(() => {
      setAlert({ show: false, success: false, message: "" });
    }, 3000);
  }

  const tooltipRef = useRef();

  useEffect(() => {
    let tooltipInstance;
    let hideTimeout;

    const showTooltip = () => {
      if (tooltipRef.current && isPostEmpty) {
        tooltipInstance = new window.bootstrap.Tooltip(tooltipRef.current, {
          title: "Cannot post an empty post",
          placement: "bottom",
          trigger: "manual",
          container: "body",
        });
        tooltipInstance.show();

        hideTimeout = setTimeout(() => {
          tooltipInstance?.hide();
        }, 3000);
      }
    };

    const hideTooltip = () => {
      if (tooltipInstance) {
        tooltipInstance.hide();
      }
      clearTimeout(hideTimeout);
    };

    const currentTooltipRef = tooltipRef.current;

    if (currentTooltipRef) {
      // @ts-ignore
      currentTooltipRef.addEventListener("mouseenter", showTooltip);
      // @ts-ignore
      currentTooltipRef.addEventListener("mouseleave", hideTooltip);
    }

    return () => {
      if (currentTooltipRef) {
        // @ts-ignore
        currentTooltipRef.removeEventListener("mouseenter", showTooltip);
        // @ts-ignore
        currentTooltipRef.removeEventListener("mouseleave", hideTooltip);
      }
      tooltipInstance?.dispose();
    };
  }, [postBody, isPostEmpty]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPostBody(value);
  };

  const handlePost = async () => {
    if (isPostEmpty) return;

    try {
      const { success, data, message } = await createPost({
        user: loggedInUser._id,
        username: loggedInUser.name,
        body: postBody,
      });
      if (success) {
        setPosts((prev) => [data, ...prev]);
        setPostBody("");
        setAlert({
          show: true,
          success: true,
          message: message,
        });
      } else {
        setAlert({
          show: true,
          success: false,
          message: message ?? "An error occured!",
        });
      }
    } catch (error) {
      console.log(error);
    }

    alert.show &&
      setTimeout(() => {
        setAlert({ show: false, success: false, message: "" });
      }, 3000);
  };

  const handleDiscard = () => {
    setPostBody("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  const limitReached = postBody.length >= lengthLimit;
  const limitNear =
    postBody.length >= lengthLimit - 50 && postBody.length < lengthLimit;
  const limitClass = limitReached
    ? "limit-danger"
    : limitNear
    ? "limit-warning"
    : "";
  const limitWarning = limitReached
    ? "text-danger"
    : limitNear
    ? "text-warning"
    : "text-muted";

  return (
    <div
      className="row w-100 align-items-center column-gap-5"
      style={{ height: "auto" }}
    >
      <div
        className="col-md-6 p-3 bg-primary-subtle d-flex flex-column 
      justify-content-center gap-2 rounded-5 border border-primary border-2"
        style={{ height: "auto" }}
      >
        <div className="d-flex flex-column">
          <div
            className="d-flex gap-3 flex-grow-1 justify-content-start 
          align-items-center text-accent "
          >
            <i className="fa-regular fa-circle-user fa-2xl fs-1 text-primary-accent"></i>
            <TextareaAutosize
              name="post-body"
              className={`form-control m-0 fw-normal resize-none outline-none ${limitClass} `}
              placeholder="What's on your mind?"
              value={postBody}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              maxLength={lengthLimit}
              maxRows={4}
            />
          </div>
          <p
            className={`${limitWarning} m-0 p-0 align-self-end`}
          >{`${postBody.length}/${lengthLimit}`}</p>
        </div>
        <div className="d-flex gap-3 flex-grow-0 justify-content-end align-items-center">
          {alert.show && (
            <div
              className={`alert p-1 m-0-force ${
                alert.success ? "alert-success" : "alert-danger"
              } text-center fade-in-out w-100 flex-grow-1`}
              role="alert"
              onAnimationEnd={() => {
                setAlert({ show: false, success: false, message: "" });
              }}
            >
              {alert.message}
            </div>
          )}
          <div ref={tooltipRef}>
            <button
              className="btn btn-outline-primary rounded-pill fw-medium border-2"
              onClick={handlePost}
              disabled={isPostEmpty}
            >
              Post
            </button>
          </div>
          <button
            className="btn btn-outline-dark rounded-pill fw-medium border-2"
            onClick={handleDiscard}
          >
            Discard
          </button>
        </div>
      </div>
      <div className="col-auto border border-success border-2"></div>
    </div>
  );
}

PostCreation.propTypes = {
  setPosts: PropTypes.func,
};
