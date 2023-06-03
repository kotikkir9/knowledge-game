function ServerItem(props) {
    return (
        <tr>
            <td>{props.locked ? "\uD83D\uDD12" : ""}</td>
            <td>{props.name}</td>
            <td>{`${props.playerCount}/${props.maxAllowed}`}</td>
            <td>{props.status}</td>
        </tr>
    );
}
export default ServerItem;
