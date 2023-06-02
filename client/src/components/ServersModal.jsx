import { For, createSignal } from "solid-js";
import ServerItem from "./ServerItem";
import styles from "./ServersModal.module.css";
import Button from "./common/Button";
import Modal from "./common/Modal";

function ServersModal(props) {
    const items = [];
    for (let i = 0; i < 15; i++) {
        items.push({
            name: Math.round(Math.random() * 1_000_000_000),
            // name: 'This is a very loooooooooooooooong server name hell yeah',
            playerCount: 5,
            maxAllowed: 8,
            status: "Pending",
            locked: i % 2 === 0,
        });
    }

    const [servers, setServers] = createSignal(items);

    function refresh() {
        setServers((prev) => prev.slice(0, -1));
    }

    return (
        <Modal class={styles.modal} onClose={props.onClose}>
            <p class={styles.text}>Servers</p>

            <div class={styles["server-container"]}>
                <table cellspacing="0">
                    <thead>
                        <tr>
                            <th>&#128274;</th>
                            <th width="90%">Servers</th>
                            <th>Players</th>
                            <th width="10px">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={servers()}>
                            {(e) => (
                                <ServerItem
                                    locked={e.locked}
                                    name={e.name}
                                    playerCount={e.playerCount}
                                    maxAllowed={e.maxAllowed}
                                    status={e.status}
                                />
                            )}
                        </For>
                    </tbody>
                </table>
            </div>

            <div class={styles["btn-container"]}>
                <Button class={styles["refresh-btn"]} onClick={refresh}>
                    Refresh
                </Button>
            </div>
        </Modal>
    );
}
export default ServersModal;
