import { clsx } from "clsx";
import { FC } from "react";
import Label from "../label/Label";
import "./textarea.scss";

export interface TextareaProps {
  id: string;
  name: string;
  label: string;
  rows?: number;
  cols?: number;
  className?: string;
  labelClassName?: string;
  placeholder?: string;
}

const Textarea: FC<TextareaProps> = ({
  id,
  name,
  label,
  rows = 8,
  cols = 80,
  className,
  placeholder,
  labelClassName,
}) => {
  return (
    <div className="input">
      <Label id={id} className={labelClassName}>
        {label}
      </Label>
      <div>
        <textarea
          className={clsx(className)}
          id={id}
          name={name}
          rows={rows}
          cols={cols}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default Textarea;
