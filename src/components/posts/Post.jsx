import PropTypes from "prop-types";
import { forwardRef } from "react";
import { deletePost } from "../../api/api";

// @ts-ignore
const Post = forwardRef(({ post, refreshPosts }, ref) => {
  const { _id: postId, img, username, body } = post;

  const handleDelete = async () => {
    try {
      const { success, data, message } = await deletePost(postId);
      console.log(success, data, message);
      if (success) {
        // @ts-ignore
        ref?.current && ref?.current?.remove();
        refreshPosts();
      } else {
        console.log("Failed to delete post");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      ref={ref}
      id={postId}
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
            className="far fa-circle-user text-primary-accent m-0 p-0 me-2"
            style={{ fontSize: "42px" }}
          ></i>
        )}
        <p className="p-0 m-0 fw-semibold fs-5">{username}</p>

        <div className="dropdown fit-content ms-auto">
          <i
            role="button"
            className="fas fa-ellipsis ms-auto dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          ></i>
          <ul className="dropdown-menu overflow-hidden">
            <li>
              <button className="dropdown-item ">Edit</button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item delete"
                onClick={handleDelete}
                // data-bs-toggle="modal"
                // data-bs-target={`#dlt-post--modal`}
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="d-flex flex-column mt-3 justify-content-start align-items-start">
        <p className="p-0 m-0 mb-1 fw-normal">{body}</p>
        {/* <div className="d-flex gap-2 flex-wrap">
          <img
            className="rounded-4"
            src="https://via.placeholder.com/150"
            alt="post"
            loading="lazy"
          />
          <img
            className="rounded-4"
            src="https://via.placeholder.com/150"
            alt="post"
            loading="lazy"
          />
          <img
            className="rounded-4"
            src="https://via.placeholder.com/150"
            alt="post"
            loading="lazy"
          />
        </div> */}
      </div>
      <hr className="text-accent border-1 fs-2 w-100 mt-4" />
      <div className="d-flex">
        <button className="btn btn-outline-accent rounded-pill px-3 fw-medium ">
          Like
        </button>
      </div>
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
    username: PropTypes.any.isRequired,
  }).isRequired,
  refreshPosts: PropTypes.any,
};

export default Post;
