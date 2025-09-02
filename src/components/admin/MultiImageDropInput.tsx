import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Images, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiImageDropInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  max?: number;
  className?: string;
  accept?: string;
}

const MultiImageDropInput: React.FC<MultiImageDropInputProps> = ({
  values,
  onChange,
  max = 4,
  className,
  accept = 'image/*',
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const list = Array.from(files).slice(0, max - values.length);
      if (!list.length) return;
      Promise.all(
        list.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            })
        )
      ).then((data) => onChange([...values, ...data].slice(0, max)));
    },
    [values, max, onChange]
  );

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'relative border rounded-md px-4 py-5 flex flex-col items-center justify-center gap-2 text-xs text-center cursor-pointer bg-muted/40 hover:bg-muted/70 transition',
          dragging && 'border-primary bg-primary/10'
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <Images className="w-6 h-6 text-muted-foreground" />
        <div className="text-muted-foreground">
          <span className="font-medium">Drop / Click</span> images ({values.length}/{max})
        </div>
        <div className="text-[10px] text-muted-foreground/80 flex items-center gap-1">
          <Upload className="w-3 h-3" /> JPG / PNG / WEBP
        </div>
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={accept}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((v, i) => (
            <div key={i} className="relative group">
              <img src={v} alt="preview" className="w-16 h-16 object-cover rounded border" />
              <button
                type="button"
                onClick={() => onChange(values.filter((_, j) => j !== i))}
                className="absolute -top-2 -right-2 bg-black/60 text-white rounded-full w-5 h-5 text-[10px] hidden group-hover:flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiImageDropInput;
