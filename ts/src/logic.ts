namespace Logic {
    export type Not<T extends boolean> = T extends true ? false : true;
    export type And<A extends boolean, B extends boolean> = A extends true ? B : false;
    export type Or<A extends boolean, B extends boolean> = A extends true ? true : B;
    export type Xor<A extends boolean, B extends boolean> = Or<And<A, Not<B>>, And<Not<A>, B>>;
    export type Nand<A extends boolean, B extends boolean> = Not<And<A, B>>;
    export type Nor<A extends boolean, B extends boolean> = Not<Or<A, B>>;
    export type Xnor<A extends boolean, B extends boolean> = Not<Xor<A, B>>;

    export type If<T extends boolean, A, B> = T extends true ? A : B;
    // okay. fuck. typescript has a bug
    // if you do `never extends A` it will always be never regardless of the
    // arguments. if you do `A extends never` it will always be true.
    // for some godforsaken reason it works with arrays.
    export type UncheckedExtends<A, B> = Array<A> extends Array<B> ? true : false
    export type IsAny<A> = And<UncheckedExtends<"str", A>, UncheckedExtends<42, A>>
    export type Extends<A, B> =
        If<UncheckedExtends<A, never>, UncheckedExtends<B, A>,
            If<And<IsAny<A>, IsAny<B>>, true,
                If<Or<IsAny<A>, IsAny<B>>, false,
                    UncheckedExtends<A, B>
                >
            >
        >
    export type Is<A, B> = And<Extends<A, B>, Extends<B, A>>
    export type IsNever<A> = Extends<A, never>
    export type IsUnknown<A> = Extends<A, unknown>;
}

export default Logic
