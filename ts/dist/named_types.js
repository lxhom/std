let T = null;
var NamedTypes;
(function (NamedTypes) {
    function Define(name, type_null) {
        return (value) => ({ type: name, value: value });
    }
    NamedTypes.Define = Define;
    let Prims;
    (function (Prims) {
        Prims.Boolean = Define("boolean", T);
        Prims.Number = Define("number", T);
    })(Prims = NamedTypes.Prims || (NamedTypes.Prims = {}));
})(NamedTypes || (NamedTypes = {}));
export default NamedTypes;
