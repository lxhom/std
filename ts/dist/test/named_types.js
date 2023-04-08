import Records from "../record";
let T = null;
import NamedTypes from "../named_types";
export var NamedTypesTest;
(function (NamedTypesTest) {
    let values = [NamedTypes.Prims.Boolean, NamedTypes.Prims.Number];
    let structure = {
        test: {
            recurse: {
                b: NamedTypes.Prims.Boolean(true),
                n: NamedTypes.Prims.Number(1),
            },
        },
    };
    structure.test.recurse.b.value = false;
    for (let [_, value] of Records.safeEntries(structure)) {
        for (let [_2, value2] of Records.safeEntries(value)) {
            for (let [_3, value3] of Records.safeEntries(value2)) {
                if (value3.type === "boolean") {
                    value3.value = true;
                }
            }
        }
    }
})(NamedTypesTest || (NamedTypesTest = {}));
