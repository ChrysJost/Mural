
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SuggestionForm from "./SuggestionForm";

interface SuggestionFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (suggestion: any) => void;
}

const SuggestionFormDialog = ({ isOpen, onClose, onSubmit }: SuggestionFormDialogProps) => {
  const handleSubmit = (suggestion: any) => {
    onSubmit(suggestion);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <SuggestionForm
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionFormDialog;
