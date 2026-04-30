import Modal from "../Modal";
import { ReactComponent as InfomediaIcon } from "../../../../public/icons/logo/infomedia-logo.svg";
import "./infomedia.scss";

export type InfomediaProps = {
  showModal: boolean;
  title: string;
  text: string;
  hedLine: string;
  byLine: string;
  paper: string;
  dateLine: string;
  footerText: string;
};

export const Infomedia = ({
  title,
  text,
  showModal,
  hedLine,
  byLine,
  paper,
  dateLine,
  footerText,
}: InfomediaProps) => {
  return (
    <Modal shownModal={showModal} classNames="">
      <article className="infomedia__article">
        <InfomediaIcon className="infomedia__logo" />
        <h2 className="infomedia__headline">{title}</h2>
        <p className="infomedia__subheadline">{hedLine}</p>
        <p className="infomedia__byline">{byLine}</p>

        <div className="infomedia__meta">
          <span>{paper}</span>
          <span>{dateLine}</span>
        </div>

        <div
          className="infomedia__content"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: text }}
        />

        <footer className="infomedia-footer">
          <p className="infomedia__copyright">{footerText}</p>
        </footer>
      </article>
    </Modal>
  );
};
