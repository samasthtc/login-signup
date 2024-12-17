import PropTypes from "prop-types";
import MasonryGrid from "../MasonryGrid";
import Post from "./Post";

export default function PostDisplay({ posts, lastPostRef, refreshPosts }) {
  return (
    <div className="row h-100 w-100">
      <div className="p-0">
        <MasonryGrid>
          {posts.map((post, index) => (
            <Post
              key={post._id}
              // @ts-ignore
              post={post}
              refreshPosts={refreshPosts}
              ref={index === posts.length - 1 ? lastPostRef : null}
            />
          ))}
        </MasonryGrid>
      </div>
    </div>
  );
}

PostDisplay.propTypes = {
  lastPostRef: PropTypes.any,
  posts: PropTypes.arrayOf(PropTypes.shape({
    body: PropTypes.string.isRequired,
    img: PropTypes.bool,
    username: PropTypes.string
  })).isRequired,
  refreshPosts: PropTypes.func
}
