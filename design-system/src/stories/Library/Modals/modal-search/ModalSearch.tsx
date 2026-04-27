import { Button } from "../../Buttons/button/Button";
import Modal from "../Modal";

export type ModalSearchProps = {
  showModal: boolean;
};

export const ModalSearch: React.FC<ModalSearchProps> = ({ showModal }) => {
  return (
    <Modal shownModal={showModal} classNames="modal-search modal-padding">
      <div className="modal-search__container">
        <h3 className="text-header-h3">Gem søgning</h3>
        <div className="modal-search__description">
          <p className="text-body-medium-regular">Navngiv din søgning</p>
        </div>
        <div className="modal-search__input">
          <input
            className="modal-search__input-element"
            type="text"
            aria-label="Save your search results"
          />
        </div>
        <div className="modal-search__buttons">
          <Button
            buttonType="default"
            size="large"
            variant="filled"
            label="gem"
            disabled={false}
            collapsible
          />
        </div>
      </div>
    </Modal>
  );
};
