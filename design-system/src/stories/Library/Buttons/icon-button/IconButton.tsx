interface IconButtonProps {
  src: string;
  altText: string;
}
const IconButton: React.FC<IconButtonProps> = ({ src, altText }) => {
  return (
    <button className="icon-button" type="button">
      <img src={src} alt={altText} />
    </button>
  );
};

export default IconButton;
