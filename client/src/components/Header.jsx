import styles from "./Header.module.css";

function Header() {
    return (
        <header class={styles.header}>
            <div class={styles.status}>
                <p>Status:</p>
                <p>None</p>
            </div>
            <div>Music player placeholder</div>
        </header>
    );
}

export default Header;
