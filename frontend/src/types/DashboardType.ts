// src/types/DashboardType.ts

export interface UserDashboard {
  id :number
  name:string
  email:string
  createdAt:string
}

export interface Point {
  lat: number;
  lng: number;
}

export interface Building {
  id?: number; // Optional for creation
  name: string;
  name_ar: string;
  name_fr: string;
  building_type: string;
  description: string,
  description_ar :string,
  description_fr: string,
  latitude: number;
  longitude: number;
}


export interface SidebarProps {
  buildings: Building[];
  startPoint: Point | null;
  endPoint: Point | null;
  distance: number | null;
  time: number | null;
  onCalculate: () => void;
  onClear: () => void;
}

export interface Map3DProps {
  buildings: Building[];
  startPoint: Point | null;
  endPoint: Point | null;
  onStartPoint: (point: Point) => void;
  onEndPoint: (point: Point) => void;
}
