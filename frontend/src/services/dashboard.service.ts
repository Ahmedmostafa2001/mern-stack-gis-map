import api from "@/lib/api";
import { UserDashboard, Building } from '@/types/DashboardType';

// Define coordinate type for better type safety
interface Coordinates {
    lat: number;
    lng: number;
}

interface DistanceParams {
    start: Coordinates;
    end: Coordinates;
    mode?: "walk" | "drive";
    speed?: number;
}

export const DashboardService = {
    getStats: async () => {
        const response = await api.get("/dashboard/stats");
        return response.data;
    },

    addPlace: async (data: Building) => {
        const response = await api.post("/dashboard/add", data);
        return response.data;
    },

    // Calculate distance (with mode + speed)
    getDistance: async (start: any, end: any, mode: "walk" | "drive" = "drive", speed: number) =>
        (await api.post("/dashboard/distance", { start, end, mode, speed })).data,

    getBuildings: async (): Promise<Building[]> => {
        const response = await api.get("/dashboard/buildings");
        return response.data.buildings;
    },
};

export const UserService = {
    getProfile: async (): Promise<UserDashboard> => {
        const response = await api.get<UserDashboard>("/user/profile");
        return response.data as UserDashboard;
    },
};
