import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createDocument, updateDocument } from "@/lib/firestore-operations"
import { logActivity } from "@/lib/firestore-operations"
import { useAuth } from "@/components/auth/AuthContext"

// Define a Package interface for better type safety
interface Package {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
}

interface PackageFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Package) => void;
  initialData?: Partial<Package>;
  title?: string;
}

export function PackageFormDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = {}, 
  title = "Add Package"
}: PackageFormDialogProps) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<Package>({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    features: [],
    isActive: true,
    ...initialData
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featureInput, setFeatureInput] = useState("");
  
  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        description: "",
        price: 0,
        duration: 30,
        features: [],
        isActive: true,
        ...initialData
      });
      setErrors({});
    }
  }, [isOpen, initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Package) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev: Package) => ({
      ...prev,
      isActive: checked
    }));
  };
  
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev: Package) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    setFormData((prev: Package) => ({
      ...prev,
      features: prev.features.filter((_: string, i: number) => i !== index)
    }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (formData.price < 0) {
      newErrors.price = "Price cannot be negative";
    }
    
    if (formData.duration < 1) {
      newErrors.duration = "Duration must be at least 1 day";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Convert price to number
      const dataToSave = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration)
      };
      
      let result;
      
      // If we have an ID, update the document, otherwise create a new one
      if (formData.id) {
        result = await updateDocument('packages', formData.id, dataToSave);
        await logActivity(
          'package_updated',
          currentUser?.displayName || 'Admin',
          `Updated package: ${formData.name}`
        );
      } else {
        result = await createDocument('packages', dataToSave);
        await logActivity(
          'package_created',
          currentUser?.displayName || 'Admin',
          `Created new package: ${formData.name}`
        );
      }
      
      onSave(result);
      onClose();
    } catch (error: unknown) {
      console.error('Error saving package:', error);
      setErrors(prev => ({
        ...prev,
        form: `Error saving package: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the details for the subscription package.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {errors.form && (
            <div className="text-red-500 text-sm mb-4">{errors.form}</div>
          )}
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Package Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Premium Monthly"
              />
              {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Access to all premium predictions for 30 days"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  min={0}
                  step={0.01}
                />
                {errors.price && <div className="text-red-500 text-sm">{errors.price}</div>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  min={1}
                />
                {errors.duration && <div className="text-red-500 text-sm">{errors.duration}</div>}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Add a feature"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddFeature}>Add</Button>
              </div>
              
              <ul className="mt-2 space-y-2">
                {formData.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <span>{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="isActive">Active</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Package'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}