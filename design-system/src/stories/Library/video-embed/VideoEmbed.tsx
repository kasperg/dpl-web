import { FC, useState, useEffect } from "react";
import { Button } from "../Buttons/button/Button";
import "./video-embed.scss";
import "./cookie-placeholder.scss";

type VideoEmbedProps = {
  info: string;
  buttonText: string;
  src: string;
  acceptCookies: boolean;
};

const VideoEmbed: FC<VideoEmbedProps> = ({
  info,
  buttonText,
  src,
  acceptCookies: acceptCookiesProp,
}: VideoEmbedProps) => {
  const [acceptCookies, setAcceptCookies] = useState(acceptCookiesProp);

  useEffect(() => {
    setAcceptCookies(acceptCookiesProp);
  }, [acceptCookiesProp]);

  const handleButtonClick = () => {
    setAcceptCookies(!acceptCookies);
  };

  return (
    <section className="video-embed">
      <div className="video-embed__wrapper">
        <iframe
          className={`${acceptCookies ? "" : "cookie-placeholder__hide"}`}
          src={src}
          title="VideoEmbed"
          width="auto"
          height="auto"
          allowFullScreen
        />
        <div
          // eslint-disable-next-line local-rules/single-bem-block
          className={`consent-placeholder cookie-placeholder ${
            acceptCookies ? "cookie-placeholder__hide" : ""
          }`}
          data-category="cookie_cat_marketing"
        >
          {/* eslint-disable-next-line local-rules/single-bem-block */}
          <div className="pagefold-triangle--medium pagefold-inherit-parent" />
          <div className="cookie-placeholder__wrapper">
            <div className="cookie-placeholder__description">
              <div id="dpl-react-apps-cookie-placeholder">{info}</div>
            </div>
            <Button
              classNames="cookie-placeholder__manage-consent-button"
              size="xlarge"
              label={buttonText}
              buttonType="none"
              variant="outline"
              collapsible={false}
              disabled={false}
              onClick={handleButtonClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoEmbed;
