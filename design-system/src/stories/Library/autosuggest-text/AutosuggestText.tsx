export type AutosuggestTextProps = {
  textSuggestions: string[];
  categoryText?: string;
};

export const AutosuggestText = (props: AutosuggestTextProps) => {
  const { textSuggestions, categoryText } = props;
  return (
    <>
      {textSuggestions.map((item) => {
        return (
          <li className="autosuggest__text-item">
            <p className="autosuggest__text">{item}</p>
            {categoryText && (
              // eslint-disable-next-line local-rules/single-bem-block
              <div className="boxed-text autosuggest__category-tag">
                {categoryText}
              </div>
            )}
          </li>
        );
      })}
    </>
  );
};
