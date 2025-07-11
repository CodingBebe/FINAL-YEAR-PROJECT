import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface RiskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  risk: {
    riskId: string;
    title: string;
    strategicObjective: string;
    description?: string;
    principalOwner?: string;
    supportingOwners?: string[];
    category?: string;
    likelihood?: string;
    impact?: string;
    rating?: number;
    causes?: string;
    consequences?: string;
    existingControls?: string;
    proposedMitigation?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  onSave?: (updatedRisk: any) => void;
}

const RiskDetailsModal = ({ isOpen, onClose, risk, onSave }: RiskDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRisk, setEditedRisk] = useState(risk);

  if (!risk) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedRisk(risk);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedRisk);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRisk(risk);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string | number) => {
    setEditedRisk(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl">Risk Details</DialogTitle>
            {!isEditing && (
              <Button onClick={handleEdit} variant="outline">
                Edit Risk
              </Button>
            )}
          </div>
        </DialogHeader>
        <div className="grid grid-cols- gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Basic Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-[1fr_6fr] gap-4 ">
                <div>
                  <span className="text-muted-foreground">Risk ID:</span>
                  <p className="font-medium">{risk.riskId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Title:</span>
                  <p className="font-medium">{risk.title}</p>
                </div>
                </div>
                <div className="grid grid-cols-[4fr_3fr] gap-4  ">
                  <div>
                  <span className="text-muted-foreground">Principal Owner:</span>
                  <p className="font-medium">{risk.principalOwner}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Supporting Owners:</span>
                  <p className="font-medium">{risk.supportingOwners?.join(', ')}</p>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Strategic Objective:</span>
                  <p className="font-medium">{risk.strategicObjective}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p className="font-medium">{risk.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
          <div className="gap-4">
          <div className="grid grid-cols-[6fr_2fr] gap-4 mb-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{risk.description}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Risk Assessment</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground">Likelihood:</span>
                  <p className="font-medium">{risk.likelihood}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Impact:</span>
                  <p className="font-medium">{risk.impact}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Rating:</span>
                  <p className="font-medium">{risk.rating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
          </div>
         
          <Card className="md:col-span-2">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Risk Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  
                  {Array.isArray(risk.causes) ? (
                    <table className="min-w-full text-sm border mt-1">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b text-left w-12"></th>
                          <th className="py-2 px-4 border-b text-left">Causes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {risk.causes.map((cause: string, idx: number) => (
                          <tr key={idx} className="border-b">
                            <td className="py-2 px-4">{idx + 1}</td>
                            <td className="py-2 px-4">{cause}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="mt-1">{risk.causes}</p>
                  )}
                </div>
                <div>
                  
                  {Array.isArray(risk.consequences) ? (
                    <table className="min-w-full text-sm border mt-1">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b text-left w-12"></th>
                          <th className="py-2 px-4 border-b text-left">Consequence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {risk.consequences.map((consequence: string, idx: number) => (
                          <tr key={idx} className="border-b">
                            <td className="py-2 px-4">{idx + 1}</td>
                            <td className="py-2 px-4">{consequence}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="mt-1">{risk.consequences}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Controls & Mitigation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  
                  {Array.isArray(risk.existingControls) ? (
                    <table className="min-w-full text-sm border mt-1">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b text-left w-12"></th>
                          <th className="py-2 px-4 border-b text-left">Control</th>
                        </tr>
                      </thead>
                      <tbody>
                        {risk.existingControls.map((control: string, idx: number) => (
                          <tr key={idx} className="border-b">
                            <td className="py-2 px-4">{idx + 1}</td>
                            <td className="py-2 px-4">{control}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="mt-1">{risk.existingControls}</p>
                  )}
                </div>
                <div>
                  
                  {Array.isArray(risk.proposedMitigation) ? (
                    <table className="min-w-full text-sm border mt-1">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b text-left w-12"></th>
                          <th className="py-2 px-4 border-b text-left">Mitigation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {risk.proposedMitigation.map((mitigation: string, idx: number) => (
                          <tr key={idx} className="border-b">
                            <td className="py-2 px-4">{idx + 1}</td>
                            <td className="py-2 px-4">{mitigation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="mt-1">{risk.proposedMitigation}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {isEditing && (
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RiskDetailsModal; 