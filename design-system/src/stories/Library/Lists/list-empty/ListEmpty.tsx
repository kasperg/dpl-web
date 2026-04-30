import { Links, LinksProps } from "../../links/Links";
import "./list-empty.scss";

interface ListEmptyProps {
  text: string;
  links?: LinksProps[];
  className: string;
}

const ListEmpty = ({ text, links, className }: ListEmptyProps) => {
  return (
    <div className={`list-empty ${className ?? ""}`}>
      <p>{text}</p>
      {links && (
        <div className="list-empty__links">
          {links.map((item, index) => (
            <div key={index} className="list-empty__link-item">
              <Links
                linkText={item.linkText}
                href={item.href}
                classNames={item.classNames}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListEmpty;
