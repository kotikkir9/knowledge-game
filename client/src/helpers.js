export const create = (tag, assignments = {}, events = {}, ...children) => {
    const element = document.createElement(tag);
    Object.assign(element, assignments);

    for (const [event, handler] of Object.entries(events)) {
        element.addEventListener(event, handler);
    }

    element.append(...children);
    
    return element;
}