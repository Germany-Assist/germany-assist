import { Globe, CheckCircle2 } from "lucide-react";
import ServiceCard from "../../ServiceCard";
const LivePreview = ({ data }) => {
  //TODO i should fix this
  const profileImg = data.assets?.find(
    (a) => a.key === "serviceProfileImage"
  )?.url;
  return (
    <div className=" top-32 flex flex-col items-center">
      <div className="w-full max-w-sm space-y-4">
        <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] tracking-widest uppercase px-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />{" "}
          Live Preview
        </div>
        <ServiceCard
          data={data}
          isDummy={true}
          dummyProfileImage={profileImg}
        />
      </div>
    </div>
  );
};

export default LivePreview;
