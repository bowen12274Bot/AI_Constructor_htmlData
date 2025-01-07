export function createParameterBlock(
  workspace,
  x = 450,
  y = 450,
  textContent = ""
) {
  const svgNS = "http://www.w3.org/2000/svg";

  // 創建主 g 元素
  const block = document.createElementNS(svgNS, "g");
  block.setAttribute("id", "parameterBlock");
  block.classList.add("block");
  block.setAttribute("transform", `translate(${x}, ${y})`);

  // 創建 path 元素
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("fill", "#E3A855");
  path.setAttribute("fill-rule", "evenodd");
  path.setAttribute(
    "d",
    "M32.25 0a5 5 0 0 0-5 5v14.73L9.337 13.389A7.055 7.055 0 0 0 7.512 13H6.469C2.976 13.265 0 16.173 0 19.986v20.028c0 3.813 2.976 6.72 6.47 6.986h1.042a7.055 7.055 0 0 0 1.825-.388L27.25 40.27V55a5 5 0 0 0 5 5h190a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5h-190Z"
  );
  path.setAttribute("clip-rule", "evenodd");
  block.appendChild(path);

  // 創建 snap-left circle
  const snapLeft = document.createElementNS(svgNS, "circle");
  snapLeft.setAttribute("cx", "-2");
  snapLeft.setAttribute("cy", "30");
  snapLeft.setAttribute("r", "3");
  snapLeft.setAttribute("fill", "transparent");
  snapLeft.classList.add("snap-left");
  block.appendChild(snapLeft);

  // 創建 editable-group g 元素
  const editableGroup = document.createElementNS(svgNS, "g");
  editableGroup.classList.add("editable-group");
  editableGroup.setAttribute("transform", "translate(65,10)");

  // 創建 rect
  const rect = document.createElementNS(svgNS, "rect");
  rect.setAttribute("x", "0");
  rect.setAttribute("y", "0");
  rect.setAttribute("width", "120");
  rect.setAttribute("height", "40");
  editableGroup.appendChild(rect);

  // 創建 text
  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", "18");
  text.setAttribute("y", "26");
  text.setAttribute("font-size", "16");
  text.setAttribute("fill", "black");
  text.textContent = textContent; // 動態設置文字內容
  editableGroup.appendChild(text);

  block.appendChild(editableGroup);

  // 添加到工作區
  workspace.appendChild(block);
}

export function createSetVariableBlock(
  workspace,
  x = 50,
  y = 450,
  textContent = "設定變數"
) {
  const svgNS = "http://www.w3.org/2000/svg";

  // 創建主 g 元素
  const block = document.createElementNS(svgNS, "g");
  block.setAttribute("id", "setVariableBlock");
  block.classList.add("block");
  block.setAttribute("transform", `translate(${x}, ${y})`);

  // 創建 path 元素
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("fill", "#E3A855");
  path.setAttribute("fill-rule", "evenodd");
  path.setAttribute(
    "d",
    "M20 0h323a5 5 0 0 1 5 5v14.73l-17.913-6.342c-4.556-1.614-9.337 1.765-9.337 6.598v20.028c0 4.833 4.781 8.212 9.337 6.598L348 40.27V55a5 5 0 0 1-5 5H20C8.954 60 0 51.046 0 40V20C0 8.954 8.954 0 20 0Z"
  );
  path.setAttribute("clip-rule", "evenodd");
  block.appendChild(path);

  // 創建 snap-right circle
  const snapRight = document.createElementNS(svgNS, "circle");
  snapRight.setAttribute("cx", "320");
  snapRight.setAttribute("cy", "30");
  snapRight.setAttribute("r", "3");
  snapRight.setAttribute("fill", "transparent");
  snapRight.classList.add("snap-right");
  block.appendChild(snapRight);

  // 創建 text
  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", "150");
  text.setAttribute("y", "35");
  text.setAttribute("fill", "black");
  text.setAttribute("font-size", "18");
  text.setAttribute("text-anchor", "middle");
  text.textContent = textContent; // 動態設置文字內容
  block.appendChild(text);

  // 添加到工作區
  workspace.appendChild(block);
}

export function createDataBlock(
  workspace,
  x = 50,
  y = 300,
  textContent = "設定變數為"
) {
  const svgNS = "http://www.w3.org/2000/svg";

  // 創建主 g 元素
  const block = document.createElementNS(svgNS, "g");
  block.setAttribute("id", "dataBlock");
  block.classList.add("block");
  block.setAttribute("data-affects-height", "true");
  block.setAttribute("transform", `translate(${x}, ${y})`);

  // 創建 path 元素
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("fill", "#E3A855");
  path.setAttribute("fill-rule", "evenodd");
  path.setAttribute(
    "d",
    "M343 60a5 5 0 0 0 5-5V40.27l-17.913 6.342c-4.556 1.614-9.337-1.765-9.337-6.598V19.986c0-4.833 4.781-8.212 9.337-6.598L348 19.73V5a5 5 0 0 0-5-5H88.83c-1.755 0-3.35.947-4.42 2.337C80.77 7.061 75.66 10 70 10S59.229 7.06 55.59 2.337C54.52.947 52.925 0 51.17 0H20C8.954 0 0 8.954 0 20v20c0 11.046 8.954 20 20 20h31.171c1.755 0 3.35.947 4.42 2.337 3.64 4.724 8.75 7.663 14.41 7.663s10.772-2.94 14.41-7.663c1.071-1.39 2.666-2.337 4.42-2.337H343Z"
  );
  path.setAttribute("clip-rule", "evenodd");
  block.appendChild(path);

  // 創建 snap-top circle
  const snapTop = document.createElementNS(svgNS, "circle");
  snapTop.setAttribute("cx", "70");
  snapTop.setAttribute("cy", "10");
  snapTop.setAttribute("r", "3");
  snapTop.setAttribute("fill", "transparent");
  snapTop.classList.add("snap-top");
  block.appendChild(snapTop);

  // 創建 snap-bottom circle
  const snapBottom = document.createElementNS(svgNS, "circle");
  snapBottom.setAttribute("cx", "70");
  snapBottom.setAttribute("cy", "70");
  snapBottom.setAttribute("r", "3");
  snapBottom.setAttribute("fill", "transparent");
  snapBottom.classList.add("snap-bottom");
  block.appendChild(snapBottom);

  // 創建 snap-right circle
  const snapRight = document.createElementNS(svgNS, "circle");
  snapRight.setAttribute("cx", "320");
  snapRight.setAttribute("cy", "30");
  snapRight.setAttribute("r", "3");
  snapRight.setAttribute("fill", "transparent");
  snapRight.classList.add("snap-right");
  block.appendChild(snapRight);

  // 創建 text
  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", "150");
  text.setAttribute("y", "35");
  text.setAttribute("fill", "black");
  text.setAttribute("font-size", "18");
  text.setAttribute("text-anchor", "middle");
  text.textContent = textContent; // 動態設置文字內容
  block.appendChild(text);

  // 添加到工作區
  workspace.appendChild(block);
}

export function createMainBlock(
  workspace,
  x = 50,
  y = 50,
  textContent = "輸出運算結果"
) {
  const svgNS = "http://www.w3.org/2000/svg";

  // 創建主 g 元素
  const block = document.createElementNS(svgNS, "g");
  block.setAttribute("id", "mainBlock");
  block.classList.add("block");
  block.setAttribute("data-adjustable-height", "true");
  block.setAttribute("transform", `translate(${x}, ${y})`);

  // 創建 path 元素
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("fill", "#E3C83F");
  path.setAttribute("fill-rule", "evenodd");
  path.setAttribute(
    "d",
    "M10 0h280c5.523 0 10 4.477 10 10v45a5 5 0 0 1-5 5H156.001c-3.648 6.072-9.458 10-16.001 10-6.543 0-12.353-3.928-16.001-10H90c-10.71 0-19.454 8.419-19.975 19H70v22h.025c.52 10.581 9.265 19 19.975 19h205a5 5 0 0 1 5 5v15c0 5.523-4.477 10-10 10H10c-5.523 0-10-4.477-10-10V10C0 4.477 4.477 0 10 0Z"
  );
  path.setAttribute("clip-rule", "evenodd");
  block.appendChild(path);

  // 創建 snap-bottom circle
  const snapBottom = document.createElementNS(svgNS, "circle");
  snapBottom.setAttribute("cx", "140");
  snapBottom.setAttribute("cy", "68");
  snapBottom.setAttribute("r", "3");
  snapBottom.setAttribute("fill", "transparent");
  snapBottom.classList.add("snap-bottom");
  block.appendChild(snapBottom);

  // 創建 text
  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", "150");
  text.setAttribute("y", "35");
  text.setAttribute("fill", "white");
  text.setAttribute("font-size", "18");
  text.setAttribute("text-anchor", "middle");
  text.textContent = textContent; // 動態設置文字內容
  block.appendChild(text);

  // 添加到工作區
  workspace.appendChild(block);
}

// 暴露到主程式
window.createMainBlock = createMainBlock;
window.createDataBlock = createDataBlock;
window.createSetVariableBlock = createSetVariableBlock;
window.createParameterBlock = createParameterBlock;
