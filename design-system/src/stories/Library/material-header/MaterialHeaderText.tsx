interface MaterialHeaderTextProps {
  title: string;
  author: string;
}

const MaterialHeaderText = ({ title, author }: MaterialHeaderTextProps) => {
  return (
    <>
      <h1 className="material-header__title">{title}</h1>
      <p className="text-body-large">
        <span>Af </span>
        {author}
      </p>
    </>
  );
};

export default MaterialHeaderText;
