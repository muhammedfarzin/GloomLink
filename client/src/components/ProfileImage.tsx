import ProfileAvatar from "../assets/icons/Profile-Avatar.svg";

interface ProfileImageProps {
  className?: string;
  profileImage?: string;
  isOnline?: boolean;
  onClick?: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  className,
  profileImage,
  isOnline = false,
  onClick,
}) => {
  return (
    <div
      className={`bg-slate-300 min-w-8 max-w-16 rounded-full mr-2 relative ${
        className || "w-1/4"
      }`}
      onClick={onClick}
    >
      <img
        src={profileImage || ProfileAvatar}
        alt="Profile"
        className="w-full rounded-full"
      />
      {isOnline ? (
        <div className="w-2 h-2 bg-green-700 rounded-full absolute bottom-1 right-0" />
      ) : null}
    </div>
  );
};

export default ProfileImage;
