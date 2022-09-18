import * as Blockly from 'blockly';
import 'blockly/blocks';
import 'blockly/javascript';
import fillTables from '../fillTables';
import fillColumns from '../fillColumns';
import doesMatch from '../doesMatch';



let selectedTable = fillTables()[0];

////////////// lists_select //////////////


Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
    // Block for creating an empty list
    // The 'list_create_with' block is preferred as it is more flexible.
    // <block type="lists_create_with">
    //   <mutation items="0"></mutation>
    // </block>
    {
        "type": "lists_create_empty",
        "message0": "%{BKY_LISTS_CREATE_EMPTY_TITLE}",
        "output": "Array",
        "style": "list_blocks",
        "tooltip": "%{BKY_LISTS_CREATE_EMPTY_TOOLTIP}",
        "helpUrl": "%{BKY_LISTS_CREATE_EMPTY_HELPURL}"
    },
    // Block for creating a list with one element repeated.
    {
        "type": "lists_repeat",
        "message0": "%{BKY_LISTS_REPEAT_TITLE}",
        "args0": [
            {
                "type": "input_value",
                "name": "ITEM"
            },
            {
                "type": "input_value",
                "name": "NUM",
                "check": "Number"
            }
        ],
        "output": "Array",
        "style": "list_blocks",
        "tooltip": "%{BKY_LISTS_REPEAT_TOOLTIP}",
        "helpUrl": "%{BKY_LISTS_REPEAT_HELPURL}"
    },
    // Block for reversing a list.
    {
        "type": "lists_reverse",
        "message0": "%{BKY_LISTS_REVERSE_MESSAGE0}",
        "args0": [
            {
                "type": "input_value",
                "name": "LIST",
                "check": "Array"
            }
        ],
        "output": "Array",
        "inputsInline": true,
        "style": "list_blocks",
        "tooltip": "%{BKY_LISTS_REVERSE_TOOLTIP}",
        "helpUrl": "%{BKY_LISTS_REVERSE_HELPURL}"
    },
    // Block for checking if a list is empty
    {
        "type": "lists_isEmpty",
        "message0": "%{BKY_LISTS_ISEMPTY_TITLE}",
        "args0": [
            {
                "type": "input_value",
                "name": "VALUE",
                "check": ["String", "Array"]
            }
        ],
        "output": "Boolean",
        "style": "list_blocks",
        "tooltip": "%{BKY_LISTS_ISEMPTY_TOOLTIP}",
        "helpUrl": "%{BKY_LISTS_ISEMPTY_HELPURL}"
    },
    // Block for getting the list length
    {
        "type": "lists_length",
        "message0": "%{BKY_LISTS_LENGTH_TITLE}",
        "args0": [
            {
                "type": "input_value",
                "name": "VALUE",
                "check": ["String", "Array"]
            }
        ],
        "output": "Number",
        "style": "list_blocks",
        "tooltip": "%{BKY_LISTS_LENGTH_TOOLTIP}",
        "helpUrl": "%{BKY_LISTS_LENGTH_HELPURL}"
    }
]);  // END JSON EXTRACT (Do not delete this comment.)

Blockly.Blocks['lists_select'] = {
    /**
     * Block for creating a list with any number of elements of any type.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(Blockly.Msg['LISTS_CREATE_WITH_HELPURL']);
        this.setStyle('list_blocks');
        this.itemCount_ = 1;
        this.updateShape_();
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#8007f2');
        this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
        this.setTooltip(Blockly.Msg['LISTS_CREATE_WITH_TOOLTIP']);
    },
    /**
     * Create XML to represent list inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function (workspace) {
        var containerBlock = workspace.newBlock('lists_create_with_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var i = 0; i < this.itemCount_; i++) {
            var itemBlock = workspace.newBlock('lists_create_with_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        // Count number of inputs.
        var connections = [];
        while (itemBlock) {
            connections.push(itemBlock.valueConnection_);
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }
        // Disconnect any children that don't belong.
        for (var i = 0; i < this.itemCount_; i++) {
            var connection = this.getInput('ADD' + i).connection.targetConnection;
            if (connection && connections.indexOf(connection) == -1) {
                connection.disconnect();
            }
        }
        this.itemCount_ = connections.length;
        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 0; i < this.itemCount_; i++) {
            Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var i = 0;
        while (itemBlock) {
            var input = this.getInput('ADD' + i);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            i++;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function () {
        if (this.itemCount_ && this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
            this.appendDummyInput('EMPTY')
                .appendField(Blockly.Msg['LISTS_CREATE_EMPTY_TITLE']);
        }
        // Add new inputs.
        for (var i = 0; i < this.itemCount_; i++) {
            if (!this.getInput('ADD' + i)) {
                var input = this.appendValueInput('ADD' + i);
                if (i == 0) {
                    input.appendField("SELECT");
                    input.setCheck(['freeinput', "tablename_as", "ALL", "CONDITIONCHOOSER", "aggregate_min", "aggregate_max", "aggregate_avg", "aggregate_sum", "aggregate_count"]);
                    input.appendField(new Blockly.FieldDropdown([["\u2009", 'blank'], ["DISTINCT", 'distinct']]), 'option');
                }
            }
        }
        // Remove deleted inputs.
        while (this.getInput('ADD' + i)) {
            this.removeInput('ADD' + i);
            i++;
        }
    }
};

Blockly.Blocks['lists_create_with_container'] = {
    /**
     * Mutator block for list container.
     * @this Blockly.Block
     */
    init: function () {
        this.setStyle('list_blocks');
        this.appendDummyInput()
            .appendField("attributes");
        this.appendStatementInput('STACK');
        this.setTooltip();
        this.contextMenu = false;
    }
};

Blockly.Blocks['lists_create_with_item'] = {
    /**
     * Mutator block for adding items.
     * @this Blockly.Block
     */
    init: function () {
        this.setStyle('list_blocks');
        this.appendDummyInput()
            .appendField("attribute");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip("");
        this.contextMenu = false;
    }
};

Blockly.JavaScript['lists_select'] = function (block) {
    var select = '';
    for (var i = 0; i < this.itemCount_; i++) {
        var current = 'ADD' + i;
        select += Blockly.JavaScript.statementToCode(block, current);

        if (i != this.itemCount_ - 1) {
            select += ', ';
        }
        else {
            select += ' ';
        }
    }

    if (!select.includes(' *')) {
        select = select.substring(0, select.length - 1);
    }
    else if (select.includes(' * ')) {
        select = select.substring(0, select.length - 1);
    }

    var option = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('option'));
    if (option == 'blank' || option == 'all') {
        option = 'select  ';
    }
    else {
        option = 'select DISTINCT ';
    }

    var code = option + select;

    return code;
}

//////////////////////////////////////

