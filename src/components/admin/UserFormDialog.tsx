
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";

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

interface UserFormDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserFormData {
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: string;
}

export const UserFormDialog = ({ user, open, onOpenChange }: UserFormDialogProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const form = useForm<UserFormData>({
    defaultValues: {
      name: "",
      email: "",
      role: "Visualizador",
      permissions: [],
      status: "ativo",
    },
  });

  // Permissões disponíveis
  const availablePermissions = [
    { id: "users.read", label: "Visualizar Usuários", category: "Usuários" },
    { id: "users.write", label: "Gerenciar Usuários", category: "Usuários" },
    { id: "suggestions.read", label: "Visualizar Sugestões", category: "Sugestões" },
    { id: "suggestions.manage", label: "Gerenciar Sugestões", category: "Sugestões" },
    { id: "roadmap.read", label: "Visualizar Roadmap", category: "Roadmap" },
    { id: "roadmap.manage", label: "Gerenciar Roadmap", category: "Roadmap" },
    { id: "changelog.read", label: "Visualizar Changelog", category: "Changelog" },
    { id: "changelog.manage", label: "Gerenciar Changelog", category: "Changelog" },
  ];

  // Permissões por função
  const rolePermissions = {
    "Administrador": availablePermissions.map(p => p.id),
    "Gerente": ["users.read", "suggestions.manage", "roadmap.read", "changelog.read"],
    "Analista": ["suggestions.read", "roadmap.read", "changelog.read"],
    "Editor": ["suggestions.read", "changelog.manage"],
    "Visualizador": ["suggestions.read", "roadmap.read"]
  };

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        status: user.status,
      });
      setSelectedPermissions(user.permissions);
    } else {
      form.reset({
        name: "",
        email: "",
        role: "Visualizador",
        permissions: [],
        status: "ativo",
      });
      setSelectedPermissions([]);
    }
  }, [user, form]);

  const handleRoleChange = (role: string) => {
    const permissions = rolePermissions[role as keyof typeof rolePermissions] || [];
    setSelectedPermissions(permissions);
    form.setValue("permissions", permissions);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    let newPermissions;
    if (checked) {
      newPermissions = [...selectedPermissions, permissionId];
    } else {
      newPermissions = selectedPermissions.filter(p => p !== permissionId);
    }
    setSelectedPermissions(newPermissions);
    form.setValue("permissions", newPermissions);
  };

  const onSubmit = (data: UserFormData) => {
    const formData = {
      ...data,
      permissions: selectedPermissions
    };
    
    if (user) {
      console.log("Atualizando usuário:", user.id, formData);
    } else {
      console.log("Criando novo usuário:", formData);
    }
    
    // Aqui seria feita a integração com a API
    onOpenChange(false);
  };

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof availablePermissions>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: João Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="joao@empresa.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleRoleChange(value);
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Gerente">Gerente</SelectItem>
                        <SelectItem value="Analista">Analista</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Visualizador">Visualizador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="text-base font-medium">Permissões</FormLabel>
              <div className="mt-3 space-y-4">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 border-b pb-1">
                      {category}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.id, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={permission.id}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {user ? "Salvar Alterações" : "Criar Usuário"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
