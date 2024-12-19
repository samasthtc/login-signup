import LoadingSpinner from "@/components/common/LoadingSpinner";
import PostCreation from "@/components/posts/PostCreation";
import PostDisplay from "@/components/posts/PostDisplay";
import { useEffect, useRef, useState } from "react";
import { getAllPosts } from "../api/api";
import { useAuth } from "../auth/AuthProvider";
import { debounce } from "../utils/debounce";

export default function Home() {
  // eslint-disable-next-line no-unused-vars
  const [resizeTrigger, setResizeTrigger] = useState(0);
  const [isSmall, setIsSmall] = useState(window.innerWidth <= 577);
  const { logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);

  useEffect(() => {
    const handleResize = debounce(() => {
      setResizeTrigger((prev) => prev + 1);
      setIsSmall(window.innerWidth <= 577);
    }, 150);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const posts = [
  //   { username: "Osama", body: "Post Content" },
  //   {
  //     username: "User",
  //     img: true,
  //     body: "Post Content Post Content Post Content Post Content Post Content Post Content Post Content Post Content Post Content Post Content Post Content Post Content ",
  //   },
  //   { username: "Osama", body: "Post Content" },
  //   { username: "Osama", img: true, body: "Post Content" },
  //   { username: "Osama", body: "Post Content" },
  //   { username: "Osama", img: true, body: "Post Content" },
  // ];

  const fetchPosts = async (options) => {
    setIsLoading(true);

    try {
      let success, data, message;
      ({ success, data, message } = await getAllPosts(options));

      if (success) {
        page === 1 ? setPosts(data) : setPosts((prev) => [...prev, ...data]);
        if (data.length < options?.limit) {
          setHasMore(data.length >= options?.limit);
        }
      } else {
        console.log(message);
        setHasMore(false);
      }
    } catch (err) {
      if (err.message === "No token, authorization denied") {
        logout();
      }
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts({ page, limit: 9 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const refreshPosts = () => {
    setPage(1);
    setHasMore(true);
  };

  const lastPostRef = useRef();

  useEffect(() => {
    if (isLoading) return;
    if (!hasMore) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );
    const currentLastPostRef = lastPostRef.current;
    if (currentLastPostRef) {
      observer.current.observe(currentLastPostRef);
    }

    return () => {
      if (currentLastPostRef) {
        observer.current.unobserve(currentLastPostRef);
      }
    };
  });

  return (
    <main
      className={`container-fluid py-sm-3 p-2 ${
        isSmall ? "ps-3 " : ""
      } pe-3 py-5 row-gap-4 d-flex flex-column justify-content-start align-items-center 
      h-100`}
    >
      <PostCreation setPosts={setPosts} />
      {posts.length > 0 ? (
        <PostDisplay
          posts={posts}
          lastPostRef={lastPostRef}
          refreshPosts={refreshPosts}
        />
      ) : (
        !isLoading && <p>No posts to display</p>
      )}
      {isLoading && <LoadingSpinner />}
    </main>
  );
}
