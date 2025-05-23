const workspace = document.getElementById("workspace");
let isDragging = false;
let draggedElement = null;
let ghostElement = null;
let offsetX = 0;
let offsetY = 0;
let targetParent = null;
import {
  createParameterBlock,
  createSetVariableBlock,
  createDataBlock,
  createMainBlock,
} from "./blocks.js";

// 開始拖曳
const startDrag = (event, block) => {
  isDragging = true;
  draggedElement = block;

  // 獲取積木的絕對位置
  const position = getAbsolutePosition(block);
  const point = getTouchPosition(event);

  offsetX = point.x - position.x;
  offsetY = point.y - position.y;

  // 複製一個半透明的積木
  ghostElement = block.cloneNode(true);
  ghostElement.classList.add("ghost");
  workspace.appendChild(ghostElement);

  updatePosition(ghostElement, position.x, position.y);

  // 移除原積木
  block.remove();
};

// 拖曳過程
const drag = (event) => {
  if (!isDragging || !ghostElement) return;

  const point = getTouchPosition(event);
  updatePosition(ghostElement, point.x - offsetX, point.y - offsetY);

  // 嘗試找到最近的積木作為 targetParent
  document.querySelectorAll(".block").forEach((block) => {
    if (block !== ghostElement) {
      const snapOffset = trySnapToBlock(block, ghostElement);
      if (snapOffset) {
        targetParent = block; // 更新目標父積木
      }
    }
  });
};

// 結束拖曳
const endDrag = () => {
  if (!isDragging || !ghostElement) return;

  if (targetParent) {
    // 檢查是否存在循環嵌套
    if (!draggedElement.contains(targetParent)) {
      const snapOffset = trySnapToBlock(targetParent, ghostElement);
      if (snapOffset) {
        targetParent.appendChild(draggedElement);
        draggedElement.setAttribute("transform", "translate(0, 0)");

        // 對準吸附位置
        const draggedSnapPoints = getSnapPoints(draggedElement);
        const targetSnapPoints = getSnapPoints(targetParent);
        let draggedOffset = null;
        let targetOffset = null;

        if (draggedSnapPoints.left && targetSnapPoints.right) {
          draggedOffset = draggedSnapPoints.left;
          targetOffset = targetSnapPoints.right;
        }
        if (draggedSnapPoints.top && targetSnapPoints.bottom) {
          draggedOffset = draggedSnapPoints.top;
          targetOffset = targetSnapPoints.bottom;
        }
        const snapOffset = {
          dx: targetOffset.x - draggedOffset.x,
          dy: targetOffset.y - draggedOffset.y,
        };

        draggedElement.setAttribute(
          "transform",
          `translate(${snapOffset.dx}, ${snapOffset.dy})`
        );
      } else {
        workspace.appendChild(draggedElement);
        const transform = ghostElement.getAttribute("transform");
        draggedElement.setAttribute("transform", transform);
      }
    } else {
      console.error("無法將元素嵌套到自身的子節點中！");
    }
  } else {
    workspace.appendChild(draggedElement);
    const transform = ghostElement.getAttribute("transform");
    draggedElement.setAttribute("transform", transform);
  }

  updatePathHeight(targetParent);
  updateAllParentHeights(targetParent);
  // 清除幽靈積木
  ghostElement.remove();
  ghostElement = null;
  draggedElement = null;
  isDragging = false;
  targetParent = null;
};

// 獲取觸控座標
const getTouchPosition = (event) => {
  const touch = event.touches[0] || event.changedTouches[0];
  const point = workspace.createSVGPoint();
  point.x = touch.clientX;
  point.y = touch.clientY;
  return point.matrixTransform(workspace.getScreenCTM().inverse());
};

// 計算積木在工作區的絕對位置
const getAbsolutePosition = (element) => {
  let x = 0;
  let y = 0;
  let currentElement = element;

  while (currentElement) {
    // 確保 currentElement 是一個 SVG 或 g 元素
    if (currentElement instanceof SVGElement) {
      const transform = currentElement.getAttribute("transform");
      if (transform) {
        const [offsetX, offsetY] = transform
          .match(/translate\(([^,]+), ([^)]+)\)/)
          .slice(1)
          .map(Number);
        x += offsetX;
        y += offsetY;
      }
    }
    // 繼續遍歷父元素
    currentElement = currentElement.parentNode;
  }
  return { x, y };
};

// 更新積木位置
const updatePosition = (element, x, y) => {
  element.setAttribute("transform", `translate(${x}, ${y})`);
};

