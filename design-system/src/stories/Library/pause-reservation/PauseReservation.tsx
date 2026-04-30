import { ReactComponent as ReservationsIcon } from "../../../public/icons/collection/Reservations.svg";
import "./pause-reservation.scss";
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
    <div className={`pause-reservation ${classNames}`}>
      <div className="pause-reservation__pagefold" />
      <div className="pause-reservation__flex">
        <div className="pause-reservation__flex__reservation-icon">
          <ReservationsIcon />
        </div>
        <div className="pause-reservation__flex__text">
          {isChecked ? isPausedtext : pauseText}
        </div>
        {isChecked && dates && (
          <span
            aria-label="Reservationer er sat på pause i følgende periode"
            className="pause-reservation__flex__badge"
          >
            {dates}
          </span>
        )}
        <div className="pause-reservation__flex__button">
          {/* eslint-disable-next-line local-rules/single-bem-block */}
          <button type="button" className="button button--filled button--small">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};
