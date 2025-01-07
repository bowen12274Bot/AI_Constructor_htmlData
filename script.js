const workspace = document.getElementById("workspace");
let isDragging = false;
let draggedElement = null;
let ghostElement = null;
let offsetX = 0;
let offsetY = 0;
let targetParent = null;
let isEditing = false;

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
  const point = workspace.createSVGPoint();
  const touch = event.touches[0]; // 使用第一個觸控點
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

// 綁定觸控事件
workspace.addEventListener("touchstart", (event) => {
  if (isEditing) {
    event.stopPropagation(); // 如果正在編輯，阻止拖曳事件
    return;
  }
  const block = event.target.closest(".block");
  if (block) {
    startDrag(event, block); // 開始拖曳
  }
});
workspace.addEventListener("touchmove", (event) => {
  if (isEditing) return; // 如果正在編輯，不執行拖曳
  drag(event); // 拖曳邏輯
});
workspace.addEventListener("touchend", (event) => {
  if (isEditing) return; // 如果正在編輯，不執行結束拖曳
  endDrag(); // 結束拖曳邏輯
});
