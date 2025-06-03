
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Edit } from 'lucide-react';
import { EditableCellProps } from './types';

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  rowIndex,
  columnKey,
  isEditable,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  console.log(`EditableCell rendered for ${columnKey}, editable: ${isEditable}`);

  if (!isEditable) {
    return <span>{value}</span>;
  }

  const handleEdit = () => {
    console.log(`Starting edit for ${columnKey}`);
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log(`Saving edit for ${columnKey}: ${editValue}`);
    onEdit(rowIndex, columnKey, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log(`Cancelling edit for ${columnKey}`);
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="h-8 py-1 px-2"
          autoFocus
        />
        <Button variant="ghost" size="icon" onClick={handleSave} className="h-6 w-6">
          <Check className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCancel} className="h-6 w-6">
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 group">
      <span>{value}</span>
      <Button variant="ghost" size="icon" onClick={handleEdit} className="h-6 w-6 opacity-0 group-hover:opacity-100">
        <Edit className="h-3 w-3" />
      </Button>
    </div>
  );
};
