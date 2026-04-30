import clsx from "clsx";
import { PageFoldType } from "../../pagefold/types";
import { ButtonSize, ButtonVariant } from "./types";

export const getSize = (size: ButtonSize): string => {
  if (size === "none") return "";
  return `button--${size}`;
};

export const getVariant = (variant: ButtonVariant): string => {
  if (variant === "filled") return "button--filled";
  if (variant === "outline") return "button--outline";
  return "";
};

export const getPagefoldClasses = ({
  isInheriting,
  isAContainer,
  size,
  type,
  className,
}: PageFoldType): { wrapper: string; triangle: string } => {
  return {
    wrapper: clsx(
      `pagefold-parent--${size}`,
      { "internal-pagefold-parent": isAContainer },
      className,
    ),
    triangle: clsx(
      `pagefold-triangle--${size}`,
      { [`pagefold-triangle--${type}`]: type },
      { "pagefold-inherit-parent": isInheriting },
    ),
  };
};
