import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import React from "react"; // Import React for React.FC

interface RiskChampionRegistrationFormProps {
  onRegister: (championData: any) => Promise<void>;
  onCancel: () => void;
  units: string[]; // Explicitly declare that it expects 'units' as an array of strings
}

// Corrected component declaration:
// 1. Added type annotation React.FC<RiskChampionRegistrationFormProps>
// 2. Destructured 'units' and 'onCancel' from the props
const RiskChampionRegistrationForm: React.FC<RiskChampionRegistrationFormProps> = ({ onRegister, onCancel, units }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    unit: "",
    phone: "",
    password: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Added type for event to avoid implicit 'any'
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Added type for event and error to avoid implicit 'any'
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onRegister(form);
      toast({ title: "Risk champion registration successful" });
      // navigate("/coordinator/risk-champions"); // You might want to remove this line if onCancel handles navigation/form closure
      onCancel(); // Call onCancel to close the form in the parent
      setForm({ firstName: "", lastName: "", email: "", unit: "", phone: "", password: "" });
    } catch (error: any) { // Explicitly cast error to 'any' or a more specific type if known
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">Register New Risk Champion</h2>
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email" // Added id for better accessibility with Label
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="example@udsm.co.tz"
        />
      </div>
      <div>
        <Label htmlFor="unit">Unit</Label>
        <select
          id="unit" // Added id for better accessibility with Label
          name="unit"
          value={form.unit}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select unit</option>
          {/* This 'units' is now correctly destructured from props */}
          {units.map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password" // Added id for better accessibility with Label
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Set password for champion"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4"> {/* Added a wrapper div for buttons and margin-top */}
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button> {/* Changed to type="button" to prevent form submission */}
        <Button type="submit">Register</Button>
      </div>
    </form>
  );
};

export default RiskChampionRegistrationForm;