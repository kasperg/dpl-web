import React from "react";
import { ReactComponent as HeartFilledIcon } from "../../../public/icons/basic/icon-heart-filled.svg";
import { ReactComponent as HeartEmptyIcon } from "../../../public/icons/basic/icon-heart-grey.svg";

export type ReviewProps = {
  numberOfReviews: number;
  meta: string;
  hearts: 1 | 2 | 3 | 4 | 5 | 6;
  headline: string;
  body?: string;
  linkText: string;
  linkLink?: string;
};

export const Review: React.FC<ReviewProps> = ({
  numberOfReviews,
  meta,
  hearts,
  headline,
  body,
  linkText,
  linkLink,
}) => {
  const filledHeartsArray = Array.from({ length: hearts }, (_, i) => i + 1);
  const emptyHeartsArray = Array.from({ length: 6 - hearts }, (_, i) => i + 1);
  const reviewsArray = Array.from({ length: numberOfReviews }, (_, i) => i + 1);
  return (
    <ul className="reviews">
      {reviewsArray.map((reviewNumber) => {
        return (
          <li className="review" key={reviewNumber}>
            <div className="review__meta">{meta}</div>
            <div
              className="review__rating"
              role="figure"
              aria-label={`Rating of this item is ${hearts} out of 6`}
            >
              {filledHeartsArray.map((value) => {
                return (
                  <HeartFilledIcon key={value} className="review__heart" />
                );
              })}
              {emptyHeartsArray.map((value) => {
                return <HeartEmptyIcon key={value} className="review__heart" />;
              })}
            </div>
            <h3 className="review__headline">{headline}</h3>
            {body && <p className="review__body">{body}</p>}
            {linkText && (
              // eslint-disable-next-line local-rules/single-bem-block
              <a href={linkLink} className="link-tag review__link">
                {linkText}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Review;
