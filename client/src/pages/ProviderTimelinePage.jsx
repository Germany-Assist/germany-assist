import React, { useEffect, useState, useCallback } from "react";
import NavigationBar from "../components/ui/NavigationBar";
import TimelineView from "../features/timeline/timelineView";
import { fetchTimelineApi } from "../api/profile";
import { useParams } from "react-router-dom";
import banner from "../../src/assets/placeholders/t4.avif";
import { Loader2, Sparkles } from "lucide-react";
import StatusModal from "../components/ui/StatusModal";
import { getErrorMessage } from "../api/errorMessages";
import serviceProviderApis from "../api/serviceProviderApis";

const ProviderTimeline = () => {
  const [data, setData] = useState({
    posts: { posts: [] },
    pinnedPosts: { posts: [] },
  });
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(1); // Page 0 is initial, next is 1
  const [hasMore, setHasMore] = useState(true);
  const { id: timelineId } = useParams();
  const [statusModalProps, setStatusModalProps] = useState({
    isOpen: false,
  });
  // Initial Fetch
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        // Page 0 typically returns Pinned + first batch of regular posts
        const response = await serviceProviderApis.viewTimeline(timelineId, 0);
        if (response) {
          setData(response);
          // If less than a full page (e.g., 10) comes back, there's likely no more
          const initialCount = response?.posts?.posts?.length || 0;
          setHasMore(initialCount >= 5);
        }
      } catch (error) {
        setStatusModalProps({
          isOpen: true,
          title: "Timeline Load Error",
          message: getErrorMessage(error),
          type: "error",
          onClose: () => {
            setStatusModalProps({ isOpen: false });
          },
        });
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, [timelineId]);

  // Infinite Scroll Handler
  const loadMorePosts = useCallback(async () => {
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
        setPage((p) => p + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      setFetchingMore(false);
    }
  }, [fetchingMore, hasMore, timelineId, page]);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
          Loading Timeline
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500">
      <NavigationBar />
      <StatusModal {...statusModalProps} />
      <main className="pt-28 pb-20">
        {/* Modern Banner Section */}
        <div className="px-6 mb-16">
          <div className="max-w-7xl mx-auto relative h-72 md:h-[400px] overflow-hidden rounded-[40px] border border-zinc-100 dark:border-white/5 shadow-2xl shadow-blue-500/5">
            <img
              src={banner}
              alt="Timeline Cover"
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
            />
            {/* Overlay Glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-black/20" />

            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 rounded-full w-fit">
                  <Sparkles size={12} className="text-blue-500" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    Active Branch
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter">
                  Relocation <span className="text-blue-600">Journey</span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-6">
          {data?.posts?.posts?.length === 0 &&
          data?.pinnedPosts?.posts?.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-zinc-100 dark:border-white/5 rounded-[40px]">
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
                No updates posted yet
              </p>
            </div>
          ) : (
            <TimelineView
              data={data}
              loadMore={loadMorePosts}
              hasMore={hasMore}
              isFetching={fetchingMore}
            />
          )}
        </section>
      </main>

      <footer className="py-12 border-t border-zinc-100 dark:border-white/5 text-center">
        <p className="text-[10px] text-zinc-400 font-black tracking-[0.3em] uppercase">
          © 2026 Germany Assist • All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default ProviderTimeline;