///////////// lists_from /////////////


Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
    // Block for creating an empty list
    // The 'list_create_with' block is preferred as it is more flexible.
    // <block type="lists_create_with">
    //   <mutation items="0"></mutation>
    // </block>
    {
        "type": "lists_create_empty",
        "message0": "%{BKY_LISTS_CREATE_EMPTY_TITLE}",
        "output": "Array",
        "style": "list_blocks",
        "tooltip": "%{BKY_LISTS_CREATE_EMPTY_TOOLTIP}",
        "helpUrl": "%{BKY_LISTS_CREATE_EMPTY_HELPURL}"
    },
    // Block for creating a list with one element repeated.
    {
        "type": "lists_repeat",
        "message0": "%{BKY_LISTS_REPEAT_TITLE}",
        "args0": [
            {
                "type": "input_value",
                "name": "ITEM"
            },
            {
                "type": "input_value",
                "name": "NUM",
                "check": "Number"
            }
        ],
        "output": "Array",
        "style": "list_blocks",
        "tooltip": "%{BKY_LISTS_REPEAT_TOOLTIP}",
        "helpUrl": "%{BKY_LISTS_REPEAT_HELPURL}"
    },
    // Block for reversing a list.
    {
        "type": "lists_reverse",
        "message0": "%{BKY_LISTS_REVERSE_MESSAGE0}",
        "args0": [
            {
                "type": "input_value",
                "name": "LIST",
                "check": "Array"
            }
        ],
        "output": "Array",
        "inputsInline": true,
        "style": "list_blocks",
        "tooltip": "%{BKY_LISTS_REVERSE_TOOLTIP}",
        "helpUrl": "%{BKY_LISTS_REVERSE_HELPURL}"
    },
    // Block for checking if a list is empty
    {
        "type": "lists_isEmpty",
        "message0": "%{BKY_LISTS_ISEMPTY_TITLE}",
        "args0": [
            {
                "type": "input_value",
                "name": "VALUE",
                "check": ["String", "Array"]
            }
        ],
        "output": "Boolean",
        "style": "list_blocks",
        "tooltip": "%{BKY_LISTS_ISEMPTY_TOOLTIP}",
        "helpUrl": "%{BKY_LISTS_ISEMPTY_HELPURL}"
    },
    // Block for getting the list length
    {
        "type": "lists_length",
        "message0": "%{BKY_LISTS_LENGTH_TITLE}",
        "args0": [
            {
                "type": "input_value",
                "name": "VALUE",
                "check": ["String", "Array"]
            }
        ],
        "output": "Number",
        "style": "list_blocks",
        "tooltip": "%{BKY_LISTS_LENGTH_TOOLTIP}",
        "helpUrl": "%{BKY_LISTS_LENGTH_HELPURL}"
    }
]);  // END JSON EXTRACT (Do not delete this comment.)

Blockly.Blocks['lists_from'] = {
    /**
     * Block for creating a list with any number of elements of any type.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(Blockly.Msg['LISTS_CREATE_WITH_HELPURL']);
        this.setStyle('list_blocks');
        this.itemCount_ = 1;
        this.updateShape_();
        this.setPreviousStatement(true, ['lists_select']);
        this.setNextStatement(true, ['WHERE', 'GROUP BY', 'FROM']);
        this.setColour('#8007f2');
        this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
        this.setTooltip(Blockly.Msg['LISTS_CREATE_WITH_TOOLTIP']);
    },
    /**
     * Create XML to represent list inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function (workspace) {
        var containerBlock = workspace.newBlock('lists_create_with_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var i = 0; i < this.itemCount_; i++) {
            var itemBlock = workspace.newBlock('lists_create_with_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        // Count number of inputs.
        var connections = [];
        while (itemBlock) {
            connections.push(itemBlock.valueConnection_);
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }
        // Disconnect any children that don't belong.
        for (var i = 0; i < this.itemCount_; i++) {
            var connection = this.getInput('ADD' + i).connection.targetConnection;
            if (connection && connections.indexOf(connection) == -1) {
                connection.disconnect();
            }
        }
        this.itemCount_ = connections.length;
        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 0; i < this.itemCount_; i++) {
            Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var i = 0;
        while (itemBlock) {
            var input = this.getInput('ADD' + i);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            i++;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function () {
        if (this.itemCount_ && this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
            this.appendDummyInput('EMPTY')
                .appendField(Blockly.Msg['LISTS_CREATE_EMPTY_TITLE']);
        }
        // Add new inputs.
        for (var i = 0; i < this.itemCount_; i++) {
            if (!this.getInput('ADD' + i)) {
                var input = this.appendValueInput('ADD' + i);
                if (i == 0) {
                    input.appendField("FROM");
                    input.setCheck(["TABLE", 'tablename_as']);
                }
            }
        }
        // Remove deleted inputs.
        while (this.getInput('ADD' + i)) {
            this.removeInput('ADD' + i);
            i++;
        }
    }
};

Blockly.Blocks['lists_create_with_container'] = {
    /**
     * Mutator block for list container.
     * @this Blockly.Block
     */
    init: function () {
        this.setStyle('list_blocks');
        this.appendDummyInput()
            .appendField("Attribute");
        this.appendStatementInput('STACK');
        this.setTooltip();
        this.contextMenu = false;
    }
};

Blockly.Blocks['lists_create_with_item'] = {
    /**
     * Mutator block for adding items.
     * @this Blockly.Block
     */
    init: function () {
        this.setStyle('list_blocks');
        this.appendDummyInput()
            .appendField("Attribut");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip("");
        this.contextMenu = false;
    }
};

Blockly.JavaScript['lists_from'] = function (block) {
    var select = '';
    for (var i = 0; i < this.itemCount_; i++) {
        var current = 'ADD' + i;
        select += Blockly.JavaScript.statementToCode(block, current);

        var next = i + 1;
        if (i != this.itemCount_ - 1 && Blockly.JavaScript.statementToCode(block, 'ADD' + next) == false) {
            select += ', ';
        }
        else {
            select += ' ';
        }
    }

    var code = ' from ' + select;

    return code;
}

/////////////////////////////////////



Blockly.defineBlocksWithJsonArray([
    {
        "type": "aggregate_min",
        "message0": "MIN %1",
        "args0": [
            {
                "type": "input_value",
                "name": "min",
                "check": ["CONDITIONCHOOSER", 'freeinput']
            },
        ],
        "inputsInline": true,
        "output": 'aggregate_min',
        "colour": '#C440C4',
        "tooltip": "",
        "helpUrl": "",
        "extensions": 'aggregate_Extensions'
    },
    {
        "type": "aggregate_avg",
        "message0": "AVG %1",
        "args0": [
            {
                "type": "input_value",
                "name": "avg",
                "check": ["CONDITIONCHOOSER", 'freeinput']
            }
        ],
        "inputsInline": true,
        "output": 'aggregate_avg',
        "colour": '#C440C4',
        "tooltip": "",
        "helpUrl": "",
        "extensions": 'aggregate_Extensions'
    },
    {
        "type": "aggregate_max",
        "message0": "MAX %1",
        "args0": [
            {
                "type": "input_value",
                "name": "max",
                "check": ["CONDITIONCHOOSER", 'freeinput']
            }
        ],
        "inputsInline": true,
        "output": 'aggregate_max',
        "colour": '#C440C4',
        "tooltip": "",
        "helpUrl": "",
        "extensions": 'aggregate_Extensions'
    },
    {
        "type": "aggregate_sum",
        "message0": "SUM %1",
        "args0": [
            {
                "type": "input_value",
                "name": "sum",
                "check": ["CONDITIONCHOOSER", 'freeinput', 'MATH']
            }
        ],
        "inputsInline": true,
        "output": 'aggregate_sum',
        "colour": '#C440C4',
        "tooltip": "",
        "helpUrl": "",
        "extensions": 'aggregate_Extensions'
    },
    {
        "type": "aggregate_count",
        "message0": "COUNT %1",
        "args0": [
            {
                "type": "input_value",
                "name": "count",
                "check": ["CONDITIONCHOOSER", 'freeinput']
            }
        ],
        "inputsInline": true,
        "output": 'aggregate_count',
        "colour": '#C440C4',
        "tooltip": "",
        "helpUrl": "",
        "extensions": 'aggregate_Extensions'
    }
]);

