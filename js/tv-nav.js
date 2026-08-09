const ROW_TOLERANCE_PX = 4;

const BACK_KEYS = new Set(["Escape", "Backspace", "GoBack", "BrowserBack"]);
// 10009 = Samsung Tizen remote "Back", 461 = LG webOS remote "Back".
const BACK_KEY_CODES = new Set([10009, 461]);

function groupIntoRows(items) {
  const rows = [];
  for (const item of items) {
    const top = Math.round(item.offsetTop);
    let row = rows.find((candidate) => Math.abs(candidate.top - top) < ROW_TOLERANCE_PX);
    if (!row) {
      row = { top, cells: [] };
      rows.push(row);
    }
    row.cells.push(item);
  }
  rows.sort((a, b) => a.top - b.top);
  return rows;
}

/**
 * Enables arrow-key (D-pad) navigation across a grid/list of focusable items,
 * using a roving tabindex and a `.tv-focused` class for visible focus.
 * @param {HTMLElement} container
 * @param {string} itemSelector
 */
export function enableGridNav(container, itemSelector) {
  let currentIndex = 0;

  function getItems() {
    return Array.from(container.querySelectorAll(itemSelector));
  }

  function setFocus(index, items) {
    if (!items.length) return;
    currentIndex = Math.max(0, Math.min(index, items.length - 1));
    items.forEach((item, i) => {
      item.tabIndex = i === currentIndex ? 0 : -1;
      item.classList.toggle("tv-focused", i === currentIndex);
    });
    items[currentIndex].focus();
  }

  function move(direction) {
    const items = getItems();
    if (!items.length) return;
    const rows = groupIntoRows(items);
    const rowIndex = rows.findIndex((row) => row.cells.includes(items[currentIndex]));
    if (rowIndex === -1) {
      setFocus(0, items);
      return;
    }
    const row = rows[rowIndex];
    const colIndex = row.cells.indexOf(items[currentIndex]);

    if (direction === "left") {
      setFocus(items.indexOf(row.cells[Math.max(0, colIndex - 1)]), items);
    } else if (direction === "right") {
      setFocus(items.indexOf(row.cells[Math.min(row.cells.length - 1, colIndex + 1)]), items);
    } else if (direction === "up" && rowIndex > 0) {
      const targetRow = rows[rowIndex - 1];
      setFocus(items.indexOf(targetRow.cells[Math.min(colIndex, targetRow.cells.length - 1)]), items);
    } else if (direction === "down" && rowIndex < rows.length - 1) {
      const targetRow = rows[rowIndex + 1];
      setFocus(items.indexOf(targetRow.cells[Math.min(colIndex, targetRow.cells.length - 1)]), items);
    }
  }

  container.addEventListener("keydown", (event) => {
    const directionByKey = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
    };
    const direction = directionByKey[event.key];
    if (!direction) return;
    event.preventDefault();
    move(direction);
  });

  container.addEventListener(
    "focusin",
    (event) => {
      const items = getItems();
      const index = items.indexOf(event.target);
      if (index === -1) return;
      currentIndex = index;
      items.forEach((item, i) => item.classList.toggle("tv-focused", i === index));
    },
    true,
  );

  setFocus(0, getItems());
}

/**
 * Listens for TV-remote / keyboard "Back" presses (Escape, Backspace, and the
 * vendor-specific key codes Tizen and webOS remotes send) and calls `handler`.
 * @param {() => void} handler
 */
export function enableBackKey(handler) {
  window.addEventListener("keydown", (event) => {
    if (BACK_KEYS.has(event.key) || BACK_KEY_CODES.has(event.keyCode)) {
      event.preventDefault();
      handler();
    }
  });
}
