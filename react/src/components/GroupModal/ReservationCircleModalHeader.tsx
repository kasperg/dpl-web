import * as React from "react";
import { FC } from "react";
import check from "@danskernesdigitalebibliotek/dpl-design-system/build/icons/basic/icon-check.svg";
import StatusCircleIcon from "../../apps/loan-list/materials/utils/status-circle-icon";
import { getColors } from "../../core/utils/helpers/general";
import { useText } from "../../core/utils/text";

export interface ReservationCircleModalHeaderProps {
  header: string;
}

const ReservationCircleModalHeader: FC<ReservationCircleModalHeaderProps> = ({
  header
}) => {
  const { success } = getColors();
  const t = useText();

  return (
    <>
      <StatusCircleIcon percent={100} color={success as string}>
        <img className="counter__icon" src={check} alt="" />
        <span className="counter__label">
          {t("readyForLoanCounterLabelText")}
        </span>
      </StatusCircleIcon>
      <div>
        <h2 className="modal-loan__title">{header}</h2>
        <p className="modal-loan__subtitle" />
      </div>
    </>
  );
};

export default ReservationCircleModalHeader;
