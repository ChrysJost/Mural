
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Upload, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SuggestionFormProps {
  onSubmit: (suggestion: any) => void;
  onCancel: () => void;
}

const modules = [
  "Bot", "Mapa", "Workspace", "Financeiro", "Fiscal", "SAC", "Agenda", "Outro"
];

const SuggestionForm = ({ onSubmit, onCancel }: SuggestionFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    module: "",
    email: "",
    youtubeUrl: "",
    isPublic: true
  });
  const { toast } = useToast();

  // Automação para emails @mksolution.com
  useEffect(() => {
    if (formData.email.endsWith('@mksolution.com')) {
      setFormData(prev => ({ ...prev, isPublic: false }));
    }
  }, [formData.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.description.length < 200) {
      toast({
        title: "Descrição muito curta",
        description: "A descrição deve ter pelo menos 200 caracteres.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      ...formData,
      status: "Recebido"
    });

    toast({
      title: "Sugestão enviada com sucesso!",
      description: "Sua sugestão foi recebida e será analisada pela nossa equipe.",
    });
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Nova Sugestão</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="module">Produto/Módulo *</Label>
              <Select value={formData.module} onValueChange={(value) => handleChange("module", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o módulo" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module} value={module}>
                      {module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Título da Sugestão *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Descreva sua sugestão em poucas palavras"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição * (mínimo 200 caracteres)
              <span className="text-sm text-gray-500 ml-2">
                {formData.description.length}/200
              </span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Descreva detalhadamente sua sugestão, incluindo o problema atual, a solução proposta e os benefícios esperados..."
              rows={6}
              className="resize-none"
              required
            />
          </div>

          {/* Opção Público/Privado */}
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Visibilidade da Sugestão</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formData.isPublic 
                    ? "Esta sugestão será visível para todos os usuários no mural público"
                    : "Esta sugestão será visível apenas internamente (não aparece no mural público)"
                  }
                </p>
                {formData.email.endsWith('@mksolution.com') && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    ℹ️ Emails @mksolution.com são automaticamente definidos como privados
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="visibility" className="text-sm">
                  {formData.isPublic ? "Público" : "Privado"}
                </Label>
                <Switch
                  id="visibility"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleChange("isPublic", checked)}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Anexos (Opcional)</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="images" className="text-sm">Imagens (.jpg, .png, .webp)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Clique para fazer upload de imagens</p>
                  <p className="text-xs text-gray-400">Máximo 5MB por imagem</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl" className="text-sm">Vídeo do YouTube</Label>
                <div className="space-y-2">
                  <Input
                    id="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Ou faça upload de um vídeo (.mp4)</p>
                    <p className="text-xs text-gray-400">Máximo 50MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={formData.description.length < 200}
            >
              Enviar Sugestão
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SuggestionForm;
