import clsx from "clsx";
import React from "react";
import CheckIcon from "@danskernesdigitalebibliotek/dpl-design-system/build/icons/collection/Check.svg";
import TextLineSkeleton from "../skeletons/TextLineSkeleton";

type Props = {
  selected?: boolean;
  isLoading: boolean;
  isAvailable?: boolean;
  manifestText: string;
  availabilityText?: string;
  quantity?: number;
};

const AvailabilityLabelInside: React.FunctionComponent<Props> = ({
  selected,
  isLoading,
  isAvailable,
  manifestText,
  availabilityText,
  quantity
}) => {
  const availableTriangleCss = isAvailable ? "success" : "alert";

  const classes = {
    triangle: clsx(
      { "pagefold-triangle--none": selected },
      {
        [`pagefold-triangle--xsmall pagefold-triangle--${availableTriangleCss}`]:
          !selected
      }
    ),
    check: clsx("availability-label__check", selected && "selected")
  };

  return (
    <>
      <div className={classes.triangle} />
      <img className={classes.check} src={CheckIcon} alt="" />
      {manifestText && (
        <>
          <p
            className="availability-label__type"
            data-cy="availability-label-type"
          >
            {manifestText}
          </p>
          <div className="availability-label__divider" />
        </>
      )}
      <p
        className={`availability-label__availability ${
          !manifestText ? "availability-label__availability--first" : ""
        }`}
        data-cy="availability-label-status"
      >
        {isLoading ? <TextLineSkeleton width={40} /> : availabilityText}
      </p>
      {quantity && (
        <>
          <div className="availability-label__divider" />
          <p className="availability-label__quantity">{quantity} stk</p>
        </>
      )}
    </>
  );
};

export default AvailabilityLabelInside;
