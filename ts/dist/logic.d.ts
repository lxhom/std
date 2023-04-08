declare namespace Logic {
    type Not<T extends boolean> = T extends true ? false : true;
    type And<A extends boolean, B extends boolean> = A extends true ? B : false;
    type Or<A extends boolean, B extends boolean> = A extends true ? true : B;
    type Xor<A extends boolean, B extends boolean> = Or<And<A, Not<B>>, And<Not<A>, B>>;
    type Nand<A extends boolean, B extends boolean> = Not<And<A, B>>;
    type Nor<A extends boolean, B extends boolean> = Not<Or<A, B>>;
    type Xnor<A extends boolean, B extends boolean> = Not<Xor<A, B>>;
    type If<T extends boolean, A, B> = T extends true ? A : B;
    type UncheckedExtends<A, B> = Array<A> extends Array<B> ? true : false;
    type IsAny<A> = And<UncheckedExtends<"str", A>, UncheckedExtends<42, A>>;
    type Extends<A, B> = If<UncheckedExtends<A, never>, UncheckedExtends<B, A>, If<And<IsAny<A>, IsAny<B>>, true, If<Or<IsAny<A>, IsAny<B>>, false, UncheckedExtends<A, B>>>>;
    type Is<A, B> = And<Extends<A, B>, Extends<B, A>>;
    type IsNever<A> = Extends<A, never>;
    type IsUnknown<A> = Extends<A, unknown>;
}
export default Logic;
