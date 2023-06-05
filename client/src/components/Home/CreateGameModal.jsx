import { createSignal } from "solid-js";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import styles from "./CreateGameModal.module.css";

function CreateGameModal(props) {
    const [showPassword, setshowPassword] = createSignal(false);

    function triggerShowPassword(e) {
        setshowPassword(e.target.checked);
    }

    return (
        <Modal class={styles.modal} onClose={props.onClose}>
            <p class={styles.text}>Create New Game</p>
            <section class={styles["form-container"]}>
                <div class={styles.form}>
                    <label>Server Name</label>
                    <input type="text" class="w-100" />
                </div>
                <div class={styles.form}>
                    <label>Password</label>
                    <input
                        type={showPassword() ? "text" : "password"}
                        class="w-100"
                    />
                    <input type="checkbox" onInput={triggerShowPassword} />
                </div>
                <div class={styles.form}>
                    <label>Max allowed players (2-10)</label>
                    <input type="number" value={10} step={1} min={2} max={10} />
                </div>
            </section>
            <section class={styles["btn-container"]}>
                <Button class={`${styles["create-btn"]} primary w-100`}>
                    Create
                </Button>
            </section>
        </Modal>
    );
}
export default CreateGameModal;
