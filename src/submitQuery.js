var sqlCode = document.getElementById("sqlCode").value.replaceAll('ethereum_', 'ethereum.')
console.log("sqlCode submitQuery:", sqlCode)


var allAceEditors = document.querySelectorAll(".ace_editor");
var firstAceEditor = allAceEditors[0];
if (firstAceEditor.env && firstAceEditor.env.editor) {
    console.log(firstAceEditor.env.editor)
    firstAceEditor.env.editor.setValue(sqlCode);
} else {
    console.log("can't get editor from", all[i])
}