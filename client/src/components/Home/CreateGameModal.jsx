import { createSignal } from "solid-js";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import styles from "./CreateGameModal.module.css";

function CreateGameModal(props) {
    const [showPassword, setshowPassword] = createSignal(false);

    function triggerShowPassword(e) {
        setshowPassword(e.target.checked);
    }

    function submit(form) {
        form.preventDefault();

        const inputs = form.target.elements;
        const inputValues = {};

        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];

            if (input.localName === "input") {
                inputValues[input.name] = input.value;
            }
        }

        console.log(inputValues);
    }

    return (
        <Modal class={styles.modal} onClose={props.onClose}>
            <p class={styles.text}>Create New Game</p>
            <form class={styles["form-container"]} onSubmit={submit}>
                <div class={styles["form-inputs"]}>
                    <div class={styles.form}>
                        <label>Server Name</label>
                        <input type="text" required class="w-100" name="name" />
                    </div>
                    <div class={styles.form}>
                        <label>Password</label>
                        <input
                            type={showPassword() ? "text" : "password"}
                            class="w-100"
                            name="password"
                        />
                        {/* <input type="checkbox" onInput={triggerShowPassword} /> */}
                    </div>
                    <div class={styles.form}>
                        <label>Max allowed players (2-10)</label>
                        <input
                            type="number"
                            value={10}
                            step={1}
                            min={2}
                            max={10}
                            name="maxPlayers"
                            required
                        />
                    </div>
                </div>
                <Button class={`${styles["create-btn"]} primary w-100`}>
                    Create
                </Button>
            </form>
        </Modal>
    );
}
export default CreateGameModal;
