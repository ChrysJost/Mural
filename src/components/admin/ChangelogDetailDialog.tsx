
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, Edit, CheckCircle } from "lucide-react";

interface ChangelogItem {
  id: string;
  version: string;
  title: string;
  description: string;
  type: "feature" | "improvement" | "bugfix" | "breaking";
  releaseDate: string;
  changes: string[];
}

interface ChangelogDetailDialogProps {
  item: ChangelogItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangelogDetailDialog = ({ item, open, onOpenChange }: ChangelogDetailDialogProps) => {
  if (!item) return null;

  const getTypeColor = (type: string) => {
    const colors = {
      "feature": "bg-green-100 text-green-800",
      "improvement": "bg-blue-100 text-blue-800",
      "bugfix": "bg-red-100 text-red-800",
      "breaking": "bg-orange-100 text-orange-800"
    };
    return colors[type as keyof typeof colors];
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      "feature": "Nova Funcionalidade",
      "improvement": "Melhoria",
      "bugfix": "Correção",
      "breaking": "Breaking Change"
    };
    return labels[type as keyof typeof labels];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                  {item.version}
                </Badge>
                <Badge className={getTypeColor(item.type)} variant="secondary">
                  <Tag className="w-3 h-3 mr-1" />
                  {getTypeLabel(item.type)}
                </Badge>
              </div>
              <DialogTitle className="text-2xl">{item.title}</DialogTitle>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Editar
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Lançado em {new Date(item.releaseDate).toLocaleDateString('pt-BR')}</span>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Descrição</h3>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Mudanças Incluídas ({item.changes.length})
            </h3>
            <div className="space-y-2">
              {item.changes.map((change, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seção de estatísticas da release */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-900">Estatísticas da Release</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-700">{item.changes.length}</div>
                <div className="text-sm text-blue-600">Mudanças</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">
                  {Math.floor(Math.random() * 50) + 10}
                </div>
                <div className="text-sm text-blue-600">Dias Desenvolvimento</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">
                  {Math.floor(Math.random() * 20) + 5}
                </div>
                <div className="text-sm text-blue-600">Issues Fechadas</div>
              </div>
            </div>
          </div>

          {/* Notas técnicas */}
          <div>
            <h3 className="font-semibold mb-3">Notas Técnicas</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 leading-relaxed">
                Esta release foi testada em ambiente de staging por 5 dias antes do deploy em produção. 
                Todos os testes automatizados passaram com sucesso. Recomendamos que os usuários 
                atualizem suas integrações caso utilizem nossa API.
              </p>
              
              {item.type === "breaking" && (
                <div className="mt-3 p-3 bg-orange-100 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800 font-medium">
                    ⚠️ Esta é uma release com breaking changes. Consulte a documentação de migração 
                    antes de atualizar.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
