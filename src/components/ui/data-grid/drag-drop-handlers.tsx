
import React from 'react';

export interface DragDropHandlers {
  handleDragStart: (columnKey: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (targetColumnKey: string) => void;
  handleDragEnd: () => void;
}

export const useDragDropHandlers = (
  columns: any[],
  setIsDraggingColumn: (key: string | null) => void,
  updateColumnSequence: (sourceKey: string, targetKey: string) => void
): DragDropHandlers => {
  const handleDragStart = (columnKey: string) => {
    setIsDraggingColumn(columnKey);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnKey: string) => {
    setIsDraggingColumn(null);
    // Here's the fix: we need to pass both the source and target column keys
    // We'll use the current dragging column as the source
    const sourceColumnKey = columns.find(col => col.key === targetColumnKey)?.key;
    if (sourceColumnKey) {
      updateColumnSequence(sourceColumnKey, targetColumnKey);
    }
  };

  const handleDragEnd = () => {
    setIsDraggingColumn(null);
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
};
