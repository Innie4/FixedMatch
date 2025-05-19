import Image from "next/image";
import { Calendar, User, DollarSign, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WinningTicket } from "../../types";

interface TicketDetailsSheetProps {
  ticket: WinningTicket | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketDetailsSheet({
  ticket,
  isOpen,
  onClose
}: TicketDetailsSheetProps) {
  if (!ticket) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Ticket Details</SheetTitle>
          <SheetDescription>View winning ticket information</SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Image
              src={ticket.image}
              alt={ticket.title}
              width={300}
              height={200}
              className="rounded-md object-cover"
            />
            <div className="text-center">
              <h3 className="font-medium text-lg">{ticket.title}</h3>
              <div className="flex items-center justify-center text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                {ticket.date}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Odds</p>
              <p className="font-medium">{ticket.odds}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Stake</p>
              <p className="font-medium">{ticket.stake}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Winnings</p>
              <p className="font-medium text-green-600">{ticket.winnings}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={ticket.status === "active" ? "default" : "secondary"}>
                {ticket.status === "active" ? "Active" : "Archived"}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-3">Matches</h4>
            <div className="space-y-3">
              {ticket.matches.map((match, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <div className="font-medium text-sm mb-1">{match.teams}</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prediction: {match.prediction}</span>
                    <span className="font-medium">Result: {match.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2" />
              <span className="text-muted-foreground">Uploaded by:</span>
              <span className="font-medium ml-2">{ticket.uploadedBy}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-muted-foreground">Uploaded at:</span>
              <span className="font-medium ml-2">{ticket.uploadedAt}</span>
            </div>
          </div>
        </div>
        
        <SheetFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}