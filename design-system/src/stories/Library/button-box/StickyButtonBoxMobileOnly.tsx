import { FC } from "react";
import "./button-box.scss";

export interface StickyButtonBoxMobileOnlyProps {
  label: string;
}

const StickyButtonBoxMobileOnly: FC<StickyButtonBoxMobileOnlyProps> = ({
  label,
}) => {
  return (
    // eslint-disable-next-line local-rules/single-bem-block
    <div className="hide-on-desktop button-box button-box--sticky-bottom">
      <button
        data-cy="button"
        type="button"
        // eslint-disable-next-line local-rules/single-bem-block
        className="button button--filled button--small  arrow__hover--right-small "
      >
        {label}
      </button>
    </div>
  );
};

export default StickyButtonBoxMobileOnly;
