// import * as Blockly from "blockly";
// import 'blockly/blocks';
// import 'blockly/javascript';
// import * as en froPm 'blockly/msg/en';
// Blockly.setLocale(en);
// @ts-ignore
import Blockly from './blockly/sql_blocks/all_blocks';
import toolbox from './blockly/toolbox';




function initializeBlockies(editorWindow: HTMLElement) {
    console.log("initializeBlockies");

    console.log(Blockly)
    // @ts-ignore
    let workspace = Blockly.inject(editorWindow, { toolbox: toolbox })

    console.log("Injected blockly");
}

export { initializeBlockies };