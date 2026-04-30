import React, { FC, ReactNode } from "react";
import "@danskernesdigitalebibliotek/dpl-design-system/build/css/components/list-buttons.css";

export interface ListHeaderProps {
  header: string | ReactNode;
  amount: number | null;
  buttons?: ReactNode;
  dataCy?: string;
}

const ListHeader: FC<ListHeaderProps> = ({
  header,
  amount,
  buttons,
  dataCy = "list-header"
}) => {
  return (
    <div className="list-buttons">
      <h2 data-cy={dataCy} className="list-buttons__header">
        {header}
        {amount !== null && (
          <span className="list-buttons__power">{amount}</span>
        )}
      </h2>
      {buttons && <div className="list-buttons__buttons">{buttons}</div>}
    </div>
  );
};
export default ListHeader;
