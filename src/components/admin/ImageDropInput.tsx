import React, { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageDropInputProps {
  value?: string;
  onChange: (value: string | undefined, file?: File) => void;
  className?: string;
  accept?: string;
}

const ImageDropInput: React.FC<ImageDropInputProps> = ({
  value,
  onChange,
  className,
  accept = 'image/*',
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || !files.length) return;
      const file = files[0];
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') onChange(reader.result, file);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'group relative border rounded-md px-4 py-6 flex flex-col items-center justify-center gap-2 text-xs text-center cursor-pointer bg-muted/40 hover:bg-muted/70 transition',
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
        {value ? (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="relative w-full max-h-56 overflow-hidden rounded">
              <img
                src={value}
                alt="Preview"
                className="object-cover w-full h-full"
                loading="lazy"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(undefined);
                }}
                className="absolute top-1 right-1 bg-white/80 backdrop-blur rounded-full p-1 shadow hover:bg-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                Change
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(undefined);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
            <div className="text-muted-foreground">
              <span className="font-medium">Click / Drop</span> image
            </div>
            <div className="text-[10px] text-muted-foreground/80 flex items-center gap-1">
              <Upload className="w-3 h-3" /> JPG / PNG / WEBP
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
};

export default ImageDropInput;
