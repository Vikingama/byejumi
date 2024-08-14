function EventBus(listener) {
    this.listener = listener || {};
}
EventBus.prototype.subscribe = function(event, handle) {
    // 注册订阅者
    if (typeof event !== "string") {
        throw new Error("event  must be a kind of string...");
    }
    if (typeof handle !== "function") {
        throw new Error("handle must be a kind of function...");
    }
    if (!this.listener[event]) {
        this.listener[event] = [];
        this.listener[event].push(handle);
    } else {
        if (this.listener[event].indexOf(handle) === -1) {
            this.listener[event].push(handle);
        }
    }
};
EventBus.prototype.unSubscribe = function(event, handle) {
    let index = this.listener[event].indexOf(handle);
    if (index !== -1) {
        this.listener[event].splice(index, 1);
    }
};
EventBus.prototype.dispatch = function(event, payload) {
    if (this.listener[event]) {
        this.listener[event].forEach(handle => {
            handle(payload);
        });
    } else {
        throw new Error("subscribe dosen't exist...");
    }
};
