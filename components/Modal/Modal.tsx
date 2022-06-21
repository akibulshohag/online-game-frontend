import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStatus } from "../../context/ContextStatus.js";
import styles from "./Modal.module.css";

type PropType = {
  handleClose: any;
  children: any;
  title: string;
};

export default function Modal(props: PropType) {
  // const showHideClassName = show ? "modal display-block" : "modal display-none";
  const { handleClose, children, title } = props;
  const { modal, setModal } = useStatus();

  return (
    <div
      className={`${styles.modal} ${
        modal ? styles.displayBlock : styles.displayNone
      }`}
    >
      <section className={styles.mainModal}>
        <div className={styles.modal__title}>
          <h4 style={{ color: "white" }}>{title}</h4>
          <FontAwesomeIcon
            icon={faTimes}
            height={25}
            width={25}
            color="white"
            style={{ cursor: "pointer" }}
            onClick={handleClose}
          />
          {/* <button type="button" onClick={handleClose}>
                        Close
                    </button> */}
        </div>
        {children}
      </section>
    </div>
  );
}
