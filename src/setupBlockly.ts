// import * as Blockly from "blockly";
// import 'blockly/blocks';
// import 'blockly/javascript';
// import * as en froPm 'blockly/msg/en';
// Blockly.setLocale(en);
// @ts-ignore
import Blockly from './blockly/sql_blocks/all_blocks';
import toolbox from './blockly/toolbox';

var workspace: any;

function showCode() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    if (workspace == null) {
        console.warn("Workspace is null");
        return
    }
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    if (code.includes('SELECT') && !code.includes('Dieser Code enthält ggf. schädliche Schlüsselwörter!')) {
        if (code.includes(';SELECT')) {
            code = code.substring(0, code.length - 1)
            code = code.replace(/;SELECT/g, '<BR>UNION <BR>SELECT');
            code = code.concat(';');
        }
        if (code.includes(';FROM')) {
            code = code.replace(/;FROM/g, '<BR> FROM');
            code = code.concat(';');
        }
        if (code.includes(';WHERE')) {
            code = code.replace(/;WHERE/g, '<BR> WHERE');
            code = code.concat(';');
        }
        if (code.includes(';GROUP BY')) {
            code = code.replace(/;GROUP BY/g, '<BR> GROUP BY');
            code = code.concat(';');
        }
        if (code.includes(';HAVING')) {
            code = code.replace(/;HAVING/g, '<BR> HAVING');
            code = code.concat(';');
        }
        if (code.includes(';ORDER BY')) {
            code = code.replace(/;ORDER BY/g, '<BR> ORDER BY');
            code = code.concat(';');
        }
        if (code.includes(';LIMIT')) {
            code = code.replace(/;LIMIT/g, '<BR> LIMIT');
            code = code.concat(';');
        }
        var cutFirstPart = code.substring(code.search('SELECT'));
        code = cutFirstPart.substring(0, cutFirstPart.search('\u003B') + 1);
        code = code.replace(/   /g, ' ');

    }
    return code;
}

function initializeBlockies(editorWindow: HTMLElement) {
    console.log("initializeBlockies");

    console.log(Blockly)
    // @ts-ignore
    workspace = Blockly.inject(editorWindow, { toolbox: toolbox })

    console.log("Injected blockly");

    workspace.addChangeListener(function (event: any) {
        var code = showCode();
        console.log(code);

        var $inpt = document.createElement("input")
        $inpt.setAttribute("type", "hidden")
        $inpt.setAttribute("id", "sqlCode")
        $inpt.setAttribute("value", code)

        document.body.insertAdjacentElement("beforeend", $inpt)
        // Inject script to replace editor with right value.
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('js/submitQuery.js');
        s.onload = function () {
            // @ts-ignore
            this.remove();
            document.getElementById("sqlCode")?.remove();
        };
        (document.head || document.documentElement).appendChild(s);
    })
}

export { initializeBlockies };