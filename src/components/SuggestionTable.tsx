

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronUp, MessageCircle, Pin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  module: string;
  status: string;
  votes: number;
  hasVoted: boolean;
  createdAt: string;
  email: string;
  comments: number;
  adminResponse?: string;
  isPinned?: boolean;
}

interface SuggestionTableProps {
  suggestions: Suggestion[];
  onVote: (id: string) => void;
  onClick: (suggestion: Suggestion) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Recebido": return "bg-blue-100 text-blue-700 border-blue-200";
    case "Em análise": return "bg-amber-100 text-amber-700 border-amber-200";
    case "Em desenvolvimento": return "bg-green-100 text-green-700 border-green-200";
    case "Concluído": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Rejeitado": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getModuleColor = (module: string) => {
  const colors: Record<string, string> = {
    Bot: "bg-purple-50 text-purple-700 border-purple-200",
    Mapa: "bg-blue-50 text-blue-700 border-blue-200",
    Workspace: "bg-green-50 text-green-700 border-green-200",
    Financeiro: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Fiscal: "bg-red-50 text-red-700 border-red-200",
    SAC: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Agenda: "bg-pink-50 text-pink-700 border-pink-200",
    Outro: "bg-gray-50 text-gray-700 border-gray-200"
  };
  return colors[module] || "bg-gray-50 text-gray-700 border-gray-200";
};

const SuggestionTable = ({ suggestions, onVote, onClick }: SuggestionTableProps) => {
  const handleVoteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onVote(id);
  };

  const handleRowClick = (suggestion: Suggestion) => {
    onClick(suggestion);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">Votos</TableHead>
            <TableHead className="min-w-[200px]">Título</TableHead>
            <TableHead className="min-w-[250px]">Descrição</TableHead>
            <TableHead className="w-32">Status</TableHead>
            <TableHead className="w-20 text-center">Comentários</TableHead>
            <TableHead className="w-28">Data</TableHead>
            <TableHead className="w-24">Módulo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suggestions.map((suggestion) => (
            <TableRow
              key={suggestion.id}
              className={cn(
                "cursor-pointer hover:bg-gray-50 transition-colors",
                suggestion.isPinned && "bg-yellow-50"
              )}
              onClick={() => handleRowClick(suggestion)}
            >
              <TableCell className="text-center">
                <button
                  onClick={(e) => handleVoteClick(e, suggestion.id)}
                  className={cn(
                    "flex flex-col items-center justify-center px-3 py-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 min-w-[48px]",
                    suggestion.hasVoted 
                      ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600" 
                      : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                  )}
                >
                  <ChevronUp className="w-4 h-4 mb-0.5" />
                  <span className="text-xs font-bold">
                    {suggestion.votes}
                  </span>
                </button>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-1">
                  {suggestion.isPinned && <Pin className="w-3 h-3 text-yellow-600 flex-shrink-0" />}
                  <span className="font-medium text-gray-900 hover:text-blue-600">
                    {truncateText(suggestion.title, 40)}
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                <span className="text-gray-600 text-sm">
                  {truncateText(suggestion.description, 60)}
                </span>
              </TableCell>
              
              <TableCell>
                <Badge className={cn("border font-medium px-2 py-1 text-xs", getStatusColor(suggestion.status))}>
                  {suggestion.status}
                </Badge>
              </TableCell>
              
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <MessageCircle className="w-3 h-3 text-gray-500" />
                  <span className="text-sm text-gray-600">{suggestion.comments}</span>
                </div>
              </TableCell>
              
              <TableCell>
                <span className="text-sm text-gray-600">{suggestion.createdAt}</span>
              </TableCell>
              
              <TableCell>
                <Badge className={cn("border font-medium px-2 py-1 text-xs", getModuleColor(suggestion.module))}>
                  {suggestion.module}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SuggestionTable;

