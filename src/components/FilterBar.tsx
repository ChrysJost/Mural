
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, TrendingUp } from "lucide-react";

interface FilterBarProps {
  suggestions: any[];
  onFilter: (filtered: any[]) => void;
}

const FilterBar = ({ suggestions, onFilter }: FilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const modules = ["Bot", "Mapa", "Workspace", "Financeiro", "Fiscal", "SAC", "Agenda", "Outro"];
  const statuses = ["Recebido", "Em análise", "Em desenvolvimento", "Concluído", "Rejeitado"];

  useEffect(() => {
    let filtered = [...suggestions];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by module
    if (moduleFilter !== "all") {
      filtered = filtered.filter(s => s.module === moduleFilter);
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case "votes":
        filtered.sort((a, b) => b.votes - a.votes);
        break;
      case "recent":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "comments":
        filtered.sort((a, b) => b.comments - a.comments);
        break;
    }

    // Pinned suggestions always first
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    onFilter(filtered);
  }, [searchTerm, moduleFilter, statusFilter, sortBy, suggestions, onFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setModuleFilter("all");
    setStatusFilter("all");
    setSortBy("recent");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filtros e Busca</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Buscar sugestões..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Módulo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os módulos</SelectItem>
            {modules.map((module) => (
              <SelectItem key={module} value={module}>
                {module}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais recentes</SelectItem>
            <SelectItem value="votes">Mais votadas</SelectItem>
            <SelectItem value="comments">Mais comentadas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>{suggestions.length} sugestões encontradas</span>
        </div>
        
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
