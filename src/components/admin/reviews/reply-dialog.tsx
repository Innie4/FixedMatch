import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ReplyDialogProps {
  review: any;
  isOpen: boolean;
  onClose: () => void;
  templateResponses: any[];
}

export function ReplyDialog({
  review,
  isOpen,
  onClose,
  templateResponses
}: ReplyDialogProps) {
  const [replyText, setReplyText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    const template = templateResponses.find(t => t.id.toString() === value);
    if (template) {
      setReplyText(template.content);
    }
  };
  
  const handleSubmit = () => {
    // In a real app, this would call an API to save the reply
    console.log(`Replying to review ${review?.id} with: ${replyText}`);
    onClose();
  };
  
  if (!review) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reply to Review</DialogTitle>
          <DialogDescription>
            Respond to {review.username}&apos;s review about your service.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">{review.username}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Use Template Response</label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {templateResponses.map((template) => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    {template.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Reply</label>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response here..."
              rows={6}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!replyText.trim()}>
            Send Reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}