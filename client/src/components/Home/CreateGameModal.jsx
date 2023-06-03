import Button from "../UI/Button";
import Modal from "../UI/Modal";
import styles from "./CreateGameModal.module.css";

function CreateGameModal(props) {
    return (
        <Modal class={styles.modal} onClose={props.onClose}>
            <p class={styles.text}>Create New Game</p>
            <section>
                <div>
                    <p>Server Name</p>
                    <input type="text" />
                </div>
                <div>
                    <p>Max players (max 10)</p>
                    <input
                        type="number"
                        value={10}
                        step={1}
                        min={2}
                        max={10}
                    />
                </div>
                <div>
                    <p>Add password</p>
                    <input type="checkbox" />
                    <input type="password" show="true" />
                </div>
            </section>
            <section class={styles["btn-container"]}>
                <Button class={`${styles["create-btn"]} primary`}>
                    Create
                </Button>
            </section>
        </Modal>
    );
}
export default CreateGameModal;
