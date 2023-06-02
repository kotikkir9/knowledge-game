import styles from "./Modal.module.css";

function Modal(props) {
    const classes = `${styles.modal} ${props.class ?? ""}`;

    return (
        <div class={classes}>
            <button
                class={styles["close-btn"]}
                onClick={props.onClose}
            ></button>
            {props.children}
        </div>
    );
}
export default Modal;
