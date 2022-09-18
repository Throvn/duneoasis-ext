function getElementByXpath(path: string): Node | null {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

console.log(getElementByXpath("/html/body/div/div/main/div/section/div/div[1]/section[1]"));

export { getElementByXpath };