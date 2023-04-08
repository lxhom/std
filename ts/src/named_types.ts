let T = null as any;

namespace NamedTypes {
    export interface NamedType<Name extends string, Type> {
        type: Name;
        value: Type;
    }

    export type NamedConstructor<Name extends string, Type> =
        (value: Type) => NamedType<Name, Type>;

    export function Define<Name extends string, Type>
    (name: Name, type_null: Type): NamedConstructor<Name, Type> {
        return (value: Type) => ({type: name, value: value});
    }

    type ArrayValue<T> = T extends Array<infer Item> ? Item : never;
    export type ArrRet<T extends Array<any>> = ReturnType<ArrayValue<T>>

    export namespace Prims {
        export const Boolean = Define("boolean", <boolean>T);
        export const Number = Define("number", <number>T);
    }
}

export default NamedTypes
