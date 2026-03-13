import { useState } from "react";
import { format } from "date-fns";
import { useCreateMemory, useDeleteMemory } from "@/hooks/useMemory";
import { MemoryCreate, InstitutionalMemory } from "@/types/memory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BrainCircuit, Trash2, Plus, X } from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";

export function EmployeeMemoryTab({ employeeId, memory }: { employeeId: string, memory: InstitutionalMemory[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<MemoryCreate>>({ event_type: "Note" });
  
  const createMutation = useCreateMemory();
  const deleteMutation = useDeleteMemory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    
    createMutation.mutate({
      employee_id: employeeId,
      title: formData.title,
      description: formData.description,
      event_type: formData.event_type || "Note",
      source: "Manual Entry (HR)",
    }, {
      onSuccess: () => {
        toast.success("Institutional memory added");
        setIsOpen(false);
        setFormData({ event_type: "Note" });
      },
      onError: (err: any) => {
        toast.error(`Failed to add memory: ${err.message || 'Unknown error'}`);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this memory entry?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Memory deleted")
      });
    }
  };

  // Filter out the auto-generated timeline events (like 'meeting') to only show true institutional memory
  // or show all. The backend combines them in the timeline endpoint. We will show all but emphasize notes.
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-indigo-500" />
            Institutional Context
          </h3>
          <p className="text-sm text-slate-500">Important context, personal preferences, and historical nuances that HR leaders shouldn't forget.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-[min(var(--radius-md),12px)] bg-primary px-3 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 gap-1.5">
            <Plus className="h-4 w-4" /> Add Context
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add Institutional Memory</DialogTitle>
                <DialogDescription>
                  Record important context about this employee to preserve institutional knowledge.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title / Topic</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Prefers async communication" 
                    value={formData.title || ''}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    autoFocus
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Category</Label>
                  <Input 
                    id="type" 
                    placeholder="e.g., Preference, Coaching, Aspiration" 
                    value={formData.event_type || ''}
                    onChange={(e) => setFormData({...formData, event_type: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Details</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Add details about this context..." 
                    className="min-h-[100px]"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Saving..." : "Save Context"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {memory.map((item) => (
          <div key={item.id} className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-3 top-3 h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                {item.event_type}
              </span>
              <span className="text-xs text-slate-400">
                {format(new Date(item.created_at), 'MMM yyyy')}
              </span>
            </div>
            <h4 className="font-semibold text-slate-900 leading-snug pr-8 mb-2">{item.title}</h4>
            {item.description && (
              <p className="text-sm text-slate-600 leading-relaxed mb-3">"{item.description}"</p>
            )}
            {item.source && (
              <div className="flex items-center text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                Found in: <span className="text-slate-500 ml-1 bg-slate-100 px-1.5 py-0.5 rounded">{item.source}</span>
              </div>
            )}
          </div>
        ))}

        {memory.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <h3 className="text-sm font-medium text-slate-600">No institutional memory recorded yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Add context like preferred working styles, family details, or career aspirations to build a unified profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}
