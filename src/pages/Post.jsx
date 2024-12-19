import CardContainer from "@/components/common/CardContainer";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Modal from "@/components/common/Modal";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deletePost, getPostById, likePost } from "../api/api";
import { useAuth } from "../auth/AuthProvider";

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();

  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  let errorText = useRef("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById(id);
        setPost(response.data);
        setLikesCount(response.data.likes.length);
        setIsLiked(response.data.likes.includes(loggedInUser._id));
      } catch (error) {
        errorText.current = `Error fetching post\n${error}`;
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, loggedInUser._id]);

  const handleDelete = async () => {
    try {
      const { success, data, message } = await deletePost(postId);
      console.log(success, data, message);
      if (success) {
        // @ts-ignore
        navigate("/");
      } else {
        console.log("Failed to delete post");
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleLikeUnlike = async () => {
    const like = !isLiked;
    try {
      const { success, data, message } = await likePost(
        postId,
        loggedInUser._id,
        like
      );

      if (success) {
        setLikesCount(data.likes.length);
        setIsLiked(data.likes.includes(loggedInUser._id));
      } else {
        console.log(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { _id: postId, img, username, body } = post;

  return (
    <main
      className="container-fluid d-flex justify-content-center
     align-items-center align-content-center h-100"
    >
      <CardContainer styleClasses="hoverable">
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

            {/* {loggedInUser._id !== user
          ? loggedInUser.role === "admin"
            ? actionsDropdown
            : null
          : actionsDropdown} */}
          </div>
          <div className="d-flex flex-column mt-3 justify-content-start align-items-start">
            <p className="p-0 m-0 mb-1 fw-normal">{body}</p>
          </div>
          <hr className="text-primary border-1 fs-2 w-100 mt-4" />
          <div className="d-flex p-0 m-0 justify-content-start align-items-center">
            <div
              role="button"
              onClick={handleLikeUnlike}
              className={`icon ${isLiked ? "clicked" : ""}`}
            >
              <svg className="heart-main" viewBox="0 0 512 512" width="22">
                <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" />
              </svg>
            </div>
            <p className="p-0 m-0 ms-1 fw-medium">{likesCount}</p>
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
