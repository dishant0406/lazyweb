import { BLUR_IMAGE } from "@/lib/constants";
import Image from "next/image";

interface ResourceImageProps {
  title: string;
  image: string;
}

const ResourceImage = ({ title, image }: ResourceImageProps) => {
  return (
    <div className="h-[160px] w-full shadow-custom rounded-t-md overflow-hidden">
      <Image
        alt={title}
        height={160}
        width={288}
        layout="fixed"
        placeholder="blur"
        blurDataURL={BLUR_IMAGE}
        src={image}
        className="transition-all duration-300 hover:scale-125"
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/288x160?text=Image+Not+Available";
        }}
      />
    </div>
  );
};

export default ResourceImage;
