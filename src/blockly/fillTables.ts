export default (): string[][] => {
    console.log("Filling tables");

    // TODO: Get all tables from the api (however, currently this is not possible)
    const tables = [
        "ethereum.blocks",
        "ethereum.creation_traces",
        "ethereum.logs",
        "ethereum.traces",
        "ethereum.transactions"
    ];

    return tables.map((table, index) => { return [table, table] });
}