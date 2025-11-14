"use client";

import { useTranslation } from "react-i18next";
import { SidebarProps, UserDashboard } from '@/types/DashboardType';
import {UserService} from '@/services/dashboard.service';
import { useEffect, useState } from 'react';
import Link from "next/link";
import  AuthService from "@/services/auth.service";
import {router} from "next/client";


// Fallback translations
const fallbackTranslations = {
  en: {
    title: "Sinai GIS Map",
    buildings: "Buildings",
    noBuildings: "No buildings available",
    addBuilding: " Add new location",
    calculate: "Calculate Distance & Time",
    clickMap: "Click on the map to select points",
    startPoint: "x Point",
    endPoint: "End Point",
    notSelected: "Not selected",
    clear: "Clear",
    distance: "Distance",
    time: "Time",
    km: "km",
    minutes: "minutes",
    results: "Results",
  },
  fr: {
    title: "Carte GIS du Sinaï",
    buildings: "Bâtiments",
    noBuildings: "Aucun bâtiment disponible",
    addBuilding: " Ajouter un nouvel emplacement",
    calculate: "Calculer la Distance et le Temps",
    clickMap: "Cliquez sur la carte pour sélectionner des points",
    startPoint: "Point de Départ",
    endPoint: "Point d'Arrivée",
    notSelected: "Non sélectionné",
    clear: "Effacer",
    distance: "Distance",
    time: "Temps",
    km: "km",
    minutes: "minutes",
    results: "Résultats",
  },
  ar: {
    title: "خريسة سيناء الجغرافية",
    buildings: "المباني",
    noBuildings: "لا توجد مباني متاحة",
    addBuilding: " اضافة منطقة",
    calculate: "حساب المسافة والوقت",
    clickMap: "انقر على الخريطة لتحديد النقاط",
    startPoint: "نقطة البداية",
    endPoint: "نقطة النهاية",
    mode:"النظام",
    drive:"القيادة",
    walk:"المشي",
    msgSpeed:"السرعة لم تحدد - تم التعيين الافتراضي إلى 80 كم/س",
    speedPlaceHolder:"تعيين السرعة بالكيلومترات في الساعة",
    currentSpeed:"السرعة الحالية",
    estimate:"متبقي ",
    notSelected: "غير محدد",
    clear: "مسح",
    distance: "المسافة",
    time: "الوقت",
    km: "كم",
    minutes: "دقائق",
    hour:"الساعة",
    results: "النتائج",
  }
};

const BUILDING_TYPES = {
  en: [
    'Resort City',
    'Mountain',
    'Monastery',
    'Port City',
    'Border City',
    'Resort Town',
    'Archaeological Site',
    'Resort Area',
    'National Park'
  ],
  ar: [
    'مدينة منتجع',
    'جبل',
    'دير',
    'مدينة ساحلية',
    'مدينة حدودية',
    'بلدة منتجع',
    'موقع أثري',
    'منطقة منتجعات',
    'حديقة وطنية'
  ],
  fr: [
    'Ville touristique',
    'Montagne',
    'Monastère',
    'Ville portuaire',
    'Ville frontalière',
    'Ville de villégiature',
    'Site archéologique',
    'Zone de villégiature',
    'Parc national'
  ]
}

