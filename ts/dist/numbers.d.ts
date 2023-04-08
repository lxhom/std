declare namespace Numbers {
    namespace Tuple {
        type Length<T extends any[]> = T extends {
            length: infer L extends number;
        } ? L : never;
        type BuildTuple<L extends number, T extends any[] = []> = T extends {
            length: L;
        } ? T : BuildTuple<L, [...T, any]>;
    }
    namespace Unsafe {
        type Add<A extends number, B extends number> = Tuple.Length<[...Tuple.BuildTuple<A>, ...Tuple.BuildTuple<B>]>;
        type Subtract<A extends number, B extends number> = Tuple.BuildTuple<A> extends [...(infer U), ...Tuple.BuildTuple<B>] ? Tuple.Length<U> : never;
        type MultiAdd<N extends number, A extends number, I extends number> = I extends 0 ? A : MultiAdd<N, Add<N, A>, Subtract<I, 1>>;
        type EQ<A, B> = A extends B ? (B extends A ? true : false) : false;
        type AtTerminus<A extends number, B extends number> = A extends 0 ? true : (B extends 0 ? true : false);
        type LT<A extends number, B extends number> = AtTerminus<A, B> extends true ? EQ<A, B> extends true ? false : (A extends 0 ? true : false) : LT<Subtract<A, 1>, Subtract<B, 1>>;
        type MultiSub<N extends number, D extends number, Q extends number> = LT<N, D> extends true ? Q : MultiSub<Subtract<N, D>, D, Add<Q, 1>>;
        type Multiply<A extends number, B extends number> = MultiAdd<A, 0, B>;
        type Divide<A extends number, B extends number> = MultiSub<A, B, 0>;
        type Modulo<A extends number, B extends number> = LT<A, B> extends true ? A : Modulo<Subtract<A, B>, B>;
    }
    namespace Validation {
        type IsPositive<N extends number> = `${N}` extends `-${number}` ? false : true;
        type IsWhole<N extends number> = `${N}` extends `${number}.${number}` ? false : true;
        type IsValid<N extends number> = IsPositive<N> extends true ? (IsWhole<N> extends true ? true : false) : false;
        type AreValid<A extends number, B extends number> = IsValid<A> extends true ? (IsValid<B> extends true ? true : false) : false;
    }
    type Add<A extends number, B extends number> = Validation.AreValid<A, B> extends true ? Unsafe.Add<A, B> : never;
    type Subtract<A extends number, B extends number> = Validation.AreValid<A, B> extends true ? Unsafe.Subtract<A, B> : never;
    type Multiply<A extends number, B extends number> = Validation.AreValid<A, B> extends true ? Unsafe.Multiply<A, B> : never;
    type Divide<A extends number, B extends number> = Validation.AreValid<A, B> extends true ? Unsafe.Divide<A, B> : never;
    type Modulo<A extends number, B extends number> = Validation.AreValid<A, B> extends true ? Unsafe.Modulo<A, B> : never;
}
export default Numbers;
