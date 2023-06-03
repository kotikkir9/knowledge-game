import { Show, createSignal } from "solid-js";
import Button from "../components/UI/Button";
import styles from "./HomePage.module.css";
import ServersModal from "../components/Home/ServersModal";
import CreateGameModal from "../components/Home/CreateGameModal";

function HomePage(props) {
    const [serversModalShow, setServersModalShow] = createSignal(false);
    const [createModalShow, setCreateModalShow] = createSignal(false);

    function trigger(prev, bool) {
        if (bool != null)
            if (bool === prev) return;
            else return bool;
        else return !prev;
    }

    function triggerServersModal(bool, e) {
        e.stopPropagation();
        setServersModalShow((prev) => trigger(prev, bool));
    }

    function triggerCreateServerModal(bool, e) {
        e.stopPropagation();
        setCreateModalShow((prev) => trigger(prev, bool));
    }

    return (
        <div class={styles.container}>
            <Show when={serversModalShow()}>
                <ServersModal onClose={triggerServersModal.bind(null, false)} />
            </Show>
            <Show when={createModalShow()}>
                <CreateGameModal
                    onClose={triggerCreateServerModal.bind(null, false)}
                />
            </Show>
            <div class={styles["btn-container"]}>
                <Button
                    class="primary"
                    onClick={triggerServersModal.bind(null, true)}
                >
                    Find Game
                </Button>
                <Button
                    class="primary"
                    onClick={triggerCreateServerModal.bind(null, true)}
                >
                    New Game
                </Button>
            </div>
        </div>
    );
}

export default HomePage;
