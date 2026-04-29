import { ReactComponent as ProfileIcon } from "../../../public/icons/collection/Profile.svg";
import "./avatar.scss";

export const Avatar = () => {
  return (
    <div className="avatar">
      <ProfileIcon />
    </div>
  );
};

export default Avatar;