Blockly.Extensions.register('aggregate_Extensions', function () {
    this.setOnChange(function (changeEvent) {
        var parent = this.getSurroundParent();
        if (parent != null && parent.toString().includes('ORDER BY') && (this.getField('orderA') == null)) {
            this.appendDummyInput('listOrder').appendField(" ").appendField(new Blockly.FieldDropdown([["\u2009", "BLANK"], ["ASC", "ASC"], ["DESC", "DESC"]]), "orderA")
        }
        else if ((parent == null || (!(parent.toString().includes('ORDER BY')))) && this.getField('orderA') != null) {
            this.removeInput('listOrder');
        }
    })
});
Blockly.JavaScript['aggregate_min'] = function (block) {
    var argument = Blockly.JavaScript.statementToCode(block, 'min');
    argument = argument.substring(0, argument.length);
    argument = argument.trim();
    var code = 'min(';
    if (argument.includes(',')) {
        argument = argument.replace(',', '),');
        code = code.concat(argument);
    }
    else if (argument.includes(', max')) {
        argument = argument.replace(', max', ') max');
        code = code.concat(argument);
    }
    else if (argument.includes(', avg')) {
        argument = argument.replace(', avg', ') avg');
        code = code.concat(argument);
    }
    else if (argument.includes(', max')) {
        argument = argument.replace(', max', ') max');
        code = code.concat(argument);
    }
    else if (argument.includes(', sum')) {
        argument = argument.replace(', sum', ') sum');
        code = code.concat(argument);
    }
    else if (argument.includes(', count')) {
        argument = argument.replace(', count', ') count');
        code = code.concat(argument);
    }
    else {
        code = 'min(' + argument + ') ';
    }

    //parent is ORDER BY?!:
    var chosenOrderA = '';
    if (this.getInput('listOrder')) {
        chosenOrderA = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('orderA'));
        if (chosenOrderA == 'BLANK') {
            chosenOrderA = '';
        }
        code = code.concat(' ' + chosenOrderA);
    }
    return code;
};

Blockly.JavaScript['aggregate_avg'] = function (block) {
    var argument = Blockly.JavaScript.statementToCode(block, 'avg');
    argument = argument.substring(0, argument.length);
    argument = argument.trim();
    var code = 'avg(';
    if (argument.includes(',')) {
        argument = argument.replace(',', '),');
        code = code.concat(argument);
    }
    else if (argument.includes(', max')) {
        argument = argument.replace(', max', ') max');
        code = code.concat(argument);
    }
    else if (argument.includes(', min')) {
        argument = argument.replace(', min', ') min');
        code = code.concat(argument);
    }
    else if (argument.includes(', max')) {
        argument = argument.replace(', max', ') max');
        code = code.concat(argument);
    }
    else if (argument.includes(', sum')) {
        argument = argument.replace(', sum', ') sum');
        code = code.concat(argument);
    }
    else if (argument.includes(', count')) {
        argument = argument.replace(', count', ') count');
        code = code.concat(argument);
    }
    else {
        code = 'avg(' + argument + ') ';
    }

    var chosenOrderA = '';
    if (this.getInput('listOrder')) {
        chosenOrderA = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('orderA'));
        if (chosenOrderA == 'BLANK') {
            chosenOrderA = '';
        }
        code = code.concat(' ' + chosenOrderA);
    }
    return code;
};

Blockly.JavaScript['aggregate_max'] = function (block) {
    var argument = Blockly.JavaScript.statementToCode(block, 'max');
    argument = argument.substring(0, argument.length);
    argument = argument.trim();
    var code = 'max(';
    if (argument.includes(',')) {
        argument = argument.replace(',', '),');
        code = code.concat(argument);
    }
    else if (argument.includes(', min')) {
        argument = argument.replace(', min', ') min');
        code = code.concat(argument);
    }
    else if (argument.includes(', avg')) {
        argument = argument.replace(', avg', ') avg');
        code = code.concat(argument);
    }
    else if (argument.includes(', max')) {
        argument = argument.replace(', max', ') max');
        code = code.concat(argument);
    }
    else if (argument.includes(', sum')) {
        argument = argument.replace(', sum', ') sum');
        code = code.concat(argument);
    }
    else if (argument.includes(', count')) {
        argument = argument.replace(', count', ') count');
        code = code.concat(argument);
    }
    else {
        code = 'max(' + argument + ') ';
    }

    var chosenOrderA = '';
    if (this.getInput('listOrder')) {
        chosenOrderA = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('orderA'));
        if (chosenOrderA == 'BLANK') {
            chosenOrderA = '';
        }
        code = code.concat(' ' + chosenOrderA);
    }
    return code;
};

Blockly.JavaScript['aggregate_sum'] = function (block) {
    var argument = Blockly.JavaScript.statementToCode(block, 'sum');
    argument = argument.substring(0, argument.length);
    argument = argument.trim();
    var code = 'sum(';
    if (argument.includes(',')) {
        argument = argument.replace(',', '),');
        code = code.concat(argument);
    }
    else if (argument.includes(', max')) {
        argument = argument.replace(', max', ') max');
        code = code.concat(argument);
    }
    else if (argument.includes(', avg')) {
        argument = argument.replace(', avg', ') avg');
        code = code.concat(argument);
    }
    else if (argument.includes(', max')) {
        argument = argument.replace(', max', ') max');
        code = code.concat(argument);
    }
    else if (argument.includes(', min')) {
        argument = argument.replace(', min', ') min');
        code = code.concat(argument);
    }
    else if (argument.includes(', count')) {
        argument = argument.replace(', count', ') count');
        code = code.concat(argument);
    }
    else {
        code = 'sum(' + argument + ') ';
    }

    var chosenOrderA = '';
    if (this.getInput('listOrder')) {
        chosenOrderA = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('orderA'));
        if (chosenOrderA == 'BLANK') {
            chosenOrderA = '';
        }
        code = code.concat(' ' + chosenOrderA);
    }
    return code;
};

