import { AvailabilityLabelPropsType } from "../../availability-label/types";
import PageFoldButton from "../Buttons/page-fold-button/PageFoldButton";
import Pagefold from "../pagefold/Pagefold";
import { withAvailabilityProps } from "./abilityLabel.hoc";
import { ReactComponent as CheckIcon } from "../../../public/icons/collection/Check.svg";
import "./availability-label.scss";

const AvailabilityLabel: React.FC<AvailabilityLabelPropsType> = ({
  manifestationType,
  availability,
  status,
  quantity,
  button,
}) => {
  const content = (
    <>
      <CheckIcon className={`availability-label__check ${status}`} />
      {manifestationType && (
        <>
          <p className="availability-label__type">
            {manifestationType.toUpperCase()}
          </p>
          <div className="availability-label__divider" />
          <p className="availability-label__availability">{availability}</p>
        </>
      )}
      {!manifestationType && (
        <p className="availability-label__availability availability-label__availability--first">
          {availability}
        </p>
      )}
      {quantity && (
        <>
          <div className="availability-label__divider" />
          <p className="availability-label__quantity">{quantity} stk</p>
        </>
      )}
    </>
  );

  const AvailabilityPagefold = withAvailabilityProps(Pagefold);
  const AvailabilityPagefoldButton = withAvailabilityProps(PageFoldButton);

  if (button) {
    return (
      <AvailabilityPagefoldButton status={status}>
        {content}
      </AvailabilityPagefoldButton>
    );
  }

  return <AvailabilityPagefold status={status}>{content}</AvailabilityPagefold>;
};

export default AvailabilityLabel;
