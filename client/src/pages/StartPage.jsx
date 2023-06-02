import { Show, createSignal } from "solid-js";
import Button from "../components/common/Button";
import styles from "./StartPage.module.css";
import ServersModal from "../components/ServersModal";

function StartPage(props) {
    const [serversModalShow, setServersModalShow] = createSignal(false);

    function triggerServersModal(bool, e) {
        e.stopPropagation();
        setServersModalShow((prev) => {
            if (bool != null)  
                if (bool === prev) return;
                else return bool;
            else 
                return !prev;
        });
    }

    return (
        <div class={styles.container}>
            <Show when={serversModalShow()}>
                <ServersModal onClose={triggerServersModal.bind(null, false)}/>
            </Show>
            <div class={styles["btn-container"]}>
                <Button class="primary" onClick={triggerServersModal.bind(null, true)}>
                    Find Game
                </Button>
                <Button class="primary">New Game</Button>
            </div>
        </div>
    );
}

export default StartPage;
