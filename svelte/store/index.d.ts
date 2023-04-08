import { get_store_value } from 'svelte/internal';
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
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
export declare function readable<T>(value?: T, start?: StartStopNotifier<T>): Readable<T>;
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
export declare function writable<T>(value?: T, start?: StartStopNotifier<T>): Writable<T>;
/** One or more `Readable`s. */
type Index = Readable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;
/** One or more values from `Readable` stores. */
type StoresValues<T> = T extends Readable<infer U> ? U : {
    [K in keyof T]: T[K] extends Readable<infer U> ? U : never;
};
/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @param stores - input stores
 * @param fn - function callback that aggregates the values
 * @param initial_value - when used asynchronously
 */
export declare function derived<S extends Index, T>(stores: S, fn: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void, initial_value?: T): Readable<T>;
/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @param stores - input stores
 * @param fn - function callback that aggregates the values
 * @param initial_value - initial value
 */
export declare function derived<S extends Index, T>(stores: S, fn: (values: StoresValues<S>) => T, initial_value?: T): Readable<T>;
/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @param stores - input stores
 * @param fn - function callback that aggregates the values
 */
export declare function derived<S extends Index, T>(stores: S, fn: (values: StoresValues<S>) => T): Readable<T>;
/**
 * Takes a store and returns a new one derived from the old one that is readable.
 *
 * @param store - store to make readonly
 */
export declare function readonly<T>(store: Readable<T>): Readable<T>;
/**
 * Get the current value from a store by subscribing and immediately unsubscribing.
 * @param store readable
 * @deprecated use `get` instead
 */
export { get_store_value as get };
