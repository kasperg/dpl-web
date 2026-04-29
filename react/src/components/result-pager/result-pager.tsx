import React from "react";
import { useText } from "../../core/utils/text";
import "@danskernesdigitalebibliotek/dpl-design-system/build/css/components/result-pager.css";

export interface ResultPagerProps {
  setPageHandler: () => void;
  itemsShown: number;
  hitcount: number;
  classNames: string;
  isLoading?: boolean;
}
function ResultPager({
  setPageHandler,
  itemsShown,
  hitcount,
  isLoading,
  classNames
}: ResultPagerProps) {
  const t = useText();
  return (
    <div className={`result-pager ${classNames}`}>
      <p className="result-pager__title">
        {t("resultPagerStatusText", {
          placeholders: { "@itemsShown": itemsShown, "@hitcount": hitcount }
        })}
      </p>
      {/* If all items are not visible yet, we need to show the button. */}
      {itemsShown !== hitcount && !isLoading && (
        <button
          type="button"
          className="btn-primary btn-outline btn-medium arrow__hover--right-small uppercase"
          onClick={setPageHandler}
        >
          {t("showMoreText")}
        </button>
      )}
    </div>
  );
}

export default ResultPager;
