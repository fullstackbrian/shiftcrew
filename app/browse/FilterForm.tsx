"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";

interface FilterFormProps {
  neighborhoods: string[];
  initialRestaurant?: string;
}

const POSITION_OPTIONS = [
  { label: "Server", value: "Server" },
  { label: "Line Cook", value: "Line Cook" },
  { label: "Cook", value: "Cook" },
  { label: "Bartender", value: "Bartender" },
  { label: "Host/Hostess", value: "Host" },
  { label: "Chef", value: "Chef" },
  { label: "Manager", value: "Manager" },
  { label: "Dishwasher", value: "Dishwasher" },
  { label: "Busser", value: "Busser" },
  { label: "Barista", value: "Barista" },
];

export function FilterForm({ neighborhoods, initialRestaurant }: FilterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse positions from URL (comma-separated)
  const parsePositions = (param: string | null): string[] => {
    if (!param || param === "all") return [];
    return param.split(",").filter(Boolean);
  };
  
  const serializePositions = (positions: string[]): string => {
    return positions.length > 0 ? positions.join(",") : "";
  };
  
  // Sync state with URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [positions, setPositions] = useState<string[]>(
    parsePositions(searchParams.get("position"))
  );
  const [neighborhood, setNeighborhood] = useState(
    searchParams.get("neighborhood") || "all"
  );
  const restaurantParam = searchParams.get("restaurant") || initialRestaurant || "";

  // Update state when URL params change (e.g., when clicking position/restaurant)
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setPositions(parsePositions(searchParams.get("position")));
    setNeighborhood(searchParams.get("neighborhood") || "all");
  }, [searchParams]);

  // Memoized filter application function
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    const positionsParam = serializePositions(positions);
    if (positionsParam) params.set("position", positionsParam);
    if (neighborhood && neighborhood !== "all") params.set("neighborhood", neighborhood);
    if (restaurantParam) params.set("restaurant", restaurantParam);
    router.push(`/browse?${params.toString()}`);
  }, [search, positions, neighborhood, restaurantParam, router]);

  // Debounced search - auto-apply after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only apply if search has changed from URL param
      const currentSearch = searchParams.get("search") || "";
      if (search.trim() !== currentSearch.trim()) {
        applyFilters();
      }
    }, 400); // 400ms debounce - good balance between responsiveness and API calls

    return () => clearTimeout(timeoutId);
  }, [search, applyFilters, searchParams]);

  // Auto-apply when positions or neighborhood change
  useEffect(() => {
    const currentPositions = parsePositions(searchParams.get("position"));
    const currentNeighborhood = searchParams.get("neighborhood") || "all";
    
    const positionsChanged = JSON.stringify(currentPositions.sort()) !== JSON.stringify(positions.sort());
    const neighborhoodChanged = currentNeighborhood !== neighborhood;
    
    if (positionsChanged || neighborhoodChanged) {
      applyFilters();
    }
  }, [positions, neighborhood]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const clearFilter = (filterName: "search" | "position" | "neighborhood" | "restaurant", value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (filterName === "position" && value) {
      // Remove specific position
      const currentPositions = parsePositions(searchParams.get("position"));
      const newPositions = currentPositions.filter((p) => p !== value);
      if (newPositions.length > 0) {
        params.set("position", newPositions.join(","));
      } else {
        params.delete("position");
      }
      setPositions(newPositions);
    } else {
      params.delete(filterName);
      // Reset local state
      if (filterName === "search") setSearch("");
      if (filterName === "position") setPositions([]);
      if (filterName === "neighborhood") setNeighborhood("all");
    }
    
    router.push(`/browse?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/browse");
    setSearch("");
    setPositions([]);
    setNeighborhood("all");
  };

  const hasActiveFilters = 
    search.trim() || 
    positions.length > 0 || 
    (neighborhood && neighborhood !== "all") || 
    restaurantParam;

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search jobs, restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12"
            />
          </div>
          <MultiSelect
            options={POSITION_OPTIONS}
            selected={positions}
            onChange={setPositions}
            placeholder="Select positions..."
            className="h-12"
          />
          <Select value={neighborhood} onValueChange={setNeighborhood}>
            <SelectTrigger className="h-12 w-full">
              <SelectValue placeholder="Neighborhood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Neighborhoods</SelectItem>
              {neighborhoods.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <div className="mt-4 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={clearAllFilters}
              size="sm"
            >
              Clear All
            </Button>
          </div>
        )}
      </form>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-neutral-600">Active filters:</span>
          {positions.map((pos) => (
            <Badge key={pos} variant="secondary" className="gap-1">
              Position: {pos}
              <button
                onClick={() => clearFilter("position", pos)}
                className="ml-1 rounded-full hover:bg-neutral-300"
                aria-label={`Remove ${pos} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {search.trim() && (
            <Badge variant="secondary" className="gap-1">
              Search: {search}
              <button
                onClick={() => clearFilter("search")}
                className="ml-1 rounded-full hover:bg-neutral-300"
                aria-label="Remove search filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {neighborhood && neighborhood !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Neighborhood: {neighborhood}
              <button
                onClick={() => clearFilter("neighborhood")}
                className="ml-1 rounded-full hover:bg-neutral-300"
                aria-label="Remove neighborhood filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {restaurantParam && (
            <Badge variant="secondary" className="gap-1">
              Restaurant: {restaurantParam}
              <button
                onClick={() => clearFilter("restaurant")}
                className="ml-1 rounded-full hover:bg-neutral-300"
                aria-label="Remove restaurant filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
