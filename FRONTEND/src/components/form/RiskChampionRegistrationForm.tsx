import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const units = [
 "DHRMA", "DSS", "UH",
 "DPGS", "DUS", "DES", "Principals",
 "Deans",  "Directors",
 "DRP", "DPS", 
 "IPMO", "DIEN", 
 "TDTC","DSS/Commandant Auxiliary Police",
 "DoSS","SoAF",
 "CoNAS","CoET", 
 "Auxiliary Police","DICT", 
 "DLS",  "PMU", 
 "QAU","DoF", 
 "CCC & STC",
 "DPDI","DICA","CMU", 
];

const RiskChampionRegistrationForm = ({ onRegister }) => {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onRegister(form);
      toast({ title: "Risk champion registration successful" });
      navigate("/coordinator/risk-champions");
      setForm({ firstName: "", lastName: "", email: "", unit: "", phone: "", password: "" });
    } catch (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>First Name</Label>
        <Input name="firstName" value={form.firstName} onChange={handleChange} required />
      </div>
      <div>
        <Label>Last Name</Label>
        <Input name="lastName" value={form.lastName} onChange={handleChange} required />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="example@udsm.co.tz"
        />
      </div>
      <div>
        <Label>Unit</Label>
        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select unit</option>
          {units.map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>
      <div>
        <Label>Phone Number</Label>
        <Input name="phone" value={form.phone} onChange={handleChange} required />
      </div>
      <div>
        <Label>Password</Label>
        <Input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Set password for champion"
        />
      </div>
      <Button type="submit">Register</Button>
    </form>
  );
};

export default RiskChampionRegistrationForm;
