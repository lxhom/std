// from https://github.com/sveltejs/svelte/blob/master/src/runtime/store/index.ts
import { run_all, subscribe, noop, safe_not_equal, is_function, get_store_value } from 'svelte/internal';
const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
export function readable(value, start) {
    let w = writable(value, start);
    return {
        subscribe: w.subscribe,
        get: w.get
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
export function writable(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    subscriber[1]();
                    subscriber_queue.push(subscriber, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function set_silent(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
        }
    }
    function set_only_specific(new_value, excluded) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    if (!(excluded.includes(subscriber[2]))) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                }
                if (run_queue) {
                    let queue = subscriber_queue.filter(e => !excluded.includes(e[2]));
                    for (let i = 0; i < queue.length; i += 2) {
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate, this];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0 && stop) {
                stop();
                stop = null;
            }
        };
    }
    function get() {
        return value;
    }
    return { set, update, subscribe, set_silent, set_only_specific, get };
}
export function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let inited = false;
        const values = [];
        let pending = 0;
        let cleanup = noop;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        inited = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
        };
    });
}
/**
 * Takes a store and returns a new one derived from the old one that is readable.
 *
 * @param store - store to make readonly
 */
export function readonly(store) {
    return {
        subscribe: store.subscribe.bind(store),
        get: store.get.bind(store)
    };
}
/**
 * Get the current value from a store by subscribing and immediately unsubscribing.
 * @param store readable
 * @deprecated use `get` instead
 */
export { get_store_value as get };
