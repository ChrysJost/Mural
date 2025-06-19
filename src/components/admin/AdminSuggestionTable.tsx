import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  author: string;
  product: string;
  status: "pendente" | "em-analise" | "aprovada" | "rejeitada" | "implementada";
  priority: "baixa" | "media" | "alta";
  votes: number;
  createdAt: string;
  comments: number;
  isPublic?: boolean;
}

interface AdminSuggestionTableProps {
  suggestions: Suggestion[];
  onStatusChange: (suggestionId: string, newStatus: string) => void;
  onViewDetails: (suggestion: Suggestion) => void;
}

const AdminSuggestionTable = ({ suggestions, onStatusChange, onViewDetails }: AdminSuggestionTableProps) => {
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  const getStatusColor = (status: string) => {
    const colors = {
      "pendente": "bg-yellow-100 text-yellow-800",
      "em-analise": "bg-blue-100 text-blue-800",
      "aprovada": "bg-green-100 text-green-800",
      "rejeitada": "bg-red-100 text-red-800",
      "implementada": "bg-purple-100 text-purple-800"
    };
    return colors[status as keyof typeof colors];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      "baixa": "bg-gray-100 text-gray-800",
      "media": "bg-orange-100 text-orange-800",
      "alta": "bg-red-100 text-red-800"
    };
    return colors[priority as keyof typeof colors];
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSuggestions(new Set(suggestions.map(s => s.id)));
    } else {
      setSelectedSuggestions(new Set());
    }
  };

  const handleSelectSuggestion = (suggestionId: string, checked: boolean) => {
    const newSelected = new Set(selectedSuggestions);
    if (checked) {
      newSelected.add(suggestionId);
    } else {
      newSelected.delete(suggestionId);
    }
    setSelectedSuggestions(newSelected);
  };

  const handleExportToExcel = () => {
    const selectedSuggestionsData = suggestions.filter(s => selectedSuggestions.has(s.id));
    
    const exportData = selectedSuggestionsData.map(suggestion => ({
      'ID': suggestion.id,
      'Título': suggestion.title,
      'Descrição': suggestion.description,
      'Autor': suggestion.author,
      'Produto': suggestion.product,
      'Status': suggestion.status,
      'Prioridade': suggestion.priority,
      'Votos': suggestion.votes,
      'Comentários': suggestion.comments,
      'Data de Criação': new Date(suggestion.createdAt).toLocaleDateString('pt-BR')
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sugestões');
    
    const fileName = `sugestoes_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const isAllSelected = selectedSuggestions.size === suggestions.length && suggestions.length > 0;
  const isPartialSelected = selectedSuggestions.size > 0 && selectedSuggestions.size < suggestions.length;

  return (
    <div className="space-y-4">
      {selectedSuggestions.size > 0 && (
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border">
          <span className="text-sm font-medium text-blue-800">
            {selectedSuggestions.size} item(s) selecionado(s)
          </span>
          <Button onClick={handleExportToExcel} size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar para Excel
          </Button>
        </div>
      )}

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="min-w-[200px]">Título</TableHead>
              <TableHead className="min-w-[250px]">Descrição</TableHead>
              <TableHead className="w-32">Autor</TableHead>
              <TableHead className="w-24">Produto</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-24">Prioridade</TableHead>
              <TableHead className="w-16 text-center">Votos</TableHead>
              <TableHead className="w-20 text-center">Comentários</TableHead>
              <TableHead className="w-28">Data</TableHead>
              <TableHead className="w-32">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suggestions.map((suggestion) => (
              <TableRow
                key={suggestion.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedSuggestions.has(suggestion.id)}
                    onCheckedChange={(checked) => handleSelectSuggestion(suggestion.id, checked as boolean)}
                  />
                </TableCell>
                
                <TableCell>
                  <span className="font-medium text-gray-900">
                    {truncateText(suggestion.title, 40)}
                  </span>
                </TableCell>
                
                <TableCell>
                  <span className="text-gray-600 text-sm">
                    {truncateText(suggestion.description, 60)}
                  </span>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm text-gray-600">{suggestion.author}</span>
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline">{suggestion.product}</Badge>
                </TableCell>
                
                <TableCell>
                  <Badge className={cn("font-medium px-2 py-1 text-xs", getStatusColor(suggestion.status))} variant="secondary">
                    {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <Badge className={cn("font-medium px-2 py-1 text-xs", getPriorityColor(suggestion.priority))} variant="secondary">
                    {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)}
                  </Badge>
                </TableCell>
                
                <TableCell className="text-center">
                  <span className="text-sm font-medium">{suggestion.votes}</span>
                </TableCell>
                
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <MessageSquare className="w-3 h-3 text-gray-500" />
                    <span className="text-sm text-gray-600">{suggestion.comments}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {new Date(suggestion.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </TableCell>
                
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(suggestion)}
                    className="text-xs"
                  >
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminSuggestionTable;
