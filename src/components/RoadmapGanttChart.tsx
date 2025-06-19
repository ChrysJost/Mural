
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
  product: string;
  startDate?: string;
  endDate?: string;
  reactions: {
    likes: number;
    hearts: number;
    ideas: number;
  };
}

interface RoadmapGanttChartProps {
  items: RoadmapItem[];
  onItemClick: (item: RoadmapItem) => void;
}

const getProductColor = (product: string) => {
  const colors: Record<string, string> = {
    Bot: "#8B5CF6",
    Mapa: "#3B82F6", 
    Workspace: "#10B981",
    Financeiro: "#F59E0B",
    Fiscal: "#EF4444",
    SAC: "#6366F1",
    Agenda: "#EC4899"
  };
  return colors[product] || "#6B7280";
};

const RoadmapGanttChart = ({ items, onItemClick }: RoadmapGanttChartProps) => {
  const [timeFilter, setTimeFilter] = useState("month");

  // Generate date range based on filter
  const generateDateRange = () => {
    const now = new Date();
    const dates = [];
    
    if (timeFilter === "week") {
      // Generate 12 weeks
      for (let i = 0; i < 12; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + (i * 7));
        dates.push(date);
      }
    } else if (timeFilter === "month") {
      // Generate 12 months
      for (let i = 0; i < 12; i++) {
        const date = new Date(now);
        date.setMonth(date.getMonth() + i);
        dates.push(date);
      }
    } else {
      // Generate 4 quarters
      for (let i = 0; i < 4; i++) {
        const date = new Date(now);
        date.setMonth(date.getMonth() + (i * 3));
        dates.push(date);
      }
    }
    
    return dates;
  };

  const dateRange = generateDateRange();

  const calculateItemPosition = (item: RoadmapItem) => {
    if (!item.startDate || !item.endDate) return null;
    
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    const rangeStart = dateRange[0];
    const rangeEnd = dateRange[dateRange.length - 1];
    
    // Calculate position as percentage
    const totalRange = rangeEnd.getTime() - rangeStart.getTime();
    const itemStart = Math.max(0, (startDate.getTime() - rangeStart.getTime()) / totalRange * 100);
    const itemEnd = Math.min(100, (endDate.getTime() - rangeStart.getTime()) / totalRange * 100);
    const width = Math.max(2, itemEnd - itemStart);
    
    return { left: `${itemStart}%`, width: `${width}%` };
  };

  const formatDateLabel = (date: Date) => {
    if (timeFilter === "week") {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } else if (timeFilter === "month") {
      return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    } else {
      return `Q${Math.ceil((date.getMonth() + 1) / 3)}/${date.getFullYear()}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Visualização Gantt</h3>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            <SelectItem value="week">Por Semana</SelectItem>
            <SelectItem value="month">Por Mês</SelectItem>
            <SelectItem value="quarter">Por Trimestre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-900 dark:text-white">Timeline do Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Header with dates */}
          <div className="relative mb-6">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2">
              {dateRange.map((date, index) => (
                <div key={index} className="flex-1 text-center">
                  {formatDateLabel(date)}
                </div>
              ))}
            </div>
          </div>

          {/* Gantt chart rows */}
          <div className="space-y-4">
            {items.map((item) => {
              const position = calculateItemPosition(item);
              const productColor = getProductColor(item.product);
              
              return (
                <div key={item.id} className="relative">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-64 shrink-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {item.title}
                          {(!item.startDate || !item.endDate) && (
                            <span className="text-orange-500 ml-1">*</span>
                          )}
                        </h4>
                        <Badge 
                          className="text-xs"
                          style={{ 
                            backgroundColor: `${productColor}20`, 
                            color: productColor,
                            borderColor: productColor 
                          }}
                        >
                          {item.product}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex-1 relative h-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {position ? (
                        <div
                          className="absolute top-1 bottom-1 rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
                          style={{
                            left: position.left,
                            width: position.width,
                            backgroundColor: productColor,
                            minWidth: '40px'
                          }}
                          onClick={() => onItemClick(item)}
                        >
                          <span className="text-white text-xs font-medium truncate px-2">
                            {item.title}
                          </span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Sem cronograma definido
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onItemClick(item)}
                      className="shrink-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {item.startDate && item.endDate && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 ml-64 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.startDate).toLocaleDateString('pt-BR')} - {new Date(item.endDate).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Nenhum item no roadmap</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              * Itens sem data de finalização definida
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoadmapGanttChart;
