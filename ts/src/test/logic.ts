// noinspection JSUnusedLocalSymbols

import Logic from '../logic'
let T = null as any

namespace LogicTest {
    let is1: true = T as Logic.Extends<never, never>;
    let is2: false = T as Logic.Extends<0, never>;
    let is3: false = T as Logic.Extends<never, 0>;

    let is21: true = T as Logic.Extends<any, any>;
    let is22: false = T as Logic.Extends<0, any>;
    let is23: false = T as Logic.Extends<any, 0>;

    let is4: true = T as Logic.Extends<0, 0>;
    let is5: false = T as Logic.Extends<0, 1>;

    let iis1: true = T as Logic.Is<never, never>;
    let iis2: false = T as Logic.Is<0, never>;
    let iis3: false = T as Logic.Is<never, 0>;

    let iis21: true = T as Logic.Is<any, any>;
    let iis22: false = T as Logic.Is<0, any>;
    let iis23: false = T as Logic.Is<any, 0>;

    let iis4: true = T as Logic.Is<0, 0>;
    let iis5: false = T as Logic.Is<0, 1>;

    let is_any1: true = T as Logic.IsAny<any>;
    let is_any2: false = T as Logic.IsAny<0>;

    let if1: "yes" = T as Logic.If<true, "yes", "no">;
    let if2: "yes" = T as Logic.If<true, "yes", "no">;

    let exf1: false = T as Logic.Is<string, "hi">;
    let exf2: false = T as Logic.Is<"hi", string>;

    let in1: true = T as Logic.IsNever<never>;
    let in2: false = T as Logic.IsNever<0>;

    let ex1: false = T as Logic.Extends<0, never>;
    let ex2: false = T as Logic.Extends<never, 0>;
    let ex3: true = T as Logic.Extends<never, never>;
    let ex4: true = T as Logic.Extends<0, 0>;
}
