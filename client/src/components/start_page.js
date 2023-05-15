import { create } from "../helpers.js";

function StartPage() {
    const inputField = create('input', {
        classList: 'text-field',
        placeholder: 'What is your name?'
    });

    const handleClick = () => {
        const text = inputField.value;
        if (text.trim().length === 0) {
            inputField.classList.add('bg-error');
            setTimeout(() => {
                inputField.classList.remove('bg-error');
            }, 500);

            return
        }

        console.log(inputField.value)
    }

    const button = create('button', {
        classList: 'btn',
        textContent: 'Join Game'
    }, {
        click: handleClick
    });

    return create('div', { 
        classList: 'start-page-container' 
    }, {}, inputField, button);
}

export default StartPage;