"use client";

import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RiskAssessmentForm = () => {
  const [formData, setFormData] = useState({
    riskId: "",
    description: "",
    strategicObjective: "",
    // ... other fields
  });

  const [strategicObjectives, setStrategicObjectives] = useState([]);
  const [loadingObjectives, setLoadingObjectives] = useState(true);

  useEffect(() => {
    const fetchStrategicObjectives = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/strategic-objectives");
        const data = await res.json();
        setStrategicObjectives(data);
      } catch (error) {
        console.error("Failed to load strategic objectives", error);
      } finally {
        setLoadingObjectives(false);
      }
    };

    fetchStrategicObjectives();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="assessment">Assessment</TabsTrigger>
        <TabsTrigger value="action">Action Plan</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="riskId">Risk ID</Label>
            <Input id="riskId" name="riskId" value={formData.riskId} onChange={handleInputChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategicObjective">Strategic Objective</Label>
            <Select
              value={formData.strategicObjective}
              onValueChange={(value) => handleSelectChange("strategicObjective", value)}
              disabled={loadingObjectives}
            >
              <SelectTrigger id="strategicObjective">
                <SelectValue placeholder={loadingObjectives ? "Loading..." : "Select a strategic objective"} />
              </SelectTrigger>
              <SelectContent>
                {strategicObjectives.map((objective, index) => (
                  <SelectItem key={index} value={objective.value || objective}>
                    {objective.label || `${objective.value || objective} - ${objective.description || ""}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="assessment">
        {/* Assessment form content goes here */}
      </TabsContent>

      <TabsContent value="action">
        {/* Action plan form content goes here */}
      </TabsContent>
    </Tabs>
  );
};

export default RiskAssessmentForm;

