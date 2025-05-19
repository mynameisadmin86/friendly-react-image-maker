
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
    updateColumnSequence(targetColumnKey);
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