// 計算吸附點
const getSnapPoints = (block) => {
  const snapPoints = { top: null, bottom: null, left: null, right: null };

  // 計算多層嵌套的全局偏移量
  let totalTransform = { e: 0, f: 0 };
  let currentBlock = block;

  while (currentBlock) {
    const transform = currentBlock.transform?.baseVal?.consolidate()?.matrix;
    if (transform) {
      totalTransform.e += transform.e;
      totalTransform.f += transform.f;
    }
    currentBlock =
      currentBlock.parentNode instanceof SVGGElement
        ? currentBlock.parentNode
        : null;
  }

  // 獲取吸附點
  const topCircle = block.querySelector(".snap-top");
  const bottomCircle = block.querySelector(".snap-bottom");
  const leftCircle = block.querySelector(".snap-left");
  const rightCircle = block.querySelector(".snap-right");

  if (topCircle) {
    const cx = parseFloat(topCircle.getAttribute("cx")) || 0;
    const cy = parseFloat(topCircle.getAttribute("cy")) || 0;
    snapPoints.top = { x: cx + totalTransform.e, y: cy + totalTransform.f };
  }

  if (bottomCircle) {
    const cx = parseFloat(bottomCircle.getAttribute("cx")) || 0;
    const cy = parseFloat(bottomCircle.getAttribute("cy")) || 0;
    snapPoints.bottom = { x: cx + totalTransform.e, y: cy + totalTransform.f };
  }

  if (leftCircle) {
    const cx = parseFloat(leftCircle.getAttribute("cx")) || 0;
    const cy = parseFloat(leftCircle.getAttribute("cy")) || 0;
    snapPoints.left = { x: cx + totalTransform.e, y: cy + totalTransform.f };
  }

  if (rightCircle) {
    const cx = parseFloat(rightCircle.getAttribute("cx")) || 0;
    const cy = parseFloat(rightCircle.getAttribute("cy")) || 0;
    snapPoints.right = { x: cx + totalTransform.e, y: cy + totalTransform.f };
  }

  return snapPoints;
};

// 計算吸附範圍
const trySnapToBlock = (draggedElement, targetParent) => {
  const draggedPoints = getSnapPoints(draggedElement);
  const targetPoints = getSnapPoints(targetParent);

  if (draggedPoints.bottom && targetPoints.top) {
    const dx = targetPoints.top.x - draggedPoints.bottom.x;
    const dy = targetPoints.top.y - draggedPoints.bottom.y;

    if (Math.sqrt(dx * dx + dy * dy) <= 15) {
      return { dx, dy }; // 返回需要調整的位移
    }
  }

  if (draggedPoints.right && targetPoints.left) {
    const dx = targetPoints.left.x - draggedPoints.right.x;
    const dy = targetPoints.left.y - draggedPoints.right.y;

    if (Math.sqrt(dx * dx + dy * dy) <= 15) {
      return { dx, dy };
    }
  }
  return null; // 不符合吸附條件
};

// 調整積木高度
const updatePathHeight = (block, baseHeight = 22, extraHeight = 60) => {
  if (!block || !block.hasAttribute("data-adjustable-height")) return;

  // 計算子積木中影響高度的最大深度
  const depth = calculateMaxAttributeDepth(block, "data-affects-height");

  // 根據深度調整高度
  let newHeight = baseHeight;
  if (depth === 0) {
    newHeight = 22;
  } else if (depth === 2) {
    newHeight = baseHeight + 10;
  } else {
    newHeight = baseHeight - 55 + (depth - 1) * extraHeight;
  }

  // 更新路徑高度
  const pathElement = block.querySelector("path");
  const pathData = `M10 0h280c5.523 0 10 4.477 10 10v45a5 5 0 0 1-5 5H156.001c-3.648 6.072-9.458 10-16.001 10-6.543 0-12.353-3.928-16.001-10H90c-10.71 0-19.454 8.419-19.975 19H70v${newHeight}h.025c.52 10.581 9.265 19 19.975 19h205a5 5 0 0 1 5 5v15c0 5.523-4.477 10-10 10H10c-5.523 0-10-4.477-10-10V10C0 4.477 4.477 0 10 0Z`;
  pathElement.setAttribute("d", pathData);
};

// 計算指定屬性的最大深度
const calculateMaxAttributeDepth = (block, attributeName) => {
  let maxDepth = 0;

  const traverseChildren = (node, currentDepth) => {
    if (node.hasAttribute(attributeName)) {
      maxDepth = Math.max(maxDepth, currentDepth);
    }

    // 遍歷所有子節點
    const children = node.children;
    for (let child of children) {
      if (child.tagName === "g") {
        traverseChildren(child, currentDepth + 1);
      }
    }
  };

  traverseChildren(block, 1); // 從 1 開始計算
  return maxDepth;
};

// 向上遍歷父積木樹
const updateAllParentHeights = (block) => {
  let current = block;

  while (
    current &&
    current.parentNode &&
    current.parentNode.classList.contains("block")
  ) {
    current = current.parentNode;

    if (current.hasAttribute("data-adjustable-height")) {
      updatePathHeight(current);
    }
  }
};

// 綁定拖曳事件
document.querySelector("#workspace").addEventListener("touchstart", (event) => {
  const block = event.target.closest(".block");
  if (block && (!isDragging || block === draggedElement)) {
    startDrag(event, block);
    event.preventDefault();
  }
});
workspace.addEventListener("touchmove", (event) => {
  drag(event);
  event.preventDefault(); // 防止默認行為（如滾動）
});
workspace.addEventListener("touchend", endDrag);
