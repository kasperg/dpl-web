import Cover from "../cover/Cover";

export type ReservationHeaderProps = {
  author: string;
  label: string;
  title: string;
};

const ReservationHeader = ({
  author,
  label,
  title,
}: ReservationHeaderProps) => {
  return (
    <header className="reservation-modal__header">
      <Cover
        src="images/book_cover_3.jpg"
        size="medium"
        animate={false}
        tint="120"
      />
      <div className="reservation-modal__description">
        <div className="reservation-modal__tag">{label}</div>
        <h2 className="reservation-modal__description-title">{title}</h2>
        <p className="text-body-medium-regular">{author}</p>
      </div>
    </header>
  );
};

export default ReservationHeader;
