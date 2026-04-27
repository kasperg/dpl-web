import React from "react";
import { Button } from "../../Buttons/button/Button";
import { Links } from "../../links/Links";
import Modal from "../Modal";

export type ModalCTAProps = {
  title: string;
  showModal: boolean;
};

export const ModalCTA: React.FC<ModalCTAProps> = ({ title, showModal }) => (
  <Modal shownModal={showModal} classNames="modal-cta modal-padding">
    <div className="modal-cta__container">
      <h2 className="text-header-h2">{title}</h2>
      <div className="modal-cta__description">
        <p className="text-body-medium-regular">
          Fornyer du dine lån, forhøjes dit gebyr.
        </p>
        <p className="modal-cta__text">
          Alle materialer ikke kan fornys og lånet splittes derfor op. Ved
          overskredne lån modtager du et gebyr pr. lån og derfor forhøjes dit
          samlede gebyr, hvis du vælger at gå videre med at fornye.{" "}
          <Links
            href="/"
            linkText="Læs mere"
            classNames="color-secondary-gray ml-8"
          />
        </p>
        <p className="modal-cta__text">Er du sikker på du vil fornye?</p>
      </div>
      <div className="modal-cta__buttons">
        <Button
          buttonType="default"
          size="large"
          variant="filled"
          label="Annuller fornyelse"
          disabled={false}
          collapsible
          classNames="modal-cta__button"
        />
        <div className="modal-cta__link">
          <Links
            href="/"
            linkText="Ja, forny mulige"
            classNames="color-secondary-gray ml-8"
          />
        </div>
      </div>
    </div>
  </Modal>
);
