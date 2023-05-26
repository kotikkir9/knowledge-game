class GameState {
    #game_started = false;
    #max_allowed_players = 8;
    #players = {}

    constructor() {
    }

    set_max_allowed_players(max) {
        this.#max_allowed_players = max;
    }

    set_game_started(state) {
        this.#game_started = state;
    }

    game_started() {
        return this.#game_started;
    }

    add_player(player) {
        this.#players[player.id] = player;
    }

    remove_player(id) {
        delete this.#players[id];
    }

    get_players_count() {
        return Object.keys(this.#players).length;
    }

    get_players_entries() {
        return Object.entries(this.#players);
    }

    get_player(id) {
        return this.#players[id];
    }
}

export const game_state = new GameState();