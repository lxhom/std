// from https://github.com/sveltejs/svelte/blob/master/src/runtime/store/index.ts

import {run_all, subscribe, noop, safe_not_equal, is_function, get_store_value} from 'svelte/internal';

/** Callback to inform of a value updates. */
export type Subscriber<T> = (value: T) => void;

/** Unsubscribes from value updates. */
export type Unsubscriber = () => void;

/** Callback to update a value. */
export type Updater<T> = (value: T) => T;

/** Cleanup logic callback. */
type Invalidator<T> = (value?: T) => void;

/** Start and stop notification callbacks. */
export type StartStopNotifier<T> = (set: Subscriber<T>) => Unsubscriber | void;

/** Readable interface for subscribing. */
export interface Readable<T> {
    /**
     * Subscribe on value changes.
     * @param run subscription callback
     * @param invalidate cleanup callback
     */
    subscribe(this: void, run: Subscriber<T>, invalidate?: Invalidator<T>): Unsubscriber;

    /**
     * Get value without subscribing.
     */
    get(): T;
}

/** Writable interface for both updating and subscribing. */
export interface Writable<T> extends Readable<T> {
    /**
     * Set value and inform subscribers.
     * @param value to set
     */
    set(this: void, value: T): void;

    /**
     * Set value without informing subscribers.
     * @param value to set
     */
    set_silent(this: void, value: T): void;

    /**
     * Set value without informing specific subscribers.
     * @param value to set
     * @param excluded to exclude
     */
    set_only_specific(this: void, value: T, excluded: Array<Writable<unknown>>): void;

    /**
     * Update value using callback and inform subscribers.
     * @param updater callback
     */
    update(this: void, updater: Updater<T>): void;
}

/** Pair of subscriber and invalidator. */
type SubscribeInvalidateTuple<T> = [Subscriber<T>, Invalidator<T>, T];

const subscriber_queue = [];

/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
export function readable<T>(value?: T, start?: StartStopNotifier<T>): Readable<T> {
    let w = writable(value, start)
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
export function writable<T>(value?: T, start: StartStopNotifier<T> = noop): Writable<T> {
    let stop: Unsubscriber;
    const subscribers: Set<SubscribeInvalidateTuple<T>> = new Set();

    function set(new_value: T): void {
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

    function set_silent(new_value: T): void {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
        }
    }

    function set_only_specific(new_value: T, excluded: Array<Writable<unknown>>): void {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    if (!(excluded.includes(subscriber[2] as unknown as Writable<unknown>))) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                }
                if (run_queue) {
                    let queue = subscriber_queue.filter(e => !excluded.includes(e[2] as Writable<unknown>))
                    for (let i = 0; i < queue.length; i += 2) {
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
    }

    function update(fn: Updater<T>): void {
        set(fn(value));
    }

    function subscribe(run: Subscriber<T>, invalidate: Invalidator<T> = noop): Unsubscriber {
        const subscriber: SubscribeInvalidateTuple<T> = [run, invalidate, this];
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

    function get(): T {
        return value;
    }

    return {set, update, subscribe, set_silent, set_only_specific, get};
}

/** One or more `Readable`s. */
type Index = Readable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;

/** One or more values from `Readable` stores. */
type StoresValues<T> = T extends Readable<infer U> ? U :
    { [K in keyof T]: T[K] extends Readable<infer U> ? U : never };

/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @param stores - input stores
 * @param fn - function callback that aggregates the values
 * @param initial_value - when used asynchronously
 */
export function derived<S extends Index, T>(
    stores: S,
    fn: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void,
    initial_value?: T
): Readable<T>;

/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @param stores - input stores
 * @param fn - function callback that aggregates the values
 * @param initial_value - initial value
 */
export function derived<S extends Index, T>(
    stores: S,
    fn: (values: StoresValues<S>) => T,
    initial_value?: T
): Readable<T>;

/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @param stores - input stores
 * @param fn - function callback that aggregates the values
 */
export function derived<S extends Index, T>(
    stores: S,
    fn: (values: StoresValues<S>) => T
): Readable<T>;

export function derived<T>(stores: Index, fn: Function, initial_value?: T): Readable<T> {
    const single = !Array.isArray(stores);
    const stores_array: Array<Readable<any>> = single
        ? [stores as Readable<any>]
        : stores as Array<Readable<any>>;

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
                set(result as T);
            } else {
                cleanup = is_function(result) ? result as Unsubscriber : noop;
            }
        };

        const unsubscribers = stores_array.map((store, i) => subscribe(
            store,
            (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            },
            () => {
                pending |= (1 << i);
            })
        );

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
export function readonly<T>(store: Readable<T>): Readable<T> {
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
export {get_store_value as get};
