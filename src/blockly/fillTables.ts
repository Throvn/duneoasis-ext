export default (): string[][] => {
    console.log("Filling tables");

    // TODO: Get all tables from the api (however, currently this is not possible)
    let tables = [
        "arbitrum",
        "avalance_c",
        "bnb",
        "ethereum",
        "gnosis",
        "optimism",
        "solana"
    ];

    return tables.map((table, index) => { return [table, `${index}`] });
}