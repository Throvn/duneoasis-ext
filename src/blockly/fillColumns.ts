export default (hello: any = undefined): string[][] => {
    console.log("Filling columns");

    // TODO: Get all tables from the api (however, currently this is not possible)
    let tables = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g"
    ];

    return tables.map((table, index) => { return [`${index}`, table] });
}