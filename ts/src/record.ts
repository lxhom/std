namespace Records {
    export type SR<T> = Record<string, T>
    export type RecordValue<T> = T extends SR<infer Item> ? Item : never;
    export type RecordEntry<T> = T extends SR<infer Item> ? [string, Item] : never;

    export let safeValues = <T extends SR<any>>(record: T) => Object.values(record) as Array<RecordValue<T>>;
    export let safeEntries = <T extends SR<any>>(record: T) => Object.entries(record) as Array<RecordEntry<T>>;
}

export default Records
