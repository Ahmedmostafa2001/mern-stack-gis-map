// src/utils/geo.utils.ts

// Haversine formula fallback
export function calculateDistanceJS(start: { lat: number; lng: number }, end: { lat: number; lng: number }): number {
    const toRad = (x: number) => (x * Math.PI) / 180;

    const R = 6371; // km
    const dLat = toRad(end.lat - start.lat);
    const dLon = toRad(end.lng - start.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(start.lat)) * Math.cos(toRad(end.lat)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Example using PostGIS via Prisma raw query
import prisma from "../config/db";
export async function calculateDistancePostGIS(start: { lat: number; lng: number }, end: { lat: number; lng: number }): Promise<number> {
    const result: any = await prisma.$queryRaw`
    SELECT ST_Distance(
      ST_SetSRID(ST_MakePoint(${start.lng}, ${start.lat}), 4326)::geography,
      ST_SetSRID(ST_MakePoint(${end.lng}, ${end.lat}), 4326)::geography
    ) AS distance;
  `;
    return parseFloat(result[0].distance) / 1000; // meters → km
}

// Rough estimate time: assume 50 km/h for example
// utils/geo.ts

// utils/geo.ts

export function estimateTime(distanceKm: number, mode: string, s?: number) {
    if (!distanceKm || isNaN(distanceKm)) {
        return { timeString: "0 minutes", minutes: 0 };
    }

    // Default speeds
    const speeds: Record<string, number> = {
        walk: 5,    // km/h
        drive: s && s > 0 ? s : 80, // fallback to 80 if user didn’t set speed
    };

    const speed = speeds[mode] || speeds.drive;
    const hours = distanceKm / speed;
    const minutes = Math.round(hours * 60);

    let timeString = "";
    if (minutes < 60) {
        timeString = `${minutes} minutes`;
    } else if (minutes < 1440) {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        timeString = `${h}h ${m}m`;
    } else {
        const d = Math.floor(minutes / 1440);
        const h = Math.floor((minutes % 1440) / 60);
        const m = minutes % 60;
        timeString = `${d}d ${h}h ${m}m`;
    }

    return { timeString, minutes };
}
