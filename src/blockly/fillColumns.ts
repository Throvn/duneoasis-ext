import fillTables from "./fillTables";

export default (tableIndex: unknown = 0): string[][] => {
    console.log("Filling columns", tableIndex);
    const tables = [
        "ethereum.blocks",
        "ethereum.creation_traces",
        "ethereum.logs",
        "ethereum.traces",
        "ethereum.transactions"
    ];

    // TODO: Get all tables from the api (however, currently this is not possible)
    let columns: string[] = ["base_fee_per_gas", "difficulty", "gas_limit", "gas_used", "hash", "miner", "nonce", "number", "parent_hash", "size", "time", "total_difficulty"];

    return columns.map((column, index) => { return [column, column] });
}