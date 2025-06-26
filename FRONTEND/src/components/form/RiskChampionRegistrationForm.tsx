import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(form);
    setForm({ firstName: "", lastName: "", email: "", unit: "", phone: "", password: "" });
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
          <option value="">Select Unit</option>
          {units.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
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
