import { FC } from "react";
import "./row-button.scss";
import "./row-buttons.scss";

type RowButtonProps = {
  label: string;
};

const RowButton: FC<RowButtonProps> = ({ label }) => (
  <button
    // eslint-disable-next-line local-rules/single-bem-block
    className="row-button text-tags row-button__text capitalize-all"
    type="button"
  >
    {label}
  </button>
);

export default RowButton;
