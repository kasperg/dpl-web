import React, { FC } from "react";
import clsx from "clsx";
import "@danskernesdigitalebibliotek/dpl-design-system/build/css/components/media-container.css";

type MediaImageProps = {
  src?: string;
  alt?: string;
  placeholderText?: string;
};

const MediaImage: FC<MediaImageProps> = ({
  src,
  alt = "",
  placeholderText = ""
}) => {
  return (
    <div
      className={clsx("media-container", {
        "media-container--placeholder": !src
      })}
    >
      {src ? (
        <div className="media-container__media">
          <img src={src} alt={alt} loading="lazy" />
        </div>
      ) : (
        <div className="media-container__placeholder-text">
          {placeholderText}
        </div>
      )}
    </div>
  );
};

export default MediaImage;