Blockly.JavaScript['aggregate_count'] = function (block) {
    var argument = Blockly.JavaScript.statementToCode(block, 'count');
    argument = argument.substring(0, argument.length);
    argument = argument.trim();
    var code = 'count(';
    if (argument.includes(',')) {
        argument = argument.replace(',', '),');
        code = code.concat(argument);
    }
    else if (argument.includes(', max')) {
        argument = argument.replace(', max', ') max');
        code = code.concat(argument);
    }
    else if (argument.includes(', avg')) {
        argument = argument.replace(', avg', ') avg');
        code = code.concat(argument);
    }
    else if (argument.includes(', max')) {
        argument = argument.replace(', max', ') max');
        code = code.concat(argument);
    }
    else if (argument.includes(', sum')) {
        argument = argument.replace(', sum', ') sum');
        code = code.concat(argument);
    }
    else if (argument.includes(', min')) {
        argument = argument.replace(', min', ') min');
        code = code.concat(argument);
    }
    else {
        code = 'count(' + argument + ') ';
    }

    var chosenOrderA = '';
    if (this.getInput('listOrder')) {
        chosenOrderA = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('orderA'));
        if (chosenOrderA == 'BLANK') {
            chosenOrderA = '';
        }
        code = code.concat(' ' + chosenOrderA);
    }
    return code;
};

Blockly.Blocks['allchooser'] = {
    init: function () {
        this.appendDummyInput('allInput')
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("*");
        this.setOutput(true, "ALL");
        this.setColour('#f1bf06');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['allchooser'] = function (block) {
    return '*';
}

Blockly.defineBlocksWithJsonArray([
    {
        "type": "and",
        "message0": "AND %1",
        "args0": [
            {
                "type": "input_value",
                "name": "Con0",
                "check": ["Number", "COMPARE", "NULLIFIER", "INNIFIER", "OR", 'NOT', 'AND', 'BETWEEN']
            }
        ],
        "message1": "    %1",
        "args1": [
            {
                "type": "input_value",
                "name": "sCon0",
                "check": ["Number", "COMPARE", "NULLIFIER", "INNIFIER", "OR", 'NOT', 'AND', 'BETWEEN']
            }
        ],
        "output": "AND",
        "colour": '#5270DE',
        "helpUrl": "",
    },
]);

Blockly.JavaScript['and'] = function (block) {
    var argument0 = Blockly.JavaScript.statementToCode(block, 'Con0');
    var argument1 = Blockly.JavaScript.statementToCode(block, 'sCon0');
    var n = 1;
    var code = argument0 + ' and ' + argument1 + ' ';
    while (block.getInput('Con' + n)) {
        var additionalCode = Blockly.JavaScript.statementToCode(block, 'Con' + n);
        code = code.concat('and ' + additionalCode);
        ++n;
    };
    code = '\u0028' + code + '\u0029';
    return code;
};

Blockly.defineBlocksWithJsonArray([
    {
        "type": "tablename_as",
        "message0": "%1 AS %2",
        "args0": [
            {
                "type": "input_value",
                "name": "as_oldName",
                "check": ["aggregate_min", "aggregate_max", "aggregate_avg", "aggregate_count", "aggregate_sum", "CONDITIONCHOOSER", "freeinput"]
            },
            {
                "type": "input_value",
                "name": "as_newName",
                "check": ["freeinput"]
            }
        ],
        "inputsInline": true,
        "output": 'tablename_as',
        "colour": '#0ddb69',
        "tooltip": "",
        "helpUrl": "",
        'extensions': 'assExtensions'
    },
]);//AS-Modifier
Blockly.Extensions.register('assExtensions', function () {
    this.setOnChange(function (changeEvent) {
        var parent = this.getSurroundParent();
        if (parent != null) {
            if (parent.toDevString().includes('select_from') || parent.toDevString().includes('all_join')) {
                this.getInput('as_oldName').setCheck("TABLE");
            }
            else {
                this.getInput('as_oldName').setCheck(["freeinput", "aggregate_min", "aggregate_max", "aggregate_avg", "aggregate_count", "aggregate_sum", "CONDITIONCHOOSER"]);
            }
        }
    })
});
Blockly.JavaScript['tablename_as'] = function (block) {
    var argumentOld = Blockly.JavaScript.statementToCode(block, 'as_oldName');
    var argumentNew = Blockly.JavaScript.statementToCode(block, 'as_newName');
    var code = argumentOld + ' as ' + argumentNew;
    return code;
};

Blockly.defineBlocksWithJsonArray([
    {
        "type": "between",//AND-BLOCK
        "message0": "    %1",//Text on Block (First Input) --> messages need to be numbereds
        "args0": [
            {
                "type": "input_value",//FirstInput
                "name": "Con0",//name of FirstInput
                "check": ['CONDITIONCHOOSER', 'freeinput']//Acceptance Condition for following Blocks to be combined
            }
        ],
        "message1": "BETWEEN %1",//Text on second Input
        "args1": [
            {
                "type": "input_value",//SecondInput
                "name": "Con1",//name of SecondInput
                "check": ['AND']//Acceptance Condition for following Blocks to be combined
            }
        ],
        "output": "BETWEEN",//Condition of this Block defining, how this Block could be combined to previous Blocks
        "colour": '#5270DE',
        "helpUrl": "",
    },
]);
Blockly.JavaScript['between'] = function (block) {
    var argument0 = Blockly.JavaScript.statementToCode(block, 'Con0');
    var argument1 = Blockly.JavaScript.statementToCode(block, 'Con1');
    var code = argument0 + ' between ' + argument1;
    code = code.replace('(', '');
    code = code.replace(')', '');
    return code;
};

Blockly.defineBlocksWithJsonArray([
    {
        "type": "boolean",
        "message0": "%1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "BOOL",
                "options": [
                    ["true", "TRUE"],
                    ["false", "FALSE"]
                ]
            }
        ],
        "output": "Boolean",
        "colour": '#FC4758',
        "tooltip": "",
        "helpUrl": ""
    },
])

Blockly.JavaScript['boolean'] = function (block) {
    var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
    code = '' + code;
    return code;
};

Blockly.defineBlocksWithJsonArray([
    {
        "type": "compare",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "1ConditionC",
                "check": ["DatePicker", "MATH", "CONDITIONCHOOSER", 'HAVING', 'Boolean', 'Number', 'freeinput', 'aggregate_min', 'aggregate_avg', 'aggregate_max', 'aggregate_sum', 'aggregate_count', 'datepicker'],
            },
            {
                "type": "field_dropdown",
                "name": "OP",
                "options": [
                    ["=", "EQ"],
                    ["\u2260", "NEQ"],
                    ["<", "LT"],
                    ["\u2264", "LTE"],
                    [">", "GT"],
                    ["\u2265", "GTE"],
                    ["LIKE", 'L']
                ]
            },
            {
                "type": "input_value",
                "name": "2ConditionC",
                "check": ["DatePicker", "MATH", "CONDITIONCHOOSER", 'Boolean', 'Number', 'freeinput', 'aggregate_min', 'aggregate_avg', 'aggregate_max', 'aggregate_sum', 'aggregate_count', 'datepicker'],
            }
        ],
        "inputsInline": true,
        "output": "COMPARE",
        "colour": '#3ED9D9',
        "helpUrl": "",
        //"mutator": "compMutator",
    },
    {
        "type": "compareDerived",
        "message0": "%1    %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "1ConditionCD",
                "check": ['aggregate_AVG', 'aggregate_COUNT', 'aggregate_MAX', 'aggregate_MIN', 'aggregate_SUM', 'CONDITIONCHOOSER'],
            },
            {
                "type": "field_dropdown",
                "name": "OP",
                "options": [
                    ["=", "EQ"],
                    ["\u2260", "NEQ"],
                    ["<", "LT"],
                    ["\u2264", "LTE"],
                    [">", "GT"],
                    ["\u2265", "GTE"],
                ]
            },
            {
                "type": "input_value",
                "name": "2ConditionCD",
                "check": ["MATH", "CONDITIONCHOOSER", 'Boolean', 'Number', 'freeinput'],
            },
        ],
        "output": 'DERIVED',
        "colour": 180,
        "helpUrl": "%{BKY_LOGIC_COMPARE_HELPURL}",
        "extensions": ["logic_compare", "logic_op_tooltip"],
    }]);// COMPAREDERIVED-Block for HAVING in Workspace
