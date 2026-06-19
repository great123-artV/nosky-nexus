export interface EmergencyContact {
  name: string;
  number: string;
  description: string;
}

export const emergencyContacts: EmergencyContact[] = [
  {
    name: "General Emergency",
    number: "112 or 767",
    description: "Primary emergency numbers in Nigeria for Police, Fire, and Ambulance.",
  },
  {
    name: "Police",
    number: "112",
    description: "Nigeria Police Force emergency response.",
  },
  {
    name: "Fire Service",
    number: "112",
    description: "Federal and State Fire Service emergency response.",
  },
  {
    name: "Medical Emergency",
    number: "112",
    description: "Ambulance and medical emergency services.",
  },
  {
    name: "Road Safety (FRSC)",
    number: "122",
    description: "Federal Road Safety Corps for road accidents and emergencies.",
  },
];
