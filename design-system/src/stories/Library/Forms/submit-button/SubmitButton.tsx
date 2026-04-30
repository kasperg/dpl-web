import clsx from "clsx";
import { FC } from "react";
import "./submit-button.scss";

export interface SubmitButtonProps {
  buttonText: string;
  classNames?: string;
}

const SubmitButton: FC<SubmitButtonProps> = ({ buttonText, classNames }) => {
  const classes = clsx(
    [
      "button",
      "button--filled",
      "button--small",
      "arrow__hover--right-small",
      "dpl-button",
    ],
    classNames,
  );

  return <input type="submit" value={buttonText} className={classes} />;
};

export default SubmitButton;
