import React, { useEffect, useState } from "react";
import NavigationBar from "../components/ui/NavigationBar";
import TimelineView from "../features/timeline/timelineView";
import { fetchAllPostsApi, fetchTimelineApi } from "../api/profile";
import { useParams } from "react-router-dom";
import banner from "../../src/assets/placeholders/t4.avif";
import { Loader2 } from "lucide-react";

const TimelinePage = () => {
  const [data, setData] = useState({
    posts: { posts: [] },
    pinnedPosts: { posts: [] },
  });
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { timelineId } = useParams();

  // Initial Fetch (Page 0 handles Pinned + First 5-10 Posts)
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        const response = await fetchTimelineApi(timelineId, 0);
        setData(response);

        // If the initial posts count is 0 or low, we might not have more
        const initialPostsCount = response?.posts?.posts?.length || 0;
        setHasMore(initialPostsCount > 0);
        setPage(1); // Set to 1 for the first 'Load More' trigger
      } catch (error) {
        console.error("Initial load failed:", error);
      }
      setLoading(false);
    };
    loadInitial();
  }, [timelineId]);

  // Infinite Scroll Triggered by TimelineView
  const loadMorePosts = async () => {
    if (fetchingMore || !hasMore) return;
    setFetchingMore(true);
    try {
      const response = await fetchTimelineApi(timelineId, page);

      const newPosts = response?.posts?.posts || [];
      if (newPosts.length > 0) {
        setData((prev) => ({
          ...prev,
          posts: {
            ...prev.posts,
            posts: [...prev.posts.posts, ...newPosts],
          },
        }));
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more:", error);
      setHasMore(false);
    } finally {
      setFetchingMore(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-light-950 dark:bg-dark-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-accent">
            Syncing Timeline
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-light-950 dark:bg-dark-950 transition-colors duration-700 ease-in-out">
      <NavigationBar />

      <main className="pt-24 pb-20">
        {/* Banner Section */}
        <div className="px-6 mb-12">
          <div className="max-w-7xl mx-auto relative h-64 md:h-80 overflow-hidden rounded-[2.5rem] border border-light-700 dark:border-white/10 shadow-2xl">
            <img
              src={banner}
              alt="Berlin Architecture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-light-950 dark:from-dark-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-10 left-10">
              <h1 className="text-4xl md:text-5xl font-light text-slate-900 dark:text-white tracking-tight">
                Relocation{" "}
                <span className="text-accent font-medium">Journey</span>
              </h1>
            </div>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-6">
          <TimelineView
            data={data}
            loadMore={loadMorePosts}
            hasMore={hasMore}
            isFetching={fetchingMore}
          />
        </section>
      </main>

      <footer className="py-12 border-t border-light-700 dark:border-white/5 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-light tracking-widest uppercase">
          © 2026 Germany Assist
        </p>
      </footer>
    </div>
  );
};

export default TimelinePage;
