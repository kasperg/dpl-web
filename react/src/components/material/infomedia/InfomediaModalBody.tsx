import React from "react";
import InfomediaLogo from "@danskernesdigitalebibliotek/dpl-design-system/build/icons/logo/infomedia-logo.svg";
import { useText } from "../../../core/utils/text";

export interface InfomediaModalBodyProps {
  headLine: string;
  hedLine: string;
  paper: string;
  byLine: string;
  dateLine: string;
  text: string;
}

const InfomediaModalBody: React.FunctionComponent<InfomediaModalBodyProps> = ({
  headLine,
  hedLine,
  paper,
  byLine,
  dateLine,
  text
}) => {
  const t = useText();
  return (
    <article className="infomedia__article">
      <img className="infomedia__logo" src={InfomediaLogo} alt="" />
      <h2 className="infomedia__headline">{headLine}</h2>
      <p className="infomedia__subheadline">{hedLine}</p>
      <p className="infomedia__byline">{`${t("materialHeaderAuthorByText")} ${byLine}`}</p>

      <div className="infomedia__meta">
        <span>{`${paper}, ${dateLine}`}</span>
      </div>

      <div
        className="infomedia__content"
        // Only trusted editors from infomedia have access to write infomedia articles
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: text }}
      />

      <footer className="infomedia-footer">
        <p className="infomedia__copyright">{t("infomediaCopyrightText")}</p>
      </footer>
    </article>
  );
};

export default InfomediaModalBody;
