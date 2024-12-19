import PropTypes from "prop-types";
import { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { deletePost, likePost } from "../../api/api";
import { useAuth } from "../../auth/AuthProvider";
import Modal from "../common/Modal";

// @ts-ignore
const Post = forwardRef(({ post, refreshPosts }, ref) => {
  const { _id: postId, img, username, body, user, likes } = post;
  const { loggedInUser } = useAuth();
  const isCurrentUser = loggedInUser._id === user;
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes?.length ?? 0);
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/post/${postId}?edit=true`);
  };

  const handleOpenPost = () => {
    navigate(`/post/${postId}`);
  };

  useEffect(() => {
    setIsLiked(likes?.includes(loggedInUser?._id));
  }, [likes, loggedInUser?._id]);

  const handleLikeUnlike = async (e) => {
    e.stopPropagation();
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

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const { success, message } = await deletePost(postId);
      if (success) {
        // @ts-ignore
        ref?.current && ref?.current?.remove();
        refreshPosts();
      } else {
        console.log("Failed to delete post", message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const actionsDropdown = (
    <div className="dropdown fit-content ms-auto">
      <i
        role="button"
        className="fas fa-ellipsis fa-lg ms-auto dropdown-toggle text-accent"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={(e) => e.stopPropagation()}
      ></i>
      <ul className="dropdown-menu overflow-hidden">
        {isCurrentUser && (
          <li>
            <button onClick={handleEdit} className="dropdown-item ">
              Edit
            </button>
          </li>
        )}
        <li>
          <button
            type="button"
            className="dropdown-item delete"
            data-bs-toggle="modal"
            data-bs-target={`#dlt-post-${postId}-modal`}
            onClick={(e) => e.stopPropagation()}
          >
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
  return (
    <div
      ref={ref}
      id={postId}
      onClick={handleOpenPost}
      className="d-flex w-100 flex-column bg-2 border border-accent-shadow hoverable border-2 rounded-5 p-3 
     overflow-hidden justify-content-start align-items-start"
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

        {loggedInUser?._id !== user
          ? loggedInUser?.role === "admin"
            ? actionsDropdown
            : null
          : actionsDropdown}
      </div>
      <div className="d-flex w-100 flex-column mt-3 justify-content-start align-items-start">
        <TextareaAutosize
          className={`w-100 border-0 bg-transparent  resize-none outline-none
                `}
          disabled
          value={body}
        />
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
  );
});

Post.displayName = "Post";

Post.propTypes = {
  // @ts-ignore
  post: PropTypes.shape({
    _id: PropTypes.any.isRequired,
    body: PropTypes.any.isRequired,
    img: PropTypes.any,
    likes: PropTypes.any,
    user: PropTypes.any,
    username: PropTypes.any.isRequired,
  }).isRequired,
  refreshPosts: PropTypes.func,
};

export default Post;
