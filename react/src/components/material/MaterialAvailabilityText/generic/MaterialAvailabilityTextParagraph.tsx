import React from "react";

interface MaterialAvailabilityTextParagraphProps {
  children: React.ReactNode | string;
}

const MaterialAvailabilityTextParagraph: React.FC<
  MaterialAvailabilityTextParagraphProps
> = ({ children }) => {
  return <p className="material-header__cta-text">{children}</p>;
};

export default MaterialAvailabilityTextParagraph;
