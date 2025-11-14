'use client';
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { DashboardService } from "@/services/dashboard.service";
import { Building, Point } from "@/types/DashboardType";

export default function DashboardPage() {
  const { token, loading } = useAuth();

  // State
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [mode, setMode] = useState<"walk" | "drive">("drive");
  const [speed, setSpeed] = useState<number | null>(null);

  // 🔹 Fetch buildings from backend
  useEffect(() => {
    const loadBuildings = async () => {
      try {
        const data = await DashboardService.getBuildings();
        setBuildings(data);
      } catch (err) {
        console.error("Error loading buildings:", err);
      }
    };

    if (token) loadBuildings();
  }, [token]);


  // 🔹 Calculate distance
  const handleCalculate = async () => {
    if (!startPoint || !endPoint) return;

    try {
      const data = await DashboardService.getDistance(startPoint, endPoint, mode, speed);
      setDistance(data.distance);
      setTime(data.time.minutes);
    } catch (err) {
      console.error("Error calculating distance:", err);
      alert("Failed to calculate distance. Please try again.");
    }
  };

  // 🔹 Clear results
  const handleClear = () => {
    setStartPoint(null);
    setEndPoint(null);
    setDistance(null);
    setTime(null);
  };

  // 🔹 Auth redirect
  useEffect(() => {
    if (!loading && !token) {
      window.location.href = "/login";
    }
  }, [loading, token]);

  if (loading)
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
          <p>Checking authentication...</p>
        </div>
    );

  if (!token)
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
          <p>Redirecting to login...</p>
        </div>
    );

  return (
      <DashboardLayout>
        <DashboardContent
            buildings={buildings}
            startPoint={startPoint}
            endPoint={endPoint}
            distance={distance}
            time={time}
            onStartPoint={setStartPoint}
            onEndPoint={setEndPoint}
            onCalculate={handleCalculate}
            onClear={handleClear}
            mode={mode}
            setMode={setMode}
            speed={speed}
            setSpeed={setSpeed}
        />
      </DashboardLayout>
  );
}
