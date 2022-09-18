export default {
    'kind': 'categoryToolbox',
    'contents': [
        {
            "kind": "category",
            "name": "Statements & clauses",
            "contents": [
                {
                    "kind": "block",
                    "type": "select_groupby"
                },
                { 'kind': 'block', 'type': 'select_where' },
                { 'kind': 'block', 'type': 'select_having' },
                { 'kind': 'block', 'type': 'select_orderby' },
            ]
        },
        {
            "kind": "category",
            "name": "Tables & attributes",
            "contents": [
                { 'kind': 'block', 'type': 'table' },
                { 'kind': 'block', 'type': 'allchooser' },
                { 'kind': 'block', 'type': 'conditionchooser' },
            ],
        },
        {
            "kind": "category",
            "name": "Aliases",
            "contents": [
                { 'kind': 'block', 'type': 'tablename_as' },
            ],
        },
        {
            "kind": "category",
            "name": "Operators",
            "contents": [
                { 'kind': 'block', 'type': 'and' },
                { 'kind': 'block', 'type': 'or' },
                { 'kind': 'block', 'type': 'not' },
                { 'kind': 'block', 'type': 'between' },
                { 'kind': 'block', 'type': 'innifier' },
                { 'kind': 'block', 'type': 'compare' },
                { 'kind': 'block', 'type': 'math' },
            ],
        },
        {
            "kind": "category",
            "name": "Value inputs",
            "contents": [
                { 'kind': 'block', 'type': 'boolean' },
                { 'kind': 'block', 'type': 'number' },
                { 'kind': 'block', 'type': 'datepicker' },
                { 'kind': 'block', 'type': 'freeinput' },
            ],
        },
        {
            "kind": "category",
            "name": "Aggregate functions",
            "contents": [
                { 'kind': 'block', 'type': 'aggregate_min' },
                { 'kind': 'block', 'type': 'aggregate_max' },
                { 'kind': 'block', 'type': 'aggregate_avg' },
                { 'kind': 'block', 'type': 'aggregate_sum' },
                { 'kind': 'block', 'type': 'aggregate_count' },
            ],
        }
    ]
}