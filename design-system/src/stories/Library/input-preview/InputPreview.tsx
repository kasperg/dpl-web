import clsx from "clsx";
import { Links } from "../links/Links";
import Pagefold from "../pagefold/Pagefold";
import { ReactComponent as CheckIcon } from "../../../public/icons/collection/Check.svg";
import "./input-and-preview.scss";

export interface InputPreviewProps {
  cqlPreviewText: string;
  isMobile?: boolean;
}

const InputPreview: React.FC<InputPreviewProps> = ({
  cqlPreviewText = "placeholder text",
  isMobile = false,
}) => {
  return (
    <Pagefold
      size="large"
      isInheriting
      isAContainer={false}
      className={clsx("input-and-preview__preview", {
        "input-and-preview__preview--mobile": isMobile,
      })}
    >
      <div className="input-and-preview__heading">CQL søgestreng</div>
      <p className="input-and-preview__text">{cqlPreviewText}</p>
      <section>
        <button className="input-and-preview__action">Nulstil</button>
        <button className="input-and-preview__action">
          Kopier streng
          <CheckIcon className="inline-icon" />
        </button>
        <Links href="/" linkText="Rediger CQL" classNames="link-tag" />
      </section>
    </Pagefold>
  );
};

export default InputPreview;