export default function Sidebar({
                                  buildings = [],
                                  startPoint = null,
                                  endPoint = null,
                                  mode = "drive",
                                  setMode = () => {},
                                  speed = 80,
                                  setSpeed = () => {},
                                  distance = null,
                                  time = null,
                                  onCalculate,
                                  onClear,
                                }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [userInfo, setUserInfo] = useState<UserDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  // Safe translation function with fallbacks
 const safeT = (key: string, defaultValue?: string) => {
    const translation = t(key, defaultValue);
    // If translation returns the key (meaning not found), use fallback
    if (translation === key && fallbackTranslations[i18n.language]) {
      const keys = key.split('.');
      let value: any = fallbackTranslations[i18n.language];
      for (const k of keys) {
        value = value?.[k];
      }
      return value || defaultValue || key;
    }
    return translation;
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  };

  const getBuildingName = (building: typeof buildings[0]) => {
    if (i18n.language === "ar" && building.name_ar) {
      return building.name_ar;
    }
    if (i18n.language === "fr" && building.name_fr) {
      return building.name_fr;
    }
    return building.name;
  };

  const getBuildingType = (building) => {
    const type = building.building_type;
    if (!type) return 'N/A';

    // Find the index of this type in English list
    const index = BUILDING_TYPES.en.indexOf(type);
    if (index === -1) return type; // fallback if not found

    // Return translation based on language
    if (i18n.language === 'ar') return BUILDING_TYPES.ar[index];
    if (i18n.language === 'fr') return BUILDING_TYPES.fr[index];
    return BUILDING_TYPES.en[index];
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await UserService.getProfile();
        setUserInfo(data);
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  const handleLogout = () => {
    try {
      AuthService.logout() // removes token and clears axios header
      router.push("/login"); // redirect to login page
    } catch (err) {
      console.error("Logout failed", err);
      setError("Failed to logout. Try again.");
    }
  };
  return (
    <div
      className="sidebar bg-gradient-to-b from-gray-50 to-white shadow-xl border-l border-gray-200 overflow-y-auto h-screen"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {/* Header Section */}
      <div className="header bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-white">🗺️</span>
            {safeT("title")}
          </h1>

          <div className="language-selector flex gap-1 bg-white/20 rounded-lg p-1">
            {["en", "fr", "ar"].map((lng) => (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  i18n.language === lng
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                aria-label={`Switch to ${lng}`}
              >
                {lng === "ar" ? "ع" : lng.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <Link
            href="/dashboard/stats"
            className="group flex items-center justify-between w-full p-4 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 text-white shadow-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-400/30 relative overflow-hidden"
        >
          {/* Animated background shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          <div className="flex items-center gap-3 relative z-10">
            {/* Status Icon */}
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>

            {/* Text */}
            <span className="font-semibold">Status</span>
          </div>

          {/* Status indicator or arrow */}
          <div className="flex items-center gap-2 relative z-10">
            {/* Live indicator dot */}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white/70 hidden group-hover:block transition-all duration-300">Live</span>
            </div>

            {/* Arrow icon */}
            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      <div className="p-6 space-y-6">

        {/* Buildings Section */ }
        <div className="section">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">🏛️</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              { safeT("buildings") }
            </h2>
            <span
                className="items-center text-xs font-medium bg-blue-800 text-white rounded-full inline-flex px-2.5 py-0.5">
              { buildings.length }
            </span>

            <span
                className=" ml-auto text-sm font-medium">
              <Link href="/dashboard/add-place" className="text-blue-400 hover:underline">
                { safeT("addBuilding") } +
              </Link>
            </span>
          </div>

          <div className="buildings-list space-y-3 max-h-72 overflow-y-auto pr-2">
            { buildings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🏢</div>
                  <p className="text-sm">{ safeT("noBuildings") }</p>
                </div>
            ) : (
                buildings.map((building) => (
                    <div
                        key={ building.id }
                        className="building-item group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div
                              className="font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                            { getBuildingName(building) }
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                            <span className="text-gray-500 text-xs font-medium">
                          { getBuildingType(building) }
                        </span>
                          </div>
                        </div>
                      </div>
                    </div>
                ))
            ) }
          </div>
        </div>

        {/* Navigation Calculator Section */ }
        <div className="section bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📍</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              { safeT("calculate") }
            </h2>
          </div>

          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            { safeT("clickMap", "Click on the map to select start and end points for navigation") }
          </p>


          {/* Action Buttons */ }
          <div className="flex gap-3 mb-4">
            { startPoint && endPoint && (
                <button
                    className="btn-primary flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                    onClick={ onCalculate }
                >
                  <span>🚀</span>
                  { safeT("calculate") }
                </button>
            ) }
            { (startPoint || endPoint) && (
                <button
                    className="btn-secondary bg-white text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium border border-gray-300 hover:border-gray-400 active:scale-95 flex items-center justify-center gap-2"
                    onClick={ onClear }
                >
                  <span>🗑️</span>
                  { safeT("clear") }
                </button>
            ) }
          </div>

          {/* Results Display */ }
          { distance !== null && time !== null && (
              <div className="results bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{ safeT("results") }</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {/* Distance */ }
                      <span className="result-label">{ t('distance') }:</span>
                    </div>
                    <div className="text-xs text-green-700 font-medium uppercase tracking-wide">
                      <span className="result-value">{ distance } { t('km') }</span>
                    </div>
                  </div>

                  {/* Time */ }
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      <span className="result-label">{ t('time') }:</span>
                    </div>
                    <div className="text-xs text-blue-700 font-medium uppercase tracking-wide">
                      <span className="result-value">{ time } { t('minutes') }</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <span>⏱️</span>
                    { mode === "walk"
                        ? i18n.language === "ar"
                            ? "وقت المشي"
                            : i18n.language === "fr"
                                ? "temps de marche"
                                : "walking time"
                        : i18n.language === "ar"
                            ? "وقت القيادة"
                            : i18n.language === "fr"
                                ? "temps de conduite"
                                : "driving time" }
                  </div>

                </div>
              </div>
          ) }
        </div>

        {/* Travel Mode Selector */ }
        <div className="mb-6">
          <label className="block text-lg font-bold text-gray-700 mb-2">
            { safeT("mode") }
          </label>

          <hr className="my-3 border-gray-300"/>

          <div className="results bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
            <div className="flex flex-col items-center gap-2 mb-3">
              { speed === 0 || !speed ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="text-red-600 text-sm font-medium">
                      { i18n.language === "ar" ? safeT("msgSpeed") : i18n.language === "fr" ? "Vitesse non spécifiée - valeur par défaut fixée à 80 km/h." : "Speed not specified - default value set to 80 km/h" }.
                    </p>
                  </div>
              ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{ i18n.language === "ar" ? safeT("currentSpeed") : i18n.language === "fr" ? "Vitesse actuelle " : " Current speed" }{ " " }<span
                        className="text-blue-600">{ speed } { i18n.language == "ar" ? safeT("km", "km") : i18n.language == "fr" ? "km" : "km" }/{ i18n.language == "ar" ? safeT("hour") : i18n.language == "fr" ? "heure" : " hour" }</span>
                    </h3>
                  </div>
              ) }
            </div>
          </div>

          <hr className="my-3 border-gray-300"/>

          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                  className={ `px-3 py-1 rounded-md text-sm font-medium border transition-all duration-200 ${
                      mode === "drive"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }` }
                  onClick={ () => setMode("drive") }
              >
                🚗 { i18n.language === "ar" ? safeT("drive") : i18n.language === "fr" ? "la voiture" : " Car" }
              </button>

              <button
                  className={ `px-3 py-1 rounded-md text-sm font-medium border transition-all duration-200 ${
                      mode === "walk"
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }` }
                  onClick={ () => setMode("walk") }
              >
                🚶 { i18n.language === "ar" ? safeT("walk") : i18n.language === "fr" ? "marcher " : "walk" }
              </button>
            </div>

            { mode === "drive" && (
                <>
                  <input
                      type="number"
                      min="10"
                      max="300"
                      placeholder={
                        i18n.language === "ar"
                            ? safeT("speedPlaceHolder", "أدخل السرعة (كم/س)")
                            : i18n.language === "fr"
                                ? "Vitesse de la voiture (km/h)"
                                : "Set speed in km/h"
                      }
                      className="p-2 w-48 rounded-md border border-gray-300 text-sm text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 outline-none"
                      value={ speed ?? "" }
                      onChange={ (e) => setSpeed(Number(e.target.value)) }
                  />


                </>
            ) }


          </div>

        </div>


        {/* User Info Section */ }
        <div className="mt-4 text-black rounded-lg p-3 flex items-center gap-3">
          { loading ? (
              <p className="text-blue-100 text-sm">Loading user info...</p>
          ) : userInfo ? (
              <>
                <div className="w-10 h-10  rounded-full flex items-center justify-center text-lg">
                  👤
                </div>
                <div>
                  <p className="text-black/70  font-semibold text-sm">
                    { userInfo.name || "Unknown User" }
                  </p>
                  <p className="text-black/70 text-xs">
                    { userInfo.email || "No email provided" }
                  </p>
                </div>
              </>
          ) : (
              <p className="text-red-200 text-sm">User data unavailable</p>
          ) }
          <button
              onClick={ handleLogout }
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-md transition-transform duration-300 hover:scale-110 flex items-center justify-center"
              title="Logout"
          >
            {/* Logout Icon SVG */ }
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={ 2 }
            >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
          </button>


        </div>

      </div>
    </div>
  );
}
