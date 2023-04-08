declare namespace Records {
    type SR<T> = Record<string, T>;
    type RecordValue<T> = T extends SR<infer Item> ? Item : never;
    type RecordEntry<T> = T extends SR<infer Item> ? [string, Item] : never;
    let safeValues: <T extends SR<any>>(record: T) => RecordValue<T>[];
    let safeEntries: <T extends SR<any>>(record: T) => RecordEntry<T>[];
}
export default Records;
