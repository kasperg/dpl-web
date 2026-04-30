import { useState } from "react";
import { clsx } from "clsx";
import AvailabilityLabel from "../availability-label/AvailabilityLabel";
import Heading, { HeadingLevelType } from "../heading/Heading";
import { ReactComponent as ExpandMoreIcon } from "../../../public/icons/collection/ExpandMore.svg";
import "./disclosure.scss";

export type DisclosureProps = {
  headline: string;
  children: React.ReactNode | string;
  icon?: "Various" | "Receipt" | "Create" | "Profile";
  withAvailability?: boolean;
  removeHeadlinePadding?: boolean;
  headingLevel: HeadingLevelType;
  contentPadding?: boolean;
  defaultOpen?: boolean;
};

const Disclosure: React.FC<DisclosureProps> = ({
  headline,
  children,
  icon,
  withAvailability,
  removeHeadlinePadding,
  headingLevel,
  contentPadding = false,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <details className="disclosure" open={defaultOpen}>
      <summary
        className={clsx(
          "disclosure__headline",
          removeHeadlinePadding && "disclosure__headline--no-padding",
        )}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {!withAvailability && icon && (
          <div className="disclosure__icon">
            <img
              className="invert"
              src={`icons/collection/${icon}.svg`}
              alt="various-icon"
            />
          </div>
        )}
        <Heading
          level={headingLevel}
          className={`disclosure__text ${
            withAvailability ? "disclosure__text--shorter" : ""
          }`}
        >
          {headline}
        </Heading>
        {withAvailability && (
          <AvailabilityLabel availability="Hjemme" status="available" />
        )}
        <ExpandMoreIcon
          className={`disclosure__expand ${
            isOpen ? "disclosure__expand-open" : ""
          }`}
        />
      </summary>
      {contentPadding ? (
        // eslint-disable-next-line local-rules/single-bem-block
        <div className="disclosure__content-padding rich-text">{children}</div>
      ) : (
        children
      )}
    </details>
  );
};

export default Disclosure;
