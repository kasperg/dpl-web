import Cover from "../cover/Cover";
import { ReactComponent as ExpandMoreIcon } from "../../../public/icons/collection/ExpandMore.svg";

type InstantLoanSummaryProps = {
  title: string;
  subTitle: string;
  underlineDescription: string;
};

const InstantLoanSummary: React.FunctionComponent<InstantLoanSummaryProps> = ({
  title,
  subTitle,
  underlineDescription,
}) => (
  <>
    <div className="pagefold-triangle--small" />
    <Cover
      src="images/book_cover_3.jpg"
      size="small"
      animate={false}
      tint="120"
    />
    <div>
      <h2 className="instant-loan__summary__title">{title}</h2>
      <p className="text-small-caption">{subTitle}</p>
      <div className="instant-loan__underline">
        {/* eslint-disable-next-line local-rules/single-bem-block */}
        <p className="link-tag text-small-caption">{underlineDescription}</p>
        <ExpandMoreIcon className="instant-loan__arrow" />
      </div>
    </div>
  </>
);

export default InstantLoanSummary;
