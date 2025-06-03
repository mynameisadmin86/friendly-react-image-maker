
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { EditableCellProps } from './types';

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  rowIndex,
  columnKey,
  isEditable,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');

  console.log(`EditableCell rendered for ${columnKey} at row ${rowIndex}, editable: ${isEditable}`);

  const handleStartEdit = useCallback(() => {
    if (!isEditable) {
      console.warn(`Attempted to edit non-editable cell: ${columnKey}`);
      return;
    }
    console.log(`Starting edit for ${columnKey} at row ${rowIndex}`);
    setEditValue(value || '');
    setIsEditing(true);
  }, [isEditable, columnKey, rowIndex, value]);

  const handleSave = useCallback(() => {
    try {
      console.log(`Saving edit for ${columnKey} at row ${rowIndex}: "${editValue}"`);
      onEdit(rowIndex, columnKey, editValue);
      setIsEditing(false);
      toast.success(`Updated ${columnKey} successfully`);
    } catch (error) {
      console.error(`Error saving edit for ${columnKey}:`, error);
      toast.error('Failed to update value');
    }
  }, [rowIndex, columnKey, editValue, onEdit]);

  const handleCancel = useCallback(() => {
    console.log(`Cancelling edit for ${columnKey} at row ${rowIndex}`);
    setEditValue(value || '');
    setIsEditing(false);
  }, [columnKey, rowIndex, value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  if (!isEditable) {
    return <span className="text-sm">{value || ''}</span>;
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 min-w-0">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-8 py-1 px-2 text-sm"
          autoFocus
          placeholder="Enter value..."
        />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleSave} 
          className="h-6 w-6 flex-shrink-0"
          aria-label="Save changes"
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleCancel} 
          className="h-6 w-6 flex-shrink-0"
          aria-label="Cancel changes"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 group min-w-0">
      <span className="text-sm truncate">{value || ''}</span>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleStartEdit} 
        className="h-6 w-6 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity"
        aria-label="Edit value"
      >
        <Edit className="h-3 w-3" />
      </Button>
    </div>
  );
};
