import { Button } from "../Buttons/button/Button";

const ReservationError = () => {
  return (
    <section className="reservation-modal reservation-modal--confirm">
      <h2 className="reservation-modal__title">Reservationsfejl</h2>
      <p className="reservation-modal__text">
        Der er desværre sket en fejl. Vi beklager ulejligheden. Prøv igen
      </p>
      <Button
        classNames="reservation-modal__confirm-button"
        label="OK"
        disabled={false}
        collapsible={false}
        size="small"
        buttonType="none"
        variant="filled"
      />
    </section>
  );
};

export default ReservationError;
