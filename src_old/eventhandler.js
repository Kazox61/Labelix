export class EventHandler {
    constructor() {
        this.events = {};
    }

    connect(name, callback) {
        if (name in this.events) {
            this.events[name].push(callback);
        }
        else {
            this.events[name] = [callback];
        }
    }

    emit(name, ...args) {
        if (name in this.events) {
            this.events[name].forEach(element => {
                element(...args);
            });
        }
    }
}