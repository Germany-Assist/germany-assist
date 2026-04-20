import React, { useEffect, useState } from "react";
import {
  Star,
  Mail,
  Globe,
  ShieldCheck,
  ChevronRight,
  Share2,
  Heart,
  CheckCircle,
  Eye,
} from "lucide-react";
import { useParams } from "react-router-dom";
import ImageGallery from "../../components/imageGallery/ImageGallery";
import BookingSidebar from "../../components/services/serviceProfile/BookingSidebar";
import ReviewsSection from "../../components/services/serviceProfile/ReviewComponent";
import { serviceProfilePageSP } from "../../../api/serviceProviderApis";
import { useAuth } from "../../../contexts/AuthContext";

const SPServicePage = () => {
  const { serviceId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAuthenticated) {
          const res = await serviceProfilePageSP(serviceId);
          setData(res);
        }
      } catch (err) {
        //TODO Error message should be here but i need error component first
        console.error("Failed to load service", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [serviceId, isAuthenticated]);

  // --- 1. Sub-component: Reviews Section ---

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-gray-500 font-medium tracking-wide">
          Fetching Details...
        </span>
      </div>
    );
  if (!data) return <div className="text-center py-20">Service not found.</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Services</span> <ChevronRight size={14} />
            <span className="text-indigo-600 font-medium capitalize">
              {data.category?.replace("-", " ")}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-sm font-medium hover:underline">
              <Share2 size={16} className="mr-2" /> Share
            </button>
            <button className="flex items-center text-sm font-medium hover:underline">
              {/* TODO add to favorite */}
              <Heart size={16} className="mr-2" /> Favorite
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold capitalize mb-4">
            {data.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center font-bold text-gray-900">
              <Star size={16} className="text-black fill-current mr-1" />
              <span>{data.rating > 0 ? data.rating : "New"}</span>
              <span className="mx-1 font-normal text-gray-500 underline">
                ({data.totalReviews} reviews)
              </span>
            </div>
            <div className="flex items-center font-medium">
              {data?.ServiceProvider?.isVerified ? (
                <>
                  <CheckCircle size={16} className="text-green-600 mr-1" />
                  "Identity Verified"
                </>
              ) : (
                ""
              )}
            </div>
            <div className="flex items-center italic">
              <Eye size={16} className="mr-1" /> {data.views} recent views
            </div>
          </div>
        </div>

        <ImageGallery assets={data.assets} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between pb-8 border-b border-gray-100 mb-8">
              <div>
                <h2 className="text-2xl font-semibold mb-1">
                  Service by{" "}
                  {data.ServiceProvider?.name || "Authorized Provider"}
                </h2>
                <p className="text-gray-500 capitalize">
                  {data.type} session • {data.category?.replace("-", " ")}
                </p>
              </div>
              <div className="h-14 w-14 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {(data.ServiceProvider?.name || "S").charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <ShieldCheck size={24} className="mt-1 text-indigo-600" />
                <div>
                  <h4 className="font-semibold text-lg">Secure Process</h4>
                  <p className="text-gray-500 text-sm">
                    Encrypted handling of your documents.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Globe size={24} className="mt-1 text-indigo-600" />
                <div>
                  <h4 className="font-semibold text-lg">100% Online</h4>
                  <p className="text-gray-500 text-sm">
                    Managed digitally for global access.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                About this service
              </h3>
              <p className="text-gray-600 leading-loose text-lg whitespace-pre-line">
                {data.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingSidebar
              price={data.price}
              rating={data.rating}
              category={data.category}
              providerEmail={data.ServiceProvider?.email}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SPServicePage;
// TODO those are the extra fields that i will address
// "approved": true,
// "rejected": false,
// "published": true,
// "User": {
//     "firstName": "root",
//     "lastName": "serviceProvider",
//     "email": "amr_imad@hotmail.com"
// },
// "timelines": [
//     {
//         "id": "8dHE",
//         "isArchived": false,
//         "label": null
//     }
// ],
