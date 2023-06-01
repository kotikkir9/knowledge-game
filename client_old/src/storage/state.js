// @ts-check

const global = {
    id: '',
    name: '',
}

export let state = {
    setId: (id) => global.id = id,
    getId: () => global.id,
    setName: (name) => global.name = name,
    getName: () => global.name,
}
