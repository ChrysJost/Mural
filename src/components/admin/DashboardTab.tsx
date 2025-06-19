
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BarChart3, TrendingUp, Users, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";

const DashboardTab = () => {
  // Dados mockados para o dashboard
  const dashboardData = {
    totalSuggestions: 247,
    suggestionsByStatus: {
      pending: 68,
      inProgress: 45,
      completed: 112,
      rejected: 22
    },
    suggestionsByProduct: [
      { name: "Bot", value: 65, color: "#8b5cf6" },
      { name: "Mapa", value: 52, color: "#3b82f6" },
      { name: "Workspace", value: 43, color: "#10b981" },
      { name: "Financeiro", value: 38, color: "#f59e0b" },
      { name: "Fiscal", value: 31, color: "#ef4444" },
      { name: "SAC", value: 18, color: "#6366f1" }
    ]
  };

  const chartConfig = {
    Bot: { label: "Bot", color: "#8b5cf6" },
    Mapa: { label: "Mapa", color: "#3b82f6" },
    Workspace: { label: "Workspace", color: "#10b981" },
    Financeiro: { label: "Financeiro", color: "#f59e0b" },
    Fiscal: { label: "Fiscal", color: "#ef4444" },
    SAC: { label: "SAC", color: "#6366f1" }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>
        
        {/* Cards principais lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Total de Sugestões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.totalSuggestions}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.suggestionsByStatus.pending}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.suggestionsByStatus.inProgress}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Concluídas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.suggestionsByStatus.completed}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Rejeitadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData.suggestionsByStatus.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Pizza */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Distribuição de Sugestões por Produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[400px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={dashboardData.suggestionsByProduct}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {dashboardData.suggestionsByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardTab;
