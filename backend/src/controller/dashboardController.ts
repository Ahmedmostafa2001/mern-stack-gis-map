import { Request, Response } from "express";
import prisma from "../config/db";
import { calculateDistancePostGIS, calculateDistanceJS, estimateTime } from "../utils/geo";

export const addPlace = async (req: Request, res: Response) => {
  try {
    const { name, name_ar, name_fr, building_type,description,description_ar, description_fr, latitude, longitude } = req.body;

    // ADD THIS LOGGING
    console.log("Backend received:", {
      latitude,
      longitude,
      latType: typeof latitude,
      lngType: typeof longitude
    });

    const building = await prisma.building.create({
      data: {
        name,
        name_ar,
        name_fr,
        building_type,
        description,description_ar, description_fr,
        latitude: parseFloat(latitude),  // Force conversion
        longitude: parseFloat(longitude), // Force conversion
      },
    });

    console.log("Saved to DB:", building); // Check what was saved

    res.json(building);
  } catch (error) {
    console.error("Error adding building:", error);
    res.status(500).json({ message: "Error adding building", error });
  }
};

export const getDistance = async (req: Request, res: Response) => {
  try {
    const { start, end, mode = "drive", speed } = req.body;
    if (!start || !end) {
      return res.status(400).json({ message: "Missing start or end" });
    }

    let distance = 0;

    try {
      distance = await calculateDistancePostGIS(start, end);
    } catch (err) {
      console.warn("Falling back to JS distance:", err);
      distance = calculateDistanceJS(start, end);
    }

    const { timeString, minutes } = estimateTime(distance, mode, speed);

    res.json({
      mode,
      distance: parseFloat(distance.toFixed(2)),
      time: {
        readable: timeString,
        minutes,
      },
    });
  } catch (error) {
    console.error("Error calculating distance:", error);
    res.status(500).json({ message: "Error calculating distance", error });
  }
};

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [users, buildings] = await Promise.all([
      prisma.user.count(),
      prisma.building.count(),
    ]);
    res.json({ users, buildings });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

export const getBuildings = async (_req: Request, res: Response) => {
  try {
    const buildings = await prisma.building.findMany({
      select: {
        id: true,
        name: true,
        name_ar: true,
        name_fr: true,
        building_type: true,
        description: true,
        description_ar: true,
        description_fr: true,
        latitude: true,
        longitude: true,
        createdAt: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.json({ buildings });
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ message: "Error fetching buildings", error });
  }
};
