export const create = (tag, assignments = {}, events = {}, ...children) => {
    const element = document.createElement(tag);
    Object.assign(element, assignments);

    for (const [event, handler] of Object.entries(events)) {
        element.addEventListener(event, handler);
    }

    element.append(...children);

    return element;
}

export const sleep = (ms, abortSignal = null) => {
    return new Promise((resolve, reject) => {
        let timeout = setTimeout(resolve, ms);
        abortSignal?.addEventListener('abort', () => {
            clearTimeout(timeout);
            reject();
        });
    });
}