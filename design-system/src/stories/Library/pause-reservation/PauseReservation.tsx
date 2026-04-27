import { ReactComponent as ReservationsIcon } from "../../../public/icons/collection/Reservations.svg";

export type PauseReservationProps = {
  isChecked?: boolean;
  isPausedtext: string;
  pauseText: string;
  dates?: string;
  classNames?: string;
};

export const PauseReservation = ({
  isChecked,
  pauseText,
  isPausedtext,
  dates,
  classNames,
}: PauseReservationProps) => {
  return (
    <div className={`dpl-pause-reservation-component ${classNames}`}>
      <div className="dpl-pause-reservation-component__pagefold" />
      <div className="dpl-pause-reservation-component__flex">
        <div className="dpl-pause-reservation-component__flex__reservation-icon">
          <ReservationsIcon />
        </div>
        <div className="dpl-pause-reservation-component__flex__text">
          {isChecked ? isPausedtext : pauseText}
        </div>
        {isChecked && dates && (
          <span
            aria-label="Reservationer er sat på pause i følgende periode"
            className="dpl-pause-reservation-component__flex__badge"
          >
            {dates}
          </span>
        )}
        <div className="dpl-pause-reservation-component__flex__button">
          {/* eslint-disable-next-line local-rules/single-bem-block */}
          <button type="button" className="btn-primary btn-filled btn-small">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};
