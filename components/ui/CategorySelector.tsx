import React from 'react';
import { useCategoryStore } from '@/lib/store/categoryStore';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface CategorySelectorProps {
  value: string;
  onChange: (categoryId: string) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const { categories } = useCategoryStore();
  const [open, setOpen] = React.useState(false);

  const selectedCategory = categories.find((c) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white/5 border-white/10 hover:bg-white/10 text-left font-normal"
        >
          {selectedCategory ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedCategory.icon}</span>
              <span>{selectedCategory.label}</span>
            </div>
          ) : (
            "Select category..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 glass border-white/20">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search category..." className="border-none focus:ring-0" />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.label}
                  onSelect={() => {
                    onChange(category.id);
                    setOpen(false);
                  }}
                  className="hover:bg-primary/20"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="mr-2 text-xl">{category.icon}</span>
                  {category.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
