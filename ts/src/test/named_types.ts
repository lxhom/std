import Records from "../record";
let T = null as any;
import NamedTypes from "../named_types";

export namespace NamedTypesTest {
    let values = [NamedTypes.Prims.Boolean, NamedTypes.Prims.Number];

    type Types = NamedTypes.ArrRet<typeof values>
    type Structure = Records.SR<Records.SR<Records.SR<Types>>>

    let structure = {
        test: {
            recurse: {
                b: NamedTypes.Prims.Boolean(true),
                n: NamedTypes.Prims.Number(1),
            },
        },
    } satisfies Structure;
    structure.test.recurse.b.value = false;

    for (let [_, value] of Records.safeEntries(<Structure>structure)) {
        for (let [_2, value2] of Records.safeEntries(value)) {
            for (let [_3, value3] of Records.safeEntries(value2)) {
                if (value3.type === "boolean") {
                    value3.value = true;
                }
            }
        }
    }
}
