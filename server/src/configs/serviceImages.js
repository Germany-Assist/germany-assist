/**
 * Category cover images used when a service has no uploaded asset yet.
 *
 * Services created through the dashboard keep their own S3 assets; this map is
 * only used by the seed/backfill scripts to give demo services a cover photo.
 */
export const SERVICE_CATEGORY_IMAGES = {
  "career-coaching":
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
  "certificate-recognition":
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  "german-language":
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
  "translation-services":
    "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
  "visa-immigration":
    "https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=1200&q=80",
  "recruitment-services":
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80",
  "relocation-services":
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "university-student-services":
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
};

const FALLBACK_IMAGE = (serviceId) =>
  `https://picsum.photos/seed/germany-assist-service-${serviceId}/1200/800`;

export function getServiceCoverImage(categoryTitle, serviceId) {
  return SERVICE_CATEGORY_IMAGES[categoryTitle] || FALLBACK_IMAGE(serviceId);
}

export default getServiceCoverImage;
