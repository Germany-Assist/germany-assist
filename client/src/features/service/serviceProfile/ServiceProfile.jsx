import React, { useEffect, useState } from "react";
import { ChevronRight, Share2, Heart, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchServiceProfile,
  fetchPaymentIntentApi,
} from "../../../api/publicApis";
import ImageGallery from "../../../components/ui/ImageGallery";
import BookingSidebar from "./BookingSidebar";
import ReviewsSection from "./ReviewComponent";
import NavigationBar from "../../../components/ui/NavigationBar";
import ShareSheet from "../../../components/ui/ShareSheet";
import PaymentModal from "../../../components/ui/payments/PaymentModal";
import { useProfile } from "../../../contexts/ProfileContext";
import { fetchUserReviewForServiceApi } from "../../../api/profile";
import StatusModal from "../../../components/ui/StatusModal";
import { checkIfBoughtClientApi } from "../../../api/clientUserApis";
const ServiceProfile = ({ previewData = null }) => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(previewData);
  const [loading, setLoading] = useState(!previewData);
  const [error, setError] = useState(false);
  const { toggleFavorite, isInFavorite, profile } = useProfile();
  const [isFavorite, setIsFavorite] = useState(false);
  const [successScreen, setSuccessScreen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);

  const [purchasedItems, setPurchasedItems] = useState([]);

  const [hasReview, setHasReview] = useState(false);

  const [paymentConfig, setPaymentConfig] = useState({
    isOpen: false,
    clientSecret: "",
    amount: 0,
  });

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const res = await fetchServiceProfile(serviceId);
        setData(res);
      } catch (err) {
        // setError(err.response?.data?.message);
        setError(err.response?.data?.message || "ops something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [serviceId, previewData]);

  /* -------------------- Status Checks -------------------- */
  useEffect(() => {
    if (previewData || !data) return;
    setIsFavorite(isInFavorite(data.id));
    (async () => {
      const history = await checkIfBoughtClientApi(data.id);
      if (history && history.length > 0) {
        setPurchasedItems(history);
        const review = await fetchUserReviewForServiceApi(data.id);
        setHasReview(review);
      }
    })();
  }, [profile, data, previewData]);

  /* -------------------- Payments -------------------- */
  const handleInitiatePayment = async (selectedOption) => {
    if (previewData || !selectedOption) return;
    setIsPreparingPayment(true);
    try {
      const res = await fetchPaymentIntentApi({
        serviceId: data.id,
        optionId: selectedOption.id,
        type: data.type,
      });
      if (res && selectedOption.price !== 0) {
        setPaymentConfig({
          isOpen: true,
          clientSecret: res.message.clientSecret,
          amount: selectedOption.price,
        });
      } else if (res && selectedOption.price == 0) {
        setSuccessScreen(true);
      }
    } catch (err) {
      console.error("Payment failed to initialize", err);
    } finally {
      setIsPreparingPayment(false);
    }
  };

  const handleNavigateToTimeline = (tid) => {
    if (previewData) return;
    navigate(`/timeline/${tid}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-950 dark:bg-dark-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }
  if (error) {
    return (
      <StatusModal
        isOpen={true}
        onClose={() => navigate("/")}
        type={"error"}
        message={error}
      />
    );
  }

  /* -------------------- Asset & Option Normalization -------------------- */
  const galleryAssets =
    data.assets?.length > 0
      ? data.assets
      : [
          {
            url: "https://via.placeholder.com/1200x600?text=No+Media",
            mediaType: "image",
          },
        ];

  // Pick the correct options array based on the service type
  const options =
    data.type === "oneTime" ? data.variants || [] : data.timelines || [];

  return (
    <div className="min-h-screen bg-light-950 dark:bg-dark-950 text-slate-900 dark:text-slate-100 pb-20 relative transition-colors duration-500">
      {!previewData && <NavigationBar />}
      <ShareSheet
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={window.location.href}
        title={data.title}
      />
      <PaymentModal
        isOpen={paymentConfig.isOpen}
        onClose={() => setPaymentConfig((p) => ({ ...p, isOpen: false }))}
        clientSecret={paymentConfig.clientSecret}
        amount={paymentConfig.amount}
      />
      <StatusModal
        isOpen={successScreen}
        onClose={() => setSuccessScreen(false)}
        type={"success"}
        message="Congratulations Your booking is confirmed."
      />
      {/* Breadcrumb Header */}
      <nav className="border-b border-light-700 dark:border-white/5 bg-light-900/50 dark:bg-black/20 backdrop-blur-md sticky top-0 ">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-sm">
            <span
              className="text-slate-400 hover:text-accent cursor-pointer transition-colors"
              onClick={() => navigate("/services")}
            >
              Services
            </span>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-slate-900 dark:text-white font-bold tracking-tight">
              {data.category?.label || "General"}
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center text-[10px] font-black uppercase tracking-widest hover:text-accent transition-all"
            >
              <Share2 size={16} className="mr-2" /> Share
            </button>
            <button
              onClick={() => !previewData && toggleFavorite(data)}
              className="flex items-center text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-all"
            >
              <Heart
                size={16}
                className={`mr-2 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
              Favorite
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Title & Provider */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter capitalize mb-4">
            {data.title}
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
              {data.serviceProvider?.name?.charAt(0)}
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
              By{" "}
              <span className="text-slate-900 dark:text-white">
                {data.serviceProvider?.name}
              </span>
            </span>
          </div>
        </div>
        {/* Media Section */}
        <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-light-700 dark:border-white/5 mb-16 aspect-video lg:aspect-auto">
          <ImageGallery assets={galleryAssets} />
        </div>
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-8">
                The Experience
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xl md:text-2xl font-light leading-relaxed whitespace-pre-line break-words">
                {data.description}
              </p>
            </section>

            <section className="pt-10 border-t border-light-700 dark:border-white/5">
              <ReviewsSection
                reviews={data.reviews || []}
                totalReviews={data.totalReviews || 0}
                rating={data.rating || 0}
                serviceId={data.id}
                existingReview={hasReview}
                canReview={Boolean(purchasedItems.length > 0)}
              />
            </section>
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-1">
            <BookingSidebar
              serviceType={data.type}
              options={options}
              purchasedItems={purchasedItems}
              category={data.category}
              rating={data.rating}
              providerEmail={data.serviceProvider?.name}
              onBuy={handleInitiatePayment}
              isProcessing={isPreparingPayment}
              onNavigate={handleNavigateToTimeline}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ServiceProfile;