Blockly.NULLEXTEND = function () {
    this.getField('OP').setValidator(function (option) {
        var compareInput = (option != 'IN' && option != 'INN');
        var isThisIn = '';
        if (option == 'I' || option == 'NI') {
            var isThisIn = 'thisIsIn';
        }
        this.sourceBlock_.updateShape_(compareInput, isThisIn);
    });
};//updating COMPARE-Inputs
Blockly.COMPMUTATOR_MIXIN = {
    //Create XML to represent the number of new value-inputs.
    mutationToDom: function () {
        var container = document.createElement('mutation');
        var compareInput = (this.getFieldValue('OP') != 'IN' && this.getFieldValue('OP') != 'INN');
        container.setAttribute('compare_input', compareInput);
        return container;
    },
    //Parse XML to restore the various value-inputs.
    domToMutation: function (xmlElement) {
        var compareInput = (xmlElement.getAttribute('compare_input') == 'true');
        this.updateShape_(compareInput);
    },
    //Modify this block to have the correct number of inputs.
    updateShape_: function (compareInput, isThisIn) {
        //check wether Input this is
        if (isThisIn == 'thisIsIn') {
            var inputExists = this.getInput('2ConditionC');
            if (!inputExists) {
                this.appendStatementInput('2ConditionC')
                    .setCheck(["SELECT"]);
            }
            else if (inputExists) {
                this.removeInput('2ConditionC');
                this.appendStatementInput('2ConditionC')
                    .setCheck(["SELECT"]);
            }
        }
        else {
            // Add or remove a Value Input.
            this.removeInput('2ConditionC');
            var inputExists = this.getInput('2ConditionC');
            if (compareInput) {
                if (!inputExists) {
                    this.appendValueInput('2ConditionC')
                        .setCheck(["MATH", "CONDITIONCHOOSER", 'Boolean', 'Number', 'freeinput']);
                }
            }
            else if (inputExists) {
                this.removeInput('2ConditionC');
            }
        }
    }
};//Methods for COMPARE-Mutation (now only for NULLIFIER and INNIFIER)
Blockly.Extensions.registerMutator('compMutator', Blockly.COMPMUTATOR_MIXIN, Blockly.NULLEXTEND);//registering Mutator
Blockly.JavaScript['compare'] = function (block) {
    var OPERATORS = {
        'EQ': '=',
        'NEQ': '!=',
        'LT': '<',
        'LTE': '<=',
        'GT': '>',
        'GTE': '>=',
        'IN': 'IS NULL',
        'INN': 'IS NOT NULL',
        'I': 'IN',
        'NI': 'NOT IN',
        'L': 'LIKE'
    };
    var operator = OPERATORS[block.getFieldValue('OP')];
    var argument0 = Blockly.JavaScript.statementToCode(block, '1ConditionC');
    var argument1 = '';
    if (operator != 'IS NULL' && operator != 'IS NOT NULL') {
        argument1 = Blockly.JavaScript.statementToCode(block, '2ConditionC');
        if (operator == 'IN' || operator == 'NOT IN') {
            if (argument1.includes(';')) {
                if (argument1.includes(';SELECT')) {
                    argument1 = argument1.replace(/;SELECT/g, '<BR> union <BR>select');
                }
                argument1 = argument1.replace(';', ' ');
            }
            argument1 = '(' + argument1 + ')';
        }
    }
    var code = argument0 + ' ' + operator + ' ' + argument1;
    return code;
};//CodeGenerator COMPARE

Blockly.Blocks['conditionchooser'] = {
    init: function () {
        this.appendDummyInput('listInput')
            .appendField("     ")
            .appendField(new Blockly.FieldDropdown(fillTables()), "chooseTableC")
            .appendField('.', "dot")
            .appendField(new Blockly.FieldDropdown(fillColumns()), "chooseColumnC")
        this.setInputsInline(true);
        this.setOutput(true, 'CONDITIONCHOOSER');
        this.setColour('#f1bf06');
        this.setTooltip("Dieser Block dient der Auswahl einer Tabelle");
        this.setHelpUrl("");
        this.setOnChange(function (changeEvent) {
            var parent = this.getSurroundParent();
            var selectedTable = this.getFieldValue('chooseTableC');
            console.log("Conditionchooser: table: " + selectedTable);
            var correctColumn = this.getFieldValue('chooseColumnC');
            console.log("Conditionchooser: column: " + correctColumn);
            var doesThoseBothFit = doesMatch(selectedTable, correctColumn);
            if (parent != null && parent.toString().includes('ORDER BY') && (this.getField('orderC') == null)) {
                this.appendDummyInput('listOrder').appendField(" ").appendField(new Blockly.FieldDropdown([["\u2009", "BLANK"], ["ASC", "ASC"], ["DESC", "DESC"]]), "orderC")
            }
            else if ((parent == null || (!(parent.toString().includes('ORDER BY')))) && this.getField('orderC') != null) {
                this.removeInput('listOrder');
            }
            else if (parent != null) {
                if (!doesThoseBothFit) {
                    if (this.getInput('listInput') == null) {
                        this.getInput('dummyInput').removeField('chooseColumnC');
                        this.getInput('dummyInput').appendField(new Blockly.FieldDropdown(fillColumns(selectedTable)), "chooseColumnC");
                    }
                    else {
                        this.getInput('listInput').removeField('chooseColumnC');
                        this.getInput('listInput').appendField(new Blockly.FieldDropdown(fillColumns(selectedTable)), "chooseColumnC");
                    }
                }
            }
        })
    }
};
Blockly.JavaScript['conditionchooser'] = function (block) {
    var chosenTableC = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('chooseTableC'));
    var chosenColumnC = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('chooseColumnC'));
    var chosenOrderC = '';
    if (this.getInput('listOrder')) {
        chosenOrderC = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('orderC'));
        if (chosenOrderC == 'BLANK') {
            chosenOrderC = '';
        }
    }
    var nextInList = Blockly.JavaScript.statementToCode(block, 'listInput');
    if (chosenColumnC == 'all') {
        chosenColumnC = '*';
    }
    var code = chosenTableC + '.' + chosenColumnC + ' ' + chosenOrderC;
    console.info("Conditionchooser: " + code);
    return code;
};

