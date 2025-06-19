
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Edit, UserX, UserCheck } from "lucide-react";
import { UserFormDialog } from "./UserFormDialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: "ativo" | "inativo";
  createdAt: string;
  lastLogin: string;
}

const UsersTab = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Dados mockados de usuários
  const users: User[] = [
    {
      id: "1",
      name: "João Silva",
      email: "joao@empresa.com",
      role: "Administrador",
      permissions: ["users.read", "users.write", "suggestions.manage", "roadmap.manage", "changelog.manage"],
      status: "ativo",
      createdAt: "2024-01-15",
      lastLogin: "2024-01-25"
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@empresa.com",
      role: "Gerente",
      permissions: ["users.read", "suggestions.manage", "roadmap.read"],
      status: "ativo",
      createdAt: "2024-01-10",
      lastLogin: "2024-01-24"
    },
    {
      id: "3",
      name: "Pedro Costa",
      email: "pedro@empresa.com",
      role: "Analista",
      permissions: ["suggestions.read", "roadmap.read", "changelog.read"],
      status: "ativo",
      createdAt: "2024-01-20",
      lastLogin: "2024-01-23"
    },
    {
      id: "4",
      name: "Ana Oliveira",
      email: "ana@empresa.com",
      role: "Editor",
      permissions: ["suggestions.read", "changelog.manage"],
      status: "inativo",
      createdAt: "2024-01-08",
      lastLogin: "2024-01-15"
    },
    {
      id: "5",
      name: "Carlos Ferreira",
      email: "carlos@empresa.com",
      role: "Visualizador",
      permissions: ["suggestions.read", "roadmap.read"],
      status: "ativo",
      createdAt: "2024-01-18",
      lastLogin: "2024-01-22"
    }
  ];

  const getStatusColor = (status: string) => {
    return status === "ativo" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  const getRoleColor = (role: string) => {
    const colors = {
      "Administrador": "bg-purple-100 text-purple-800",
      "Gerente": "bg-blue-100 text-blue-800",
      "Analista": "bg-orange-100 text-orange-800",
      "Editor": "bg-yellow-100 text-yellow-800",
      "Visualizador": "bg-gray-100 text-gray-800"
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    console.log(`Alterando status do usuário ${userId} para: ${newStatus}`);
    // Aqui seria feita a integração com a API
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Usuários e Permissões</h2>
        <Button 
          onClick={() => {
            setSelectedUser(null);
            setIsFormOpen(true);
          }} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === "ativo").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === "Administrador").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Último Login Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.lastLogin === "2024-01-25").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)} variant="secondary">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)} variant="secondary">
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        variant={user.status === "ativo" ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className="flex items-center gap-1"
                      >
                        {user.status === "ativo" ? (
                          <>
                            <UserX className="w-4 h-4" />
                            Inativar
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" />
                            Ativar
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UserFormDialog
        user={selectedUser}
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default UsersTab;
