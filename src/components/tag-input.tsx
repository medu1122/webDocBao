"use client";

import { useState, useRef, type KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useController, type UseControllerProps, type FieldValues } from 'react-hook-form';

interface TagInputProps<T extends FieldValues> extends UseControllerProps<T> {
  suggestedTags?: string[];
  onAddSuggestedTag: (tag: string) => void;
}

export function TagInput<T extends FieldValues>({ suggestedTags = [], onAddSuggestedTag, ...props }: TagInputProps<T>) {
  const { field } = useController(props);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const tags = Array.isArray(field.value) ? field.value : [];

  const addTag = (tag: string) => {
    const newTag = tag.trim();
    if (newTag && !tags.includes(newTag)) {
      field.onChange([...tags, newTag]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    field.onChange(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleAddSuggestedTag = (tag: string) => {
    addTag(tag);
    onAddSuggestedTag(tag);
  };

  return (
    <div className="space-y-2">
      <div className="border border-input rounded-md p-2 flex flex-wrap gap-2 items-center" onClick={() => inputRef.current?.focus()}>
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full hover:bg-muted-foreground/20 p-0.5"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border-0 shadow-none focus-visible:ring-0 h-auto p-0 m-0"
          placeholder={tags.length === 0 ? "Add tags..." : ""}
        />
      </div>
      {suggestedTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                onClick={() => handleAddSuggestedTag(tag)}
                className="cursor-pointer hover:bg-accent"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
