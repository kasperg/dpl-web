import SearchIcon from "../../../public/icons/basic/icon-search.svg";
import "./search-full-text.scss";

const SearchFullText = () => {
  return (
    <form className="search-full-text">
      <input
        type="text"
        className="search-full-text__input"
        placeholder="Søg"
      />
      <input type="image" src={SearchIcon} alt="Søg" />
    </form>
  );
};

export default SearchFullText;
