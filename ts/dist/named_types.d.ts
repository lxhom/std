declare namespace NamedTypes {
    export interface NamedType<Name extends string, Type> {
        type: Name;
        value: Type;
    }
    export type NamedConstructor<Name extends string, Type> = (value: Type) => NamedType<Name, Type>;
    export function Define<Name extends string, Type>(name: Name, type_null: Type): NamedConstructor<Name, Type>;
    type ArrayValue<T> = T extends Array<infer Item> ? Item : never;
    export type ArrRet<T extends Array<any>> = ReturnType<ArrayValue<T>>;
    export namespace Prims {
        const Boolean: NamedConstructor<"boolean", boolean>;
        const Number: NamedConstructor<"number", number>;
    }
    export {};
}
export default NamedTypes;
