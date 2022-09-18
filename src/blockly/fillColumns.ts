import fillTables from "./fillTables";

export default (tableIndex: unknown = 0): string[][] => {
    console.log("Filling columns", tableIndex);
    const tables = [
        "arbitrum",
        "avalance_c",
        "bnb",
        "ethereum",
        "gnosis",
        "optimism",
    ];

    // TODO: Get all tables from the api (however, currently this is not possible)
    let columns: string[] = ["blocks", "creation_traces", "logs", "traces", "transactions"];

    return columns.map((column, index) => { return [column, `${index}`] });
}