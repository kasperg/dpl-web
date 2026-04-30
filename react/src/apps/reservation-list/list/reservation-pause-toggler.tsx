import React, { useState, FC, useEffect } from "react";
import ReservationsIcon from "@danskernesdigitalebibliotek/dpl-design-system/build/icons/collection/Reservations.svg";
import { useModalButtonHandler } from "../../../core/utils/modal";
import { useText } from "../../../core/utils/text";
import { PatronV5 } from "../../../core/fbs/model";
import { formatDate } from "../../../core/utils/helpers/date";
import { getModalIds } from "../../../core/utils/helpers/modal-helpers";
import { isEnterOrSpacePressed } from "../../../core/utils/helpers/general";

interface ReservationPauseTogglerProps {
  user: PatronV5;
}

const ReservationPauseToggler: FC<ReservationPauseTogglerProps> = ({
  user
}) => {
  const t = useText();
  const { open } = useModalButtonHandler();
  const { pauseReservation } = getModalIds();
  const [onHoldDates, setOnHoldDates] = useState<string>();

  const openPauseReservationModal = () => {
    open(pauseReservation as string);
  };

  useEffect(() => {
    if (user && user.onHold && user.onHold.from && user.onHold.to) {
      setOnHoldDates(
        `${formatDate(user.onHold.from)} - ${formatDate(user.onHold.to)}`
      );
    } else if (user && user.onHold === null) {
      setOnHoldDates("");
    }
  }, [user]);

  return (
    <div className="pause-reservation m-32">
      <div className="pause-reservation__pagefold" />
      <div className="pause-reservation__flex">
        <div className="pause-reservation__flex__reservation-icon">
          <img src={ReservationsIcon} alt="" />
        </div>
        <div className="pause-reservation__flex__text">
          {onHoldDates
            ? t("reservationListPauseReservationOnHoldText")
            : t("reservationListPauseReservationText")}
        </div>
        {onHoldDates && (
          <span
            aria-label={t("reservationListOnHoldAriaText")}
            className="pause-reservation__flex__badge"
          >
            {onHoldDates}
          </span>
        )}
        <div className="pause-reservation__flex__button">
          <button
            aria-label={t("reservationListPauseReservationAriaModalText")}
            type="button"
            onMouseUp={openPauseReservationModal}
            onKeyUp={(e) => {
              if (isEnterOrSpacePressed(e.key)) {
                openPauseReservationModal();
              }
            }}
            className="button button--filled button--small"
          >
            {t("reservationListPauseReservationButtonText")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationPauseToggler;
