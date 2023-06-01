import styles from './Button.module.css';

function Button(props) {
    const classes = `${styles.btn} ${props.class ?? ''}`;

    return <button class={classes} onClick={props.onClick}>
        {props.children}
    </button>;
}
export default Button;
