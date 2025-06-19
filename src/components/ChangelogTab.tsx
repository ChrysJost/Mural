
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Image, Video, FileText, ChevronRight } from "lucide-react";
import ChangelogDetailDialog from "./ChangelogDetailDialog";
import { useChangelog } from "@/hooks/useChangelog";
import { useState } from "react";

const getProductColor = (product: string) => {
  const colors: Record<string, string> = {
    Bot: "bg-purple-50 text-purple-700 border-purple-200",
    Mapa: "bg-blue-50 text-blue-700 border-blue-200", 
    Workspace: "bg-green-50 text-green-700 border-green-200",
    Financeiro: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Fiscal: "bg-red-50 text-red-700 border-red-200",
    SAC: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Agenda: "bg-pink-50 text-pink-700 border-pink-200"
  };
  return colors[product] || "bg-gray-50 text-gray-700 border-gray-200";
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "image":
    case "gif":
      return Image;
    case "video":
      return Video;
    case "text":
      return FileText;
    default:
      return FileText;
  }
};

const ChangelogTab = () => {
  const { changelogEntries, loading } = useChangelog();
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const handleEntryClick = (entry: any) => {
    // Transform database entry to component format
    const transformedEntry = {
      id: entry.id,
      version: entry.version,
      title: entry.title,
      description: entry.description,
      type: entry.content_type,
      content: entry.content,
      imageUrl: entry.image_url,
      videoUrl: entry.video_url,
      product: entry.product,
      releaseDate: entry.release_date,
      features: entry.features
    };
    setSelectedEntry(transformedEntry);
    setShowDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setShowDetailDialog(false);
    setSelectedEntry(null);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando changelog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Changelog</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Acompanhe todas as novidades, melhorias e funcionalidades que entregamos para você.
        </p>
      </div>

      <div className="space-y-6">
        {changelogEntries.map((entry) => {
          const TypeIcon = getTypeIcon(entry.content_type);
          
          return (
            <Card 
              key={entry.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              onClick={() => handleEntryClick(entry)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <TypeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <Badge className={`${getProductColor(entry.product)} border text-xs`}>
                        {entry.product}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                        {entry.version}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {entry.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(entry.release_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed line-clamp-2">
                  {entry.description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {entry.features.length} principais funcionalidades
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {entry.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                      {feature}
                    </Badge>
                  ))}
                  {entry.features.length > 3 && (
                    <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                      +{entry.features.length - 3} mais
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {changelogEntries.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma atualização disponível no momento.</p>
        </div>
      )}

      <ChangelogDetailDialog
        entry={selectedEntry}
        isOpen={showDetailDialog}
        onClose={handleCloseDetailDialog}
      />
    </div>
  );
};

export default ChangelogTab;
