export default function doesMatch(tableName: string, columnName: string) {
    // TODO: Get values from api. (Currently the api does not offer this functionality)
    switch (tableName) {
        case "*":
        case "all":
            return true;
        default:
            return ["blocks", "creation_traces", "logs", "traces", "transactions"].includes(columnName);
    }
}