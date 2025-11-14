'use client';
import { useRef, useState, useEffect } from 'react';
import { Viewer, Entity, CameraFlyTo, ScreenSpaceEventHandler, ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';
import type { Map3DProps, Point, Building } from '@/types/DashboardType';
import {useTranslation} from "react-i18next";


// Sinai coordinates
const SINAI_COORDINATES = {
  latitude: 29.9158,
  longitude: 34.7299,
  height: 700000
};
const TRANSLATION_DELAY = 500;
// Setup Ion access token
if (process.env.NEXT_PUBLIC_CESIUM_TOKEN) {
  Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_TOKEN;
}

export default function Map3DViewer({ buildings, startPoint, endPoint, onStartPoint, onEndPoint,currentLanguage }: Map3DProps) {
  const viewerRef = useRef<any>(null);
  const [flyTo, setFlyTo] = useState<Point | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [debugInfo, setDebugInfo] = useState('Initializing...');
  const [isReady, setIsReady] = useState(false);
  const [terrainProvider, setTerrainProvider] = useState<any>(undefined);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const { t, i18n } = useTranslation();


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
  const getUILabels = () => {
    const labels = {
      en: {
        type: 'Type',
        latitude: 'Latitude',
        longitude: 'Longitude',
        buildings: 'Buildings',
        description: 'description'
      },
      fr: {
        type: 'Type',
        latitude: 'Latitude',
        longitude: 'Longitude',
        buildings: 'Bâtiments',
        description: 'la description'
      },
      ar: {
        type: 'النوع',
        latitude: 'خط العرض',
        longitude: 'خط الطول',
        buildings: 'المباني',
        description: 'الوصف'
      }
    };

    return labels[currentLanguage as keyof typeof labels] || labels.en;
  };

  // ---------------------------------------------------------------------
  // Init Cesium environment + terrain
  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      (window as any).CESIUM_BASE_URL = "/cesium/";
      setDebugInfo("Cesium base URL set - initializing terrain...");
    }

    // -----------------------------------------------------------------
    const loadTerrain = async () => {
      try {
        const terrain = await Cesium.CesiumTerrainProvider.fromIonAssetId(1, {
          requestVertexNormals: true,
          requestWaterMask: true,
        });

        setTerrainProvider(terrain);
        setDebugInfo("🌍 World Terrain loaded successfully ✅");
      } catch (err) {
        console.warn("Terrain load failed, falling back to ellipsoid:", err);
        setTerrainProvider(new Cesium.EllipsoidTerrainProvider());
      }
    };

    loadTerrain();
  }, []);

  const handleViewerReady = (viewer: Cesium.Viewer) => {
    setIsReady(true);
    setDebugInfo('Viewer READY!');

    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.globe.enableLighting = true;
    viewer.scene.screenSpaceCameraController.enableZoom = false;

    setTimeout(() => {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
            SINAI_COORDINATES.longitude,
            SINAI_COORDINATES.latitude,
            SINAI_COORDINATES.height
        ),
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(-45),
          roll: 0
        },
        duration: 3
      });
    }, 1000);
  };

  // Handle map click - for both buildings and start/end points
  const handleClick = (movement: any) => {
    console.log("🖱️ Click detected:", movement);

    const viewer = viewerRef.current?.cesiumElement || viewerRef.current;
    if (!viewer) {
      setDebugInfo("❌ Viewer not ready for clicks");
      return;
    }

    // Check if a building entity was clicked
    const pickedObject = viewer.scene.pick(movement.position);

    if (pickedObject && pickedObject.id && pickedObject.id._name) {
      // Building was clicked
      const buildingName = pickedObject.id._name;
      const building = buildings.find(b => b.name === buildingName);

      if (building) {
        setSelectedBuilding(building);
        setDebugInfo(`🏢 Selected: ${building.name}`);

        // Fly to the building
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
              building.longitude,
              building.latitude,
              1500
          ),
          duration: 2
        });
        return;
      }
    }

    // If no building clicked, handle start/end point selection
    const cartesian =
        viewer.scene.pickPosition(movement.position) ||
        viewer.camera.pickEllipsoid(movement.position);

    if (!cartesian) {
      setDebugInfo("⚠️ Clicked but no valid terrain point");
      return;
    }

    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    const lat = Cesium.Math.toDegrees(cartographic.latitude);
    const lng = Cesium.Math.toDegrees(cartographic.longitude);

    if (!startPoint && onStartPoint) {
      onStartPoint({ lat, lng });
      setDebugInfo(`✅ Start Point: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } else if (!endPoint && onEndPoint) {
      onEndPoint({ lat, lng });
      setDebugInfo(`✅ End Point: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  // Camera control helpers
  const zoomIn = () => viewerRef.current?.cesiumElement?.camera?.zoomIn(100000);
  const zoomOut = () => viewerRef.current?.cesiumElement?.camera?.zoomOut(100000);
  const resetView = () => {
    viewerRef.current?.cesiumElement?.camera?.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
          SINAI_COORDINATES.longitude,
          SINAI_COORDINATES.latitude,
          SINAI_COORDINATES.height
      ),
      duration: 2
    });
    setSelectedBuilding(null);
  };

  const flyToPlace = (building: Building) => {
    viewerRef.current?.cesiumElement?.camera?.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(building.longitude, building.latitude, 1500),
      duration: 2
    });
    setSelectedBuilding(building);
    setDebugInfo(`Flying to ${building.name}`);
  };
// ------------------------------------------------------------------


  if (!isClient) return <div className="p-10 text-center">Loading 3D Map...</div>;
  const getBuildingName = (building: typeof buildings[0]) => {
    if (currentLanguage === "ar" && building.name_ar) {
      return building.name_ar;
    }
    if (currentLanguage === "fr" && building.name_fr) {
      return building.name_fr;
    }
    return building.name;
  };
  const getBuildingDesc = (building: typeof buildings[0]) => {
    if (currentLanguage === "ar" && building.description_ar) {
      return building.description_ar;
    }
    if (currentLanguage === "fr" && building.description_fr) {
      return building.description_fr;
    }
    return building.description;
  };
  const getBuildingType = (building) => {
    const type = building.building_type;
    if (!type) return 'N/A';

    // Find the index of this type in English list
    const index = BUILDING_TYPES.en.indexOf(type);
    if (index === -1) return type; // fallback if not found

    // Return translation based on language
    if (currentLanguage === 'ar') return BUILDING_TYPES.ar[index];
    if (currentLanguage === 'fr') return BUILDING_TYPES.fr[index];
    return BUILDING_TYPES.en[index];
  };

  const isRTL = currentLanguage === 'ar';
  const labels = getUILabels();


  return (
      <div className="w-full h-full relative" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Debug Info */}
        <div className={`absolute top-2 z-50 bg-black/70 text-white p-3 rounded text-sm max-w-md ${
            isRTL ? 'right-2' : 'left-2'
        }`}>
          <div><b>Debug:</b> {debugInfo}</div>
        </div>
        {/* Building Info Panel */}
        {selectedBuilding && (
            <div className="absolute top-70 right-2 z-50 bg-black/90 text-white p-4 rounded-lg shadow-lg max-w-sm">
              <button
                  onClick={ () => setSelectedBuilding(null) }
                  className="absolute top-0 pb-10 right-2 text-white hover:text-red-500 text-xl font-bold"
              >
                ×
              </button>
              <h3 className="font-bold text-lg mb-2 mt-2">🏢 { getBuildingName(selectedBuilding) }</h3>
              <div className="space-y-1 text-sm">
                <p><b>{ labels.type }:</b> { getBuildingType(selectedBuilding) }</p>
                <p><b>{ labels.latitude }:</b> { selectedBuilding.latitude.toFixed(4) }°</p>
                <p><b>{ labels.longitude }:</b> { selectedBuilding.longitude.toFixed(4) }°</p>
                { selectedBuilding.description && (
                    <p><b>{ labels.description }:</b> { getBuildingDesc(selectedBuilding) }</p>
                ) }
              </div>
            </div>
        ) }

        {/* Zoom Controls */ }
        <div className="absolute top-20 right-2 z-50 flex flex-col gap-2">
          <button onClick={ zoomIn } className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded shadow">+
          </button>
          <button onClick={ zoomOut } className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded shadow">−
          </button>
          <button onClick={ resetView } className="bg-gray-700 hover:bg-gray-800 text-white w-10 h-10 rounded shadow">⟲</button>
        </div>

        {/* Famous Places Quick Access */}
        <div className="absolute bottom-2 left-2 z-50 bg-black/70 text-white p-3 rounded max-w-md">
          <h3 className="font-bold mb-2">🏜️ Buildings ({buildings.length})</h3>
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {buildings.map((building) => (
                <button
                    key={building.name}
                    onClick={() => flyToPlace(building)}
                    className={`px-2 py-1 rounded text-xs transition ${
                        selectedBuilding?.name === building.name
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  {currentLanguage == 'ar' ? building.name_ar :currentLanguage == 'fr'? building.name_fr : building.name_fr ? building.name :""}
                </button>
            ))}
          </div>
        </div>

        <Viewer
            ref={viewerRef}
            className="w-full h-full"
            timeline={false}
            animation={false}
            baseLayerPicker={true}
            terrainProvider={terrainProvider}
            onReady={handleViewerReady}
        >
          <ScreenSpaceEventHandler useDefault>
            <ScreenSpaceEvent
                action={handleClick}
                type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
            />
          </ScreenSpaceEventHandler>

          <CameraFlyTo
              destination={Cesium.Cartesian3.fromDegrees(
                  SINAI_COORDINATES.longitude,
                  SINAI_COORDINATES.latitude,
                  SINAI_COORDINATES.height
              )}
              duration={3}
          />

          {/* Render Building Points */}
          {buildings.map((building) => (
              <Entity
                  key={building.name}
                  name={building.name}
                  position={Cesium.Cartesian3.fromDegrees(
                      building.longitude,
                      building.latitude,
                      0
                  )}
                  point={{
                    pixelSize: 20,
                    color: selectedBuilding?.name === getBuildingName(building.name)
                        ? Cesium.Color.YELLOW
                        : Cesium.Color.ORANGE,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 3,
                  }}
                  label={{
                    text: currentLanguage === 'ar' ? building.name_ar : currentLanguage === 'fr' ? building.name_fr : building.name,
                    font: currentLanguage === 'ar' ? '14px "Noto Sans Arabic", sans-serif' : '14px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -20),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                  }}
              />
          ))}

          {/* Start Point */}
          {startPoint && (
              <Entity
                  name="Start Point"
                  position={Cesium.Cartesian3.fromDegrees(startPoint.lng, startPoint.lat, 0)}
                  point={{
                    pixelSize: 15,
                    color: Cesium.Color.GREEN,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                  }}
              />
          )}

          {/* End Point */}
          {endPoint && (
              <Entity
                  name="End Point"
                  position={Cesium.Cartesian3.fromDegrees(endPoint.lng, endPoint.lat, 0)}
                  point={{
                    pixelSize: 15,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                  }}
              />
          )}

          {/* Path Line */}
          {startPoint && endPoint && (
              <Entity
                  name="Path"
                  polyline={{
                    positions: Cesium.Cartesian3.fromDegreesArray([
                      startPoint.lng,
                      startPoint.lat,
                      endPoint.lng,
                      endPoint.lat,
                    ]),
                    width: 3,
                    material: Cesium.Color.CYAN,
                  }}
              />
          )}
        </Viewer>
      </div>
  );
}
