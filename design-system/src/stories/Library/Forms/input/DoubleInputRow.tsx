import Input from "./Input";
import "./input.scss";

export type DoubleInputRowProps = {
  leftLabel: string;
  rightLabel: string;
  descriptionLeft?: string;
  descriptionRight?: string;
  validationLeft?: string;
  validationRight?: string;
};

const DoubleInputRow: React.FC<DoubleInputRowProps> = ({
  leftLabel,
  rightLabel,
  descriptionLeft,
  descriptionRight,
  validationLeft,
  validationRight,
}) => {
  return (
    <div className="input__double-row">
      <Input
        id={leftLabel}
        label={leftLabel}
        description={descriptionLeft}
        validation={validationLeft}
        type="text"
        classNames="input input--double mr-16"
      />
      <Input
        id={rightLabel}
        label={rightLabel}
        description={descriptionRight}
        validation={validationRight}
        type="text"
        classNames="input input--double"
      />
    </div>
  );
};

export default DoubleInputRow;
