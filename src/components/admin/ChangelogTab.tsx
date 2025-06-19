
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Eye, Tag } from "lucide-react";
import { ChangelogFormDialog } from "./ChangelogFormDialog";
import { ChangelogDetailDialog } from "./ChangelogDetailDialog";
import { useChangelog } from "@/hooks/useChangelog";

const ChangelogTab = () => {
  const { changelogEntries, loading, createChangelogEntry } = useChangelog();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleCreateEntry = async (entryData: any) => {
    try {
      await createChangelogEntry(entryData);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating changelog entry:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando changelog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Changelog</h2>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Release
        </Button>
      </div>

      <div className="space-y-6">
        {changelogEntries.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">
                      {item.version}
                    </Badge>
                    <Badge className={getTypeColor(item.type)} variant="secondary">
                      <Tag className="w-3 h-3 mr-1" />
                      {getTypeLabel(item.type)}
                    </Badge>
                    <Badge variant="outline">{item.product}</Badge>
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.release_date).toLocaleDateString('pt-BR')}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(item)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Principais mudanças:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {item.features.slice(0, 3).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                  {item.features.length > 3 && (
                    <li className="text-blue-600 font-medium">
                      +{item.features.length - 3} outras mudanças...
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {changelogEntries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma entrada de changelog ainda.</p>
        </div>
      )}

      <ChangelogFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateEntry}
      />

      <ChangelogDetailDialog
        item={selectedItem}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
};

export default ChangelogTab;
