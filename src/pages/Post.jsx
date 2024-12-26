import CardContainer from "@/components/common/CardContainer";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Modal from "@/components/common/Modal";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { deletePost, getPostById, likePost, updatePost } from "../api/api";
import { useAuth } from "../auth/AuthProvider";

export default function Post() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();

  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  let errorText = useRef("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const fetchPost = async () => {
      try {
        const response = await getPostById(id);
        setPost(response.data);
        setPostBody(response.data.body);
        setLikesCount(response.data.likes.length);
        setIsLiked(response.data.likes.includes(loggedInUser?._id));
        setIsEditing(
          searchParams.get("edit") === "true" &&
            response.data.user === loggedInUser?._id
        );
      } catch (error) {
        errorText.current = `Error fetching post\n${error}`;
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, loggedInUser?._id, location.search]);

  const handleEditToggle = (isEditMode) => {
    const currentParams = new URLSearchParams(location.search);

    if (isEditMode) {
      currentParams.set("edit", "true");
    } else {
      currentParams.delete("edit");
    }

    navigate(`${location.pathname}?${currentParams.toString()}`, {
      replace: true,
    });
  };

  const handleDelete = async () => {
    try {
      const { success, data, message } = await deletePost(postId);
      console.log(success, data, message);
      if (success) {
        // @ts-ignore
        navigate("/", { replace: true });
      } else {
        console.log("Failed to delete post");
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  if (isLoading) {
    return (
      <div
        className="d-flex app justify-content-center align-items-center my-auto"
        style={{ height: "90vh" }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (!post) {
    return <p className="text-center mt-5">{errorText.current}</p>;
  }

  const { _id: postId, img, username, body, user } = post;
  const isCurrentUser = loggedInUser?._id === user;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPostBody(value);
  };

  const handleSave = async () => {
    if (isPostEmpty) return;

    try {
      const { success, message } = await updatePost(postId, {
        body: postBody,
      });

      if (success) {
        setAlert({
          show: true,
          success: true,
          message: message,
        });
        navigate(`${location.pathname}`, { replace: true });
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
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

  const handleLikeUnlike = async () => {
    const like = !isLiked;
    try {
      const { success, data, message } = await likePost(
        postId,
        loggedInUser?._id,
        like
      );

      if (success) {
        setLikesCount(data.likes.length);
        setIsLiked(data.likes.includes(loggedInUser?._id));
      } else {
        console.log(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <main
      className="container-fluid d-flex justify-content-center
       align-items-center align-content-center h-100"
    >
      <CardContainer styleClasses="hoverable col-md-3">
        <div
          id={postId}
          className="d-flex w-100 p-1 flex-column overflow-hidden justify-content-start 
        align-items-start"
        >
          <div className="d-flex w-100 flex-row justify-content-start align-items-center">
            {img ? (
              <img
                className="rounded-circle me-2"
                src="https://via.placeholder.com/42"
                alt="User Image"
                loading="lazy"
              />
            ) : (
              <i
                className="far fa-circle-user text-primary m-0 p-0 me-2"
                style={{ fontSize: "42px" }}
              ></i>
            )}
            <p className="p-0 m-0 fw-semibold fs-5">{username}</p>
            {!isEditing && isCurrentUser && (
              <i
                role="button"
                className="fas fa-edit ms-auto text-accent"
                onClick={() => handleEditToggle(true)}
              ></i>
            )}
          </div>
          <div className="d-flex w-100 flex-column mt-3 justify-content-start align-items-start">
            {isCurrentUser && isEditing ? (
              <TextareaAutosize
                name="post-body"
                className={`w-100  border-primary form-control m-0 fw-normal resize-none outline-none
                   ${limitClass} `}
                value={postBody}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                maxLength={lengthLimit}
                minRows={8}
                maxRows={8}
                autoFocus
              />
            ) : (
              <TextareaAutosize
                className={`w-100 border-0 bg-transparent  resize-none outline-none
                `}
                disabled
                value={body}
              />
            )}
          </div>
          {isEditing && isCurrentUser && (
            <p
              className={`${limitWarning} m-0 p-0 align-self-end`}
            >{`${postBody.length}/${lengthLimit}`}</p>
          )}
          <hr className="text-primary border-1 fs-2 w-100 mt-4" />
          <div className="d-flex w-100 p-0 m-0 justify-content-start align-items-center">
            {isEditing && isCurrentUser ? (
              <div className="ms-auto d-flex gap-2">
                <div ref={tooltipRef}>
                  <button
                    className="btn btn-outline-primary rounded-pill fw-medium border-2"
                    onClick={handleSave}
                    disabled={isPostEmpty}
                  >
                    Save Changes
                  </button>
                </div>

                <button
                  type="button"
                  className="btn border-2 rounded-pill back-btn text-semibold "
                  onClick={() => handleEditToggle(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-start justify-content-between w-100">
                <div className="d-flex">
                  <div
                    role="button"
                    onClick={handleLikeUnlike}
                    className={`icon ${isLiked ? "clicked" : ""}`}
                  >
                    <svg
                      className="heart-main"
                      viewBox="0 0 512 512"
                      width="22"
                    >
                      <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" />
                    </svg>
                  </div>
                  <p className="p-0 m-0 ms-1 fw-medium">{likesCount}</p>
                </div>
                <button
                  type="button"
                  className="btn border-2 rounded-pill back-btn text-semibold "
                  onClick={handleGoBack}
                >
                  Back
                </button>
              </div>
            )}
          </div>
          <Modal
            key={postId}
            id={`dlt-post-${postId}-modal`}
            title={`Delete post?\n`}
            cancelText="Cancel"
            confirmText="Delete"
            onConfirm={handleDelete}
            showButtons={true}
            size="sm"
          />
        </div>
      </CardContainer>
    </main>
  );
}
