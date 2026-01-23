"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface SearchResult {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    thumbnail: string | null;
}

interface SearchCommandProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
    const router = useRouter();
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Search debounce
    React.useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setResults(data.results || []);
                setSelectedIndex(0);
            } catch (error) {
                console.error("Search error:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Focus input when dialog opens
    React.useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 0);
        } else {
            setQuery("");
            setResults([]);
            setSelectedIndex(0);
        }
    }, [open]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
        }
    };

    const handleSelect = (result: SearchResult) => {
        onOpenChange(false);
        router.push(`/courses/${result.slug}`);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 gap-0 max-w-2xl overflow-hidden">
                <VisuallyHidden>
                    <DialogTitle>Search Courses</DialogTitle>
                </VisuallyHidden>

                {/* Search Input */}
                <div className="flex items-center border-b px-4">
                    <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                    <Input
                        ref={inputRef}
                        placeholder="Search courses..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="border-0 focus-visible:ring-0 text-lg h-14 placeholder:text-muted-foreground"
                    />
                    {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                </div>

                {/* Results */}
                <div className="max-h-[400px] overflow-y-auto">
                    {query.length < 2 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Start typing to search courses...</p>
                            <p className="text-sm mt-2">
                                Use <kbd className="px-2 py-1 bg-muted rounded text-xs">↑</kbd>{" "}
                                <kbd className="px-2 py-1 bg-muted rounded text-xs">↓</kbd> to navigate,{" "}
                                <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> to select
                            </p>
                        </div>
                    ) : results.length === 0 && !isLoading ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No courses found for &quot;{query}&quot;</p>
                            <p className="text-sm mt-2">Try a different search term</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {results.map((result, index) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleSelect(result)}
                                    className={cn(
                                        "w-full flex items-center gap-4 px-4 py-3 text-left transition-colors",
                                        index === selectedIndex
                                            ? "bg-accent"
                                            : "hover:bg-accent/50"
                                    )}
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-12 w-16 rounded overflow-hidden bg-muted shrink-0">
                                        {result.thumbnail ? (
                                            <Image
                                                src={result.thumbnail}
                                                alt={result.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <BookOpen className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{result.title}</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {result.category} • {result.description}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <ArrowRight className={cn(
                                        "h-4 w-4 shrink-0 transition-opacity",
                                        index === selectedIndex ? "opacity-100" : "opacity-0"
                                    )} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
                    <span>
                        {results.length > 0 && `${results.length} results`}
                    </span>
                    <span>
                        Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">ESC</kbd> to close
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Hook to use globally with keyboard shortcut
export function useSearchCommand() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return { open, setOpen };
}
