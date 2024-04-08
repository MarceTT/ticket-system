import { auth } from "@/auth";
import Image from "next/image";

interface ProfileImageProps {
    imageProfile: string;

}

const ProfileImage = ({imageProfile}: ProfileImageProps) => {
  return (
    <div>
      <div className="relative rounded-full bg-white w-10 h-10 flex items-center justify-center">
        {imageProfile && (
          <Image
            src={imageProfile}
            alt="user image"
            sizes="(max-width: 600px) 100vw, 50vw"
            fill={true}
            className="rounded-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default ProfileImage;
