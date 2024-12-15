import MasonryGrid from "@/components/MasonryGrid";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { debounce } from "../utils/debounce";
//this page will have two horizontal secitons, the first is for
//creating a new post and filtering posts. the second is for
//displaying posts in a masonry grid
export default function Home() {
  // eslint-disable-next-line no-unused-vars
  const [resizeTrigger, setResizeTrigger] = useState(0);

  useEffect(() => {
    const handleResize = debounce(
      () => setResizeTrigger((prev) => prev + 1),
      150
    );
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const posts = [
    { name: "Osama", body: "Post Content" },
    {
      name: "User",
      img: true,
      body: "Post Content Post Content Post Content Post Content Post Content Post Content Post Content Post Content Post Content Post Content Post Content Post Content ",
    },
    { name: "Osama", body: "Post Content" },
    { name: "Osama", img: true, body: "Post Content" },
    { name: "Osama", body: "Post Content" },
    { name: "Osama", img: true, body: "Post Content" },
  ];

  return (
    <main
      className="container-fluid p-sm-2 py-sm-3 p-2 py-5 row-gap-4
    d-flex flex-column justify-content-start align-items-center h-100"
    >
      <PostCreation />
      <PostDisplay posts={posts} />
    </main>
  );
}

function PostCreation() {
  const [postBody, setPostBody] = useState("");
  const [rows, setRows] = useState(1);
  const [scrollHeights, setScrollHeights] = useState(new Set());

  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPostBody(value);

    if (textareaRef.current) {
      const textarea = textareaRef.current;
      if (value === "") {
        setRows(1);
        setScrollHeights(new Set());
        return;
      }

      textarea.style.height = "auto";
      const lineHeight = 24;
      const scrollHeight = textarea.scrollHeight;

      if (!scrollHeights.has(scrollHeight)) {
        setScrollHeights((p) => new Set([...p, scrollHeight]));
        const calculatedRows = Math.min(
          Math.max(Math.floor(scrollHeight / lineHeight), 1),
          4
        );

        setRows(calculatedRows);
      }
    }
  };

  const handlePost = () => {
    if (postBody.trim() === "") {
      return;
    }
    console.log("Post submitted:", postBody);
    setPostBody("");
    setRows(1);
    setScrollHeights(new Set());
  };

  const handleDiscard = () => {
    setPostBody("");
    setRows(1);
    setScrollHeights(new Set());
  };

  return (
    <div
      className="row w-100 align-items-center column-gap-5"
      style={{ minHeight: "200px" }}
    >
      <div className="col-md-6 p-3 h-100 bg-primary-subtle d-flex flex-column justify-content-center gap-2 rounded-5 border border-primary border-2">
        <div className="d-flex gap-3 flex-grow-1 flex justify-content-start align-items-center text-accent ">
          <i className="fa-regular fa-circle-user fa-2xl fs-1 text-primary-accent"></i>
          <textarea
            ref={textareaRef}
            name="post-body"
            className="form-control m-0 fw-normal resize-none outline-none"
            placeholder="What's on your mind?"
            value={postBody}
            onChange={handleInputChange}
            maxLength={500}
            rows={rows}
          ></textarea>
        </div>
        <div className="d-flex gap-3 flex-grow-0 justify-content-end align-items-center">
          <button
            className="btn btn-outline-primary rounded-pill fw-medium border-2"
            onClick={handlePost}
          >
            Post
          </button>
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

function PostDisplay({ posts }) {
  return (
    <div className="row h-100 w-100">
      <div className="p-0">
        <MasonryGrid>
          {posts.map((post, index) => (
            <Post key={index} {...post} />
          ))}
        </MasonryGrid>
      </div>
    </div>
  );
}
PostDisplay.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      body: PropTypes.string.isRequired,
      img: PropTypes.bool,
      name: PropTypes.string,
    })
  ).isRequired,
};

function Post({ img, name, body }) {
  return (
    <div
      className="d-flex w-100 flex-column bg-2 border border-accent-shadow hoverable border-2 rounded-5 p-3 
     overflow-hidden justify-content-start align-items-start"
    >
      <div className="d-flex flex-row justify-content-start align-items-center">
        {img ? (
          <img
            className="rounded-circle me-2"
            src="https://via.placeholder.com/42"
            alt="User Image"
            loading="lazy"
          />
        ) : (
          <i
            className="fa-regular fa-circle-user text-primary-accent m-0 p-0 me-2"
            style={{ fontSize: "42px" }}
          ></i>
        )}
        <p className="p-0 m-0 fw-semibold fs-5">{name}</p>
      </div>
      <div className="d-flex flex-column mt-3 justify-content-start align-items-start">
        <p className="p-0 m-0 mb-1 fw-normal">{body}</p>
        <div className="d-flex gap-2 flex-wrap">
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
        </div>
      </div>
    </div>
  );
}

Post.propTypes = {
  body: PropTypes.string.isRequired,
  img: PropTypes.bool,
  name: PropTypes.string.isRequired,
};