Blockly.Blocks['datepicker'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Year:")
            .appendField(new Blockly.FieldNumber(2018), "date_year");
        this.appendDummyInput()
            .appendField("Month:")
            .appendField(new Blockly.FieldNumber(0, 1, 12), "date_month");
        this.appendDummyInput()
            .appendField("Day:")
            .appendField(new Blockly.FieldNumber(0, 1, 31), "date_day");
        this.appendDummyInput()
            .appendField("Hour:")
            .appendField(new Blockly.FieldNumber(0, 0, 23), "date_time");
        this.setInputsInline(true);
        this.setOutput(true, "DatePicker");
        this.setColour('#FC4758');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};//DATE-Block in Workspace
Blockly.JavaScript['datepicker'] = function (block) {
    // Numeric value and adapted for MySQL
    var year = parseFloat(block.getFieldValue('date_year'));
    var month = parseFloat(block.getFieldValue('date_month'));
    var day = parseFloat(block.getFieldValue('date_day'));
    var time = parseFloat(block.getFieldValue('date_time'));
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if (time < 10) {
        time = '0' + time;
    }
    time = time + '00';
    var code = '\u0022' + year + month + day + time + '\u0022';
    return code;
};

Blockly.Blocks['freeinput'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("\u201C")
            .appendField(new Blockly.FieldTextInput("\u2009"), "textInput")
            .appendField("\u201D")
        this.setOutput(true, "freeinput");
        this.setColour('#FC4758');
        this.setInputsInline(true);
        this.setTooltip("");
        this.setHelpUrl("");
        this.setOnChange(function (changeEvent) {
            var parent = this.getSurroundParent();
            //die folgende Funktion ersetzt den ehem. ASCDESC-Block:
            if (parent != null && parent.toString().includes('ORDER BY') && (this.getField('orderfI') == null)) {
                this.appendDummyInput('listOrder').appendField(" ").appendField(new Blockly.FieldDropdown([["\u2009", "BLANK"], ["ASC", "ASC"], ["DESC", "DESC"]]), "orderfI")
            }
            else if ((parent == null || (!(parent.toString().includes('ORDER BY')))) && this.getField('orderfI') != null) {
                this.removeInput('listOrder');
            }
        })
    }
};
Blockly.JavaScript['freeinput'] = function (block) {
    // Numeric value.
    var code = "\"" + (block.getFieldValue('textInput')) + "\"";
    if (code.match(/create/i) || code.match(/alter/i) || code.match(/index/i) || code.match(/drop/i) || code.match(/show/i) || code.match(/execute/i) || code.match(/insert/i) || code.match(/update/i) || code.match(/delete/i) || code.match(/file/i) || code.match(/grant/i) /*|| code.match(/super/i)*/ || code.match(/process/i) || code.match(/shutdown/i) || code.match(/reload/i) || code.match(/lock/i) || code.match(/replication/i)) {
        code = '';
    }
    if (code.match(/Ä/g)) {
        code = code.replace(/Ä/g, 'Ae');
    }
    if (code.match(/ä/g)) {
        code = code.replace(/ä/g, 'ae');
    }
    if (code.match(/Ö/g)) {
        code = code.replace(/Ö/g, 'Oe');
    }
    if (code.match(/ö/g)) {
        code = code.replace(/ö/g, 'oe');
    }
    if (code.match(/Ü/g)) {
        code = code.replace(/Ü/g, 'Ue');
    }
    if (code.match(/ü/g)) {
        code = code.replace(/ü/g, 'ue');
    }
    var countEscape1 = (code.match(/"/g) || []).length;
    var countEscape2 = (code.match(/'/g) || []).length;
    if (countEscape1 % 2 != 0 || countEscape2 % 2 != 0 || code.includes('\u005C') || code.includes('\u002F')) {
        code = '';
    }

    var chosenOrderfI = '';
    if (this.getInput('listOrder')) {
        chosenOrderfI = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('orderfI'));
        if (chosenOrderfI == 'BLANK') {
            chosenOrderfI = '';
        }
        else {
            code = code + ' ' + chosenOrderfI;
        }
    }

    return code;
};

Blockly.Blocks["select_from"] = {
    init: function () {
        this.appendValueInput('FROM')
            .appendField('FROM                ')
            .setCheck(["TABLE", 'tablename_as'])
        this.setInputsInline(false);
        this.setPreviousStatement(true, ['SELECT']);
        this.setNextStatement(true, ['WHERE', 'GROUP BY', 'FROM']);
        this.setColour('#8007f2');
    }
};
Blockly.JavaScript['select_from'] = function (block) {
    var tables = Blockly.JavaScript.statementToCode(block, 'FROM');
    tables = tables.substring(0, tables.length);
    return 'FROM ' + tables + ';';
}

Blockly.Blocks['select_groupby'] = {
    init: function () {
        this.appendValueInput('groupInput')
            .setCheck(['freeinput', "CONDITIONCHOOSER"])
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField("GROUP BY ");
        this.setPreviousStatement(true, ['WHERE', 'FROM']);
        this.setNextStatement(true, ['GROUP BY', 'HAVING']);
        this.setColour('#8007f2');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['select_groupby'] = function (block) {
    var code = Blockly.JavaScript.statementToCode(block, 'groupInput');
    return 'group by ' + code + ';';
}

Blockly.Blocks['select_having'] = {
    init: function () {
        this.appendValueInput('haveInput')
            .setCheck(["COMPARE"])
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField("HAVING           ");
        this.setPreviousStatement(true, ['HAVING']);
        this.setNextStatement(true, ['HAVING', 'GROUP BY']);
        this.setColour('#8007f2');
        this.setTooltip("");
        this.setHelpUrl("");
        this.setInputsInline(true);
    }
};
Blockly.JavaScript['select_having'] = function (block) {
    var code = Blockly.JavaScript.statementToCode(block, 'haveInput');
    return 'having ' + code + ';';
}

Blockly.defineBlocksWithJsonArray([{
    "type": "innifier",
    "message0": "%1 %2 %3",
    "args0": [
        {
            "type": "input_value",
            "name": "1ConditionC",
            "check": ["MATH", "CONDITIONCHOOSER", 'freeinput'],
        },
        {
            "type": "field_dropdown",
            "name": "OP",
            "options": [
                ["IN", "I"],
                ["NOT IN", "NI"],
            ]
        },
        {
            "type": "input_statement",
            "name": "2ConditionC",
            "check": ["SELECT"],
        },
    ],
    "inputsInline": true,
    "output": "INNIFIER",
    "colour": '#5270DE',
    "helpUrl": "",
}])
Blockly.JavaScript['innifier'] = function (block) {
    var OPERATORS = {
        'I': 'IN',
        'NI': 'NOT IN'
    };
    var operator = OPERATORS[block.getFieldValue('OP')];
    var argument0 = Blockly.JavaScript.statementToCode(block, '1ConditionC');
    var argument1 = Blockly.JavaScript.statementToCode(block, '2ConditionC');
    if (operator == 'IN' || operator == 'NOT IN') {
        if (argument1.includes(';')) {
            if (argument1.includes(';SELECT')) {
                argument1 = argument1.replace(/;SELECT/g, '<BR> union <BR>select');
            }
            argument1 = argument1.replace(/;/g, ' ');
        }
        argument1 = '(' + argument1 + ')';
    }
    var code = argument0 + ' ' + operator + ' ' + argument1;
    return code;
};

Blockly.Blocks['all_join'] = {
    init: function () {
        this.appendValueInput("STATEMENT")
            .appendField(new Blockly.FieldDropdown([['\u2009', 'BLANKJ'], ['INNER', 'INNER'], ['LEFT', 'LEFT'], ['RIGHT', 'RIGHT']]), "chooseTableType")
            .appendField('JOIN')
            .appendField(new Blockly.FieldDropdown(fillTables()), "chooseTableJoin2")
            .setCheck("COMPARE")
            .appendField(new Blockly.FieldDropdown([['ON', 'onModifier'], ['\u2009', 'Blank']]), "modifierActive");
        this.setOutput(true, ["INNER_JOIN"]);
        this.setColour('#8007f2');
        this.setTooltip("");
        this.setHelpUrl("");
        this.setOnChange(function (changeEvent) {
            if (this.getInput("STATEMENT") == null) {
                if (this.getFieldValue('modifierActive') != 'Blank') {
                    this.removeInput("noSTATEMENT");
                    this.appendValueInput("STATEMENT")
                        //.appendField(new Blockly.FieldDropdown(fillTables(document.getElementById('database').innerHTML)), "chooseTableJoin1")
                        .appendField(new Blockly.FieldDropdown([['\u2009', 'BLANKJ'], ['INNER', 'INNER'], ['LEFT', 'LEFT'], ['RIGHT', 'RIGHT']]), "chooseTableType")
                        .appendField('JOIN')
                        .appendField(new Blockly.FieldDropdown(fillTables()), "chooseTableJoin2")
                        .setCheck("COMPARE")
                        .appendField(new Blockly.FieldDropdown([['ON', 'onModifier'], ['\u2009', 'Blank']]), "modifierActive");
                }
            }
            else {
                if (this.getFieldValue('modifierActive') == 'Blank') {
                    this.removeInput("STATEMENT");
                    this.appendValueInput("noSTATEMENT")
                        .appendField(new Blockly.FieldDropdown([['\u2009', 'BLANKJ'], ['INNER', 'INNER'], ['LEFT', 'LEFT'], ['RIGHT', 'RIGHT']]), "chooseTableType")
                        .appendField('JOIN')
                        .setCheck("tablename_as")
                        .appendField(new Blockly.FieldDropdown([['\u2009', 'Blank'], ['ON', 'onModifier']]), "modifierActive");
                }
            }
        });
    }
};
Blockly.JavaScript['all_join'] = function (block) {
    var type = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('chooseTableType'));
    if (type == 'BLANKJ') {
        type = '';
    }
    var join = '';
    var isModifierActive = '';
    var statement = '';
    var nostatement = '';
    if (this.getInput('STATEMENT') != null) {
        join = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('chooseTableJoin2'));
        statement = Blockly.JavaScript.statementToCode(block, 'STATEMENT');
    }
    else {
        nostatement = Blockly.JavaScript.statementToCode(block, 'noSTATEMENT');
    }
    var code = /*table + ' ' + */type + ' join' + ' ';
    if (this.getFieldValue('modifierActive') == 'onModifier') {
        if (statement == '') {
            code = code.concat('' + join + ' ' + 'on' + ' ');
        }
        else {
            code = code.concat('' + join + ' ' + 'on' + statement + ' ');
        }
    }
    else {
        if (nostatement == '') {
            code = code.concat('' + join + ' ');
        }
        else {
            code = code.concat('' + join + ' ' + nostatement + ' ');
        }
    }
    return code;
};

Blockly.Blocks['select_limit'] = {
    init: function () {
        this.appendDummyInput('limitInput')
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField("LIMIT           ")
            .appendField(new Blockly.FieldNumber(0, 0), "numberInput");
        this.setPreviousStatement(true, ['WHERE', 'FROM', 'ORDER BY', 'HAVING']);
        this.setNextStatement(false, ['ORDER BY', 'LIMIT']);
        this.setColour('#8007f2');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['select_limit'] = function (block) {
    var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('numberInput'));
    code = code.replace(/my_/g, '');
    return 'limit ' + code + ';';
}

Blockly.Blocks['math'] = {
    init: function () {
        this.appendValueInput("1ConditionM")
            .setCheck(["freeinput", "CONDITIONCHOOSER", "Number", 'MATH'])
            .setAlign(Blockly.ALIGN_CENTRE);
        this.appendValueInput("2ConditionM")
            .setCheck(["freeinput", "CONDITIONCHOOSER", "Number", 'MATH'])
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField(new Blockly.FieldDropdown([["\u002B", "plus"], ["\u002D", "minus"], ["\u00D7", "mul"], ["\u00F7", "div"]]), "mathemator");
        this.setInputsInline(true);
        this.setOutput(true, ["MATH"]);
        this.setColour('#5BE5E5');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['math'] = function (block) {
    var OPERATORS = {
        'plus': '\u002B',
        'minus': '\u002D',
        'mul': "*",
        'div': "/",
    };
    var operator = OPERATORS[block.getFieldValue('mathemator')];
    var argument0 = Blockly.JavaScript.statementToCode(block, '1ConditionM');
    argument0 = argument0.trim();
    var argument1 = Blockly.JavaScript.statementToCode(block, '2ConditionM');
    var code = '(' + argument0 + ' ' + operator + ' ' + argument1 + ')';
    return code;
};

Blockly.defineBlocksWithJsonArray([
    {
        "type": "not",//NOT-BLOCK
        "message0": "NOT %1",//Text on Block (First Input) --> messages need to be numbereds
        "args0": [
            {
                "type": "input_value",//FirstInput
                "name": "Con0",//name of FirstInput
                "check": ["OR", "AND", 'COMPARE', 'BETWEEN']//Acceptance Condition for following Blocks to be combined
            }
        ],
        "output": "NOT",//Condition of this Block defining, how this Block could be combined to previous Blocks
        "colour": '#5270DE',
        "helpUrl": "",
    },
]);// NOT-Block in Workspace
Blockly.JavaScript['not'] = function (block) {
    var code = 'not ' + Blockly.JavaScript.statementToCode(block, 'Con0');
    return code;
};//CodeGenerator NOT

Blockly.defineBlocksWithJsonArray([{
    "type": "nullifier",
    "message0": " %1 IS %2 NULL %3",
    "args0": [
        {
            "type": "input_value",
            "name": "1ConditionC",
            "check": ["MATH", "CONDITIONCHOOSER", 'freeinput'],
        },
        {
            "type": "field_dropdown",
            "name": "OP",
            "options": [
                ["\u2009", "IN"],
                ["NOT", "INN"],
            ]
        },
        {
            "type": "input_dummy",
            "name": "secConditionC",
        }
    ],
    "inputsInline": true,
    "output": "NULLIFIER",
    "colour": '#3ED9D9',
    "helpUrl": "%{BKY_LOGIC_COMPARE_HELPURL}",
    "extensions": ["logic_compare", "logic_op_tooltip"],
    "mutator": "compMutator",
}])
Blockly.JavaScript['nullifier'] = function (block) {
    var OPERATORS = {
        'EQ': '=',
        'NEQ': '!=',
        'LT': '<',
        'LTE': '<=',
        'GT': '>',
        'GTE': '>=',
        'IN': 'IS NULL',
        'INN': 'IS NOT NULL',
        'I': 'IN',
        'NI': 'NOT IN'
    };
    var operator = OPERATORS[block.getFieldValue('OP')];
    var argument0 = Blockly.JavaScript.statementToCode(block, '1ConditionC');
    var argument1 = '';
    if (operator != 'IS NULL' && operator != 'IS NOT NULL') {
        argument1 = Blockly.JavaScript.statementToCode(block, '2ConditionC');
        if (operator == 'IN' || operator == 'NOT IN') {
            if (argument1.includes(';')) {
                if (argument1.includes(';SELECT')) {
                    argument1 = argument1.replace(/;SELECT/g, '<BR> UNION <BR>SELECT');
                }
                argument1 = argument1.replace(';', ' ');
            }
            argument1 = '(' + argument1 + ')';
        }
    }
    var code = argument0 + ' ' + operator + ' ' + argument1;
    return code;
};

Blockly.defineBlocksWithJsonArray([
    {
        "type": "number",
        "message0": "%1",
        "args0": [{
            "type": "field_number",
            "name": "NUM",
            "value": 0
        }],
        "output": "Number",
        "colour": '#FC4758',
        "helpUrl": "%{BKY_MATH_NUMBER_HELPURL}",
        "tooltip": "%{BKY_MATH_NUMBER_TOOLTIP}",
        "extensions": ["parent_tooltip_when_inline"]
    },
])// NUMBER-Block in Workspace
Blockly.JavaScript['number'] = function (block) {
    // Numeric value.
    var code = parseFloat(block.getFieldValue('NUM'));
    code = '' + code;
    return code;
};

Blockly.defineBlocksWithJsonArray([
    {
        "type": "or",//AND-BLOCK
        "message0": "OR %1",//Text on Block (First Input) --> messages need to be numbereds
        "args0": [
            {
                "type": "input_value",//FirstInput
                "name": "Con0",//name of FirstInput
                "check": ["COMPARE", "NULLIFIER", "INNIFIER", "AND", 'NOT', 'OR', 'BETWEEN']//Acceptance Condition for following Blocks to be combined
            }
        ],
        "message1": "    %1",//Text on second Input
        "args1": [
            {
                "type": "input_value",//SecondInput
                "name": "sCon0",//name of SecondInput
                "check": ["COMPARE", "NULLIFIER", "INNIFIER", "AND", 'NOT', 'OR', 'BETWEEN']//Acceptance Condition for following Blocks to be combined
            }
        ],
        "output": "OR",//Condition of this Block defining, how this Block could be combined to previous Blocks
        "colour": '#5270DE',
        "helpUrl": "",
        //discarded: 18.09.2017 "mutator": "orMutator",//name of the Mutator (necessary for merging Mutator_Mixin into this Block)
    },
]);// OR-Block in Workspace
Blockly.JavaScript['or'] = function (block) {
    var argument0 = Blockly.JavaScript.statementToCode(block, 'Con0');
    var argument1 = Blockly.JavaScript.statementToCode(block, 'sCon0');
    var n = 1;
    var code = argument0 + ' or ' + argument1 + ' ';
    while (block.getInput('Con' + n)) {
        var additionalCode = Blockly.JavaScript.statementToCode(block, 'Con' + n);
        code = code.concat('OR ' + additionalCode);
        ++n;
    };
    code = '\u0028' + code + '\u0029';
    return code;
};//CodeGenerator OR

Blockly.Blocks['select_orderby'] = {
    init: function () {
        this.appendValueInput('orderInput')
            .setCheck(["CONDITIONCHOOSER", 'aggregate_min', 'aggregate_avg', 'aggregate_max', 'aggregate_sum', 'aggregate_count', 'freeinput'])
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField("ORDER BY        ");
        this.setPreviousStatement(true, ['GROUP BY', 'FROM']);
        this.setNextStatement(true, ['ORDER BY']);
        this.setColour('#8007f2');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['select_orderby'] = function (block) {
    var code = Blockly.JavaScript.statementToCode(block, 'orderInput');
    var i = 1;
    var countAdditionalOBs = 1;
    while (this.getInput('OB' + countAdditionalOBs)) {
        countAdditionalOBs++;
    }
    while (i <= countAdditionalOBs) {
        code = code.concat(Blockly.JavaScript.statementToCode(block, 'OB' + i));
        i++;
    }
    code = code.replace(/blank/g, ',');
    code = code.replace(/SC/g, 'SC,');
    code = 'order by ' + code + ';'
    code = code.replace(',;', ';');
    return code;
}

Blockly.Blocks['select'] = {
    init: function () {
        this.appendValueInput('SELECT')
            .appendField('SELECT   ')
            .setCheck(['freeinput', "tablename_as", "ALL", "CONDITIONCHOOSER", "aggregate_min", "aggregate_max", "aggregate_avg", "aggregate_sum", "aggregate_count"])
            .appendField(new Blockly.FieldDropdown([["\u2009", 'blank'], ["ALL", 'all'], ["DISTINCT", 'distinct']]), 'option')
        this.setInputsInline(false);
        this.setPreviousStatement(true, ['SELECT', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'FROM']);
        this.setNextStatement(true, ['SELECT']);
        this.setColour('#8007f2');

    }
};

Blockly.JavaScript['select'] = function (block) {
    var select = Blockly.JavaScript.statementToCode(block, 'SELECT');

    if (!select.includes(' *')) {
        select = select.substring(0, select.length - 1);
    }
    else if (select.includes(' * ')) {
        select = select.substring(0, select.length - 1);
    }
    if (select.includes("AS")) {
        select = select + '"';
        select = select.replace(/'/g, '"');
    }
    else if (select.includes("'" || '"') && select.includes("'," || '",')) {
        select = select + '"';
        select = select.replace(/'/g, '"');
    }

    var option = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('option'));
    if (option == 'blank' || option == 'all') {
        option = 'SELECT  ';
    }
    else {
        option = 'SELECT DISTINCT ';
    }

    var code = option + select;

    code = code.concat(';');
    return code;
};

Blockly.Blocks['table'] = {
    init: function () {
        this.appendDummyInput('previousTables')
            .appendField('     ')
            .appendField(new Blockly.FieldDropdown(fillTables()), "chooseTableT")
        this.setOutput(true, 'TABLE');
        this.setColour('#f1bf06');
        this.setTooltip("Dieser Block dient der Auswahl einer Tabelle");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['table'] = function (block) {
    var chosenTableT = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('chooseTableT'));
    console.log("Table sqlCode: ", code)
    var code = chosenTableT;
    return code;
};

Blockly.Blocks['select_where'] = {
    init: function () {
        this.appendValueInput('whereInput')
            .setCheck(['BETWEEN', 'AND', 'OR', 'COMPARE', 'NULLIFIER', 'INNIFIER', 'NOT', 'freeinput'])
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField("WHERE                 ");
        this.setPreviousStatement(true, ['FROM']);
        this.setNextStatement(true, ['WHERE', 'GROUP BY']);
        this.setColour('#8007f2');
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['select_where'] = function (block) {
    var code = Blockly.JavaScript.statementToCode(block, 'whereInput');
    return 'where ' + code + ';';
}

export default Blockly;