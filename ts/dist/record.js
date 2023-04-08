var Records;
(function (Records) {
    Records.safeValues = (record) => Object.values(record);
    Records.safeEntries = (record) => Object.entries(record);
})(Records || (Records = {}));
export default Records;
