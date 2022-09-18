import { initializeBlockies } from './setupBlockly';
import { getElementByXpath } from './helper';

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
});


onload = function () {
  console.log("Hello from Dune Oasis.");
  const loadingInterval = setInterval(() => {
    const editorWindow: Node | null = getElementByXpath("/html/body/div/div/main/div/section/div/div[1]/section[1]");
    if (editorWindow) {
      clearInterval(loadingInterval);
      const $editorWindow: HTMLElement = editorWindow as HTMLElement;
      console.log($editorWindow)

      const parentOfEditor = $editorWindow.parentElement;

      const $blocklyDiv = document.createElement("div");
      $blocklyDiv.id = "blocklyDiv";
      $blocklyDiv.style.width = "100%";
      console.log("editorVeiwHeights:" + $editorWindow.clientHeight);
      $blocklyDiv.style.height = $editorWindow.clientHeight + "px";
      $blocklyDiv.style.display = "block";
      $blocklyDiv.style.border = "red solid 1px";
      parentOfEditor?.insertAdjacentElement("afterbegin", $blocklyDiv);

      $editorWindow.style.display = "none";

      initializeBlockies($blocklyDiv);
    }
  }, 300)
}