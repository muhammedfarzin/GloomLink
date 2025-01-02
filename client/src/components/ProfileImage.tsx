import ProfileAvatar from "../assets/icons/Profile-Avatar.svg";

interface ProfileImageProps {
  isOnline?: boolean;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ isOnline = false }) => {
  return (
    <div className="bg-slate-300 w-1/4 min-w-8 max-w-16 rounded-full mr-2 relative">
      <img src={ProfileAvatar} alt="Avatar" className="w-full" />
      {isOnline ? (
        <div className="w-2 h-2 bg-green-700 rounded-full absolute bottom-1 right-0" />
      ) : null}
    </div>
  );
};

export default ProfileImage;
