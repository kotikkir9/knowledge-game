import styles from "./ServersModal.module.css";
import Modal from "./common/Modal";

function ServersModal(props) {

    

    return (
        <Modal class={styles.modal} onClose={props.onClose}>
            <p class={styles.text}>Servers</p>
        </Modal>
    );
}
export default ServersModal;
