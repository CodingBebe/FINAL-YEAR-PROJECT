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
    id: string;
    title: string;
    owner: string;
    category: string;
    description: string;
    department: string;
    status: string;
    rating: number;
    severity: string;
    lastUpdated: string;
    impact: string;
    likelihood: string;
    controls: string;
    mitigation: string;
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Basic Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground">Risk ID:</span>
                  {isEditing ? (
                    <Input
                      value={editedRisk.id}
                      onChange={(e) => handleChange('id', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{risk.id}</p>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Title:</span>
                  {isEditing ? (
                    <Input
                      value={editedRisk.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{risk.title}</p>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Owner:</span>
                  {isEditing ? (
                    <Input
                      value={editedRisk.owner}
                      onChange={(e) => handleChange('owner', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{risk.owner}</p>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Department:</span>
                  {isEditing ? (
                    <Input
                      value={editedRisk.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{risk.department}</p>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  {isEditing ? (
                    <Select
                      value={editedRisk.category}
                      onValueChange={(value) => handleChange('category', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Compliance">Compliance</SelectItem>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="Fraud and Corruption">Fraud and Corruption</SelectItem>
                        <SelectItem value="Governance">Governance</SelectItem>
                        <SelectItem value="Health, Safety and Welfare">Health, Safety and Welfare</SelectItem>
                        <SelectItem value="Human capital">Human capital</SelectItem>
                        <SelectItem value="ICT">ICT</SelectItem>
                        <SelectItem value="Infrastructure Management">Infrastructure Management</SelectItem>
                        <SelectItem value="Operational">Operational</SelectItem>
                        <SelectItem value="Research & Consultancy">Research & Consultancy</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium">{risk.category}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Risk Assessment</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  {isEditing ? (
                    <Select
                      value={editedRisk.status}
                      onValueChange={(value) => handleChange('status', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Mitigating">Mitigating</SelectItem>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium">{risk.status}</p>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Rating:</span>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={editedRisk.rating}
                      onChange={(e) => handleChange('rating', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{risk.rating}</p>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Severity:</span>
                  {isEditing ? (
                    <Select
                      value={editedRisk.severity}
                      onValueChange={(value) => handleChange('severity', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium">{risk.severity}</p>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedRisk.lastUpdated}
                      onChange={(e) => handleChange('lastUpdated', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{risk.lastUpdated}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Description</h3>
              {isEditing ? (
                <Textarea
                  value={editedRisk.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground">{risk.description}</p>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Risk Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Impact:</span>
                  {isEditing ? (
                    <Textarea
                      value={editedRisk.impact}
                      onChange={(e) => handleChange('impact', e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1">{risk.impact}</p>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Likelihood:</span>
                  {isEditing ? (
                    <Textarea
                      value={editedRisk.likelihood}
                      onChange={(e) => handleChange('likelihood', e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1">{risk.likelihood}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Controls & Mitigation</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-muted-foreground">Existing Controls:</span>
                  {isEditing ? (
                    <Textarea
                      value={editedRisk.controls}
                      onChange={(e) => handleChange('controls', e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1">{risk.controls}</p>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Mitigation Plan:</span>
                  {isEditing ? (
                    <Textarea
                      value={editedRisk.mitigation}
                      onChange={(e) => handleChange('mitigation', e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  ) : (
                    <p className="mt-1">{risk.mitigation}</p>
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