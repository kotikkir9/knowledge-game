import { For, createResource } from "solid-js";
import ServerItem from "./ServerItem";
import styles from "./ServersModal.module.css";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import LoadingSpinner from "../UI/LoadingSpinner";
import { api } from "../../fetch";

async function fetchServers() {
    const res = await fetch(api.servers);
    return await res.json();
}

function ServersModal(props) {
    const [servers, { refetch }] = createResource(fetchServers);

    function refresh() {
        !servers.loading && refetch();
    }

    return (
        <Modal class={styles.modal} onClose={props.onClose}>
            <p class={styles.text}>Servers</p>

            <section class={styles["server-container"]}>
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
                        <Show
                            when={!servers.loading && !servers.error}
                            fallback={
                                <span class="centered">
                                    {servers.loading ? <LoadingSpinner /> : "Something went wrong..."}
                                </span>
                            }
                        >
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
                        </Show>
                    </tbody>
                </table>
            </section>

            <section class={styles["btn-container"]}>
                <Button class={styles["refresh-btn"]} onClick={refresh}>
                    Refresh
                </Button>
            </section>
        </Modal>
    );
}
export default ServersModal;
