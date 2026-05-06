import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, ExternalLink } from "lucide-react";

interface ExtendedReadingSectionProps {
  content: {
    links?: Array<{ title: string; url: string }>;
  };
  onUpdate: (content: any) => void;
}

export const ExtendedReadingSection = ({ content, onUpdate }: ExtendedReadingSectionProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const links = content.links || [];
  const brandBlue = "#4E84C4";
  const brandGreen = "#54B948";

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      onUpdate({ ...content, links: [...links, newLink] });
      setNewLink({ title: "", url: "" });
      setIsAdding(false);
    }
  };

  const handleRemoveLink = (index: number) => {
    onUpdate({ ...content, links: links.filter((_, i) => i !== index) });
  };

  return (
    <div 
      className="p-4 sm:p-6 border-b border-gray-100 bg-[#F0F4F8]"
      style={{ fontFamily: 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif' }}
    >
      <h3 className="text-xl sm:text-[22px] font-bold mb-6" style={{ color: brandBlue }}>Extended Reading</h3>

      {links.length > 0 && (
        <div className="space-y-3 mb-6">
          {links.map((link, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 group hover:border-[#4E84C4]/30 transition-all shadow-sm"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#E8F1F8] flex items-center justify-center flex-shrink-0">
                   <ExternalLink className="w-5 h-5" style={{ color: brandGreen }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-base text-black truncate">{link.title}</p>
                  <p className="text-sm text-gray-500 truncate">{link.url}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveLink(index)}
              >
                <X className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="space-y-4 p-4 border rounded-lg bg-white shadow-md">
          <Input
            placeholder="Link title..."
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            autoFocus
          />
          <Input
            placeholder="URL (https://...)"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          />
          <div className="flex gap-2">
            <Button size="sm" className="bg-[#4E84C4] hover:bg-[#4E84C4]/90" onClick={handleAddLink}>
              Add Link
            </Button>
            <Button variant="ghost" size="sm" onClick={() => {
              setIsAdding(false);
              setNewLink({ title: "", url: "" });
            }}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full border-dashed border-2 h-14"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reading Link
        </Button>
      )}
    </div>
  );
};
