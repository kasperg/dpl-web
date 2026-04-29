import { ReactComponent as SvgIcon } from "./icon-favourite.svg";
import "./icon-favourite.scss";

export type IconFavouriteProps = {
  fill?: boolean;
};

export const IconFavourite = ({ fill }: IconFavouriteProps) => {
  return (
    <SvgIcon
      className={
        fill ? "icon-favourite icon-favourite--filled" : "icon-favourite"
      }
    />
  );
};
