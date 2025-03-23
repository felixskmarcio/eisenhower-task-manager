import React from 'react';
import { useTags } from '@/contexts/TagContext';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/utils/classNames';

interface TagFilterSelectProps {
  type: 'project' | 'context' | 'lifearea';
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

const TagFilterSelect: React.FC<TagFilterSelectProps> = ({ type, value, onChange, className }) => {
  const { tags, getTagsByType } = useTags();
  const [open, setOpen] = React.useState(false);
  
  const filteredTags = getTagsByType(type);
  
  const getTypeLabel = () => {
    switch (type) {
      case 'project': return 'Projeto';
      case 'context': return 'Contexto';
      case 'lifearea': return 'Área de Vida';
      default: return type;
    }
  };

  const selectedTag = filteredTags.find(tag => tag.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between border-gray-700/50 bg-background/30 backdrop-blur-sm hover:bg-background/50", className)}
        >
          <div className="flex items-center gap-2">
            {value && selectedTag ? (
              <>
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: selectedTag.color }}
                />
                <span>{selectedTag.name}</span>
              </>
            ) : (
              <span>Todos os {getTypeLabel()}s</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 border-gray-700/80 bg-background/95 backdrop-blur-md">
        <Command className="bg-transparent">
          <CommandInput placeholder={`Buscar ${getTypeLabel().toLowerCase()}...`} className="h-9" />
          <CommandEmpty>Nenhum {getTypeLabel().toLowerCase()} encontrado.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              key="all"
              onSelect={() => {
                onChange(null);
                setOpen(false);
              }}
              className="flex items-center gap-2 hover:bg-secondary/20"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  !value ? "opacity-100" : "opacity-0"
                )}
              />
              <span>Todos os {getTypeLabel()}s</span>
            </CommandItem>
            {filteredTags.map(tag => (
              <CommandItem
                key={tag.id}
                onSelect={() => {
                  onChange(tag.id);
                  setOpen(false);
                }}
                className="flex items-center gap-2 hover:bg-secondary/20"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === tag.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                <span>{tag.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TagFilterSelect;
