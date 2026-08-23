"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

const ROW_TOLERANCE_PX = 4;

interface Row {
  top: number;
  cells: HTMLElement[];
}

function groupIntoRows(items: HTMLElement[]): Row[] {
  const rows: Row[] = [];
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

interface UseGridNavOptions {
  initialIndex?: number;
}

/**
 * Enables arrow-key (D-pad) navigation across a grid/list of focusable items,
 * using a roving tabindex and a `.tv-focused` class for visible focus.
 */
export function useGridNav<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  itemSelector: string,
  { initialIndex = 0 }: UseGridNavOptions = {},
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let currentIndex = 0;

    function getItems(): HTMLElement[] {
      return Array.from(container!.querySelectorAll<HTMLElement>(itemSelector));
    }

    function setFocus(index: number, items: HTMLElement[]) {
      if (!items.length) return;
      currentIndex = Math.max(0, Math.min(index, items.length - 1));
      items.forEach((item, i) => {
        item.tabIndex = i === currentIndex ? 0 : -1;
        item.classList.toggle("tv-focused", i === currentIndex);
      });
      items[currentIndex].focus();
    }

    function move(direction: "left" | "right" | "up" | "down") {
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

    function handleKeydown(event: KeyboardEvent) {
      const directionByKey: Record<string, "left" | "right" | "up" | "down"> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };
      const direction = directionByKey[event.key];
      if (!direction) return;
      event.preventDefault();
      move(direction);
    }

    function handleFocusin(event: FocusEvent) {
      const items = getItems();
      const index = items.indexOf(event.target as HTMLElement);
      if (index === -1) return;
      currentIndex = index;
      items.forEach((item, i) => item.classList.toggle("tv-focused", i === index));
    }

    container.addEventListener("keydown", handleKeydown);
    container.addEventListener("focusin", handleFocusin, true);
    setFocus(initialIndex, getItems());

    return () => {
      container.removeEventListener("keydown", handleKeydown);
      container.removeEventListener("focusin", handleFocusin, true);
    };
  }, [containerRef, itemSelector, initialIndex]);
}
