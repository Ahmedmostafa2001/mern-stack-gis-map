import React, { useState, useRef, useEffect } from 'react';
import { Viewer, Entity, PointGraphics, ScreenSpaceEventHandler, ScreenSpaceEvent, CameraFlyTo } from 'resium';
import * as Cesium from "cesium";
import { DashboardService } from "@/services/dashboard.service";
import { Building } from "@/types/DashboardType";
import api from "@/lib/api";
// Constants
const BUILDING_TYPES = [
    'Resort City',
    'Mountain',
    'Monastery',
    'Port City',
    'Border City',
    'Resort Town',
    'Archaeological Site',
    'Resort Area',
    'National Park'
];

const DEFAULT_COORDINATES = {
    latitude: 30.0444,
    longitude: 31.2357
};

const SINAI_COORDINATES = {
    latitude: 29.9158,
    longitude: 34.7299,
    height: 800000
};

const TRANSLATION_DELAY = 10000;

// Initialize Cesium token
if (process.env.NEXT_PUBLIC_CESIUM_TOKEN) {
    Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_TOKEN;
}

interface FormData extends Building {
    name_ar: string;
    name_fr: string;
}

const AddPlace: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        id: undefined,
        name: '',
        name_ar: '',
        name_fr: '',
        building_type: '',
        description: '',description_ar: '', description_fr: '',
        latitude: DEFAULT_COORDINATES.latitude,
        longitude: DEFAULT_COORDINATES.longitude,
        createdAt: new Date()
    });

    const [selectedPosition, setSelectedPosition] = useState<Cesium.Cartesian3 | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [terrainProvider, setTerrainProvider] = useState<any>(undefined);
    const viewerRef = useRef<any>(null);
    const translationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const descTranslationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load terrain on mount
    useEffect(() => {
        const loadTerrain = async () => {
            try {
                const terrain = Cesium.createWorldTerrain({
                    requestVertexNormals: true,
                    requestWaterMask: true,
                });
                setTerrainProvider(terrain);
            } catch (err) {
                console.warn("Terrain load failed, using ellipsoid:", err);
                setTerrainProvider(new Cesium.EllipsoidTerrainProvider());
            }
        };
        loadTerrain();
    }, []);

    // Initialize map
    useEffect(() => {
        if (typeof window !== "undefined") {
            (window as any).CESIUM_BASE_URL = "/cesium/";
        }

        const defaultPosition = Cesium.Cartesian3.fromDegrees(
            DEFAULT_COORDINATES.longitude,
            DEFAULT_COORDINATES.latitude
        );
        setSelectedPosition(defaultPosition);
        setIsMapReady(true);
    }, []);

    const updateFormData = (updates: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };


    // handle change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateFormData({id: 0, [name]: value });
    };

    // handle integar
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateFormData({ [name]: parseFloat(value) || 0 });
    };

    const translateText = async (text: string) => {
        try {
            // Retry-safe function for translation (429-aware)
            const translate = async (target: string) => {
                let retries = 2;
                while (retries > 0) {
                    try {
                        const res = await api.post("/translate", { text, target });
                        return res.data.translatedText;
                    } catch (err: any) {
                        if (err.response?.status === 429) {
                            console.warn(`Rate limit hit for ${target}. Retrying in 2s...`);
                            await new Promise((r) => setTimeout(r, 2000));
                            retries--;
                        } else throw err;
                    }
                }
                throw new Error(`Failed translating to ${target}`);
            };

            // Request Arabic and French translations sequentially to reduce load
            const [ar, fr] = await Promise.all([
                translate("ar"),
                translate("fr"),
            ]);

            return { ar, fr };
        } catch (err) {
            console.error("Translation failed:", err);
            return { ar: "", fr: "" };
        }
    };
    // on chnage on name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        updateFormData({ name: value });

        // Clear any existing pending translation
        if (translationTimeoutRef.current) {
            clearTimeout(translationTimeoutRef.current);
        }

        // Debounced translation trigger
        translationTimeoutRef.current = setTimeout(async () => {
            const { ar, fr } = await translateText(value);
            updateFormData({ name_ar: ar, name_fr: fr });
        }, TRANSLATION_DELAY);
    };

    const DescHandleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        updateFormData({ description: value });

        // Clear pending translation
        if (descTranslationTimeoutRef.current) {
            clearTimeout(descTranslationTimeoutRef.current);
        }

        // Debounced translation for description
        descTranslationTimeoutRef.current = setTimeout(async () => {
            const { ar, fr } = await translateText(value);
            updateFormData({ description_ar: ar, description_fr: fr });
        }, TRANSLATION_DELAY);
    };
    // map click
    const handleMapClick = (movement: any) => {
        const viewer = viewerRef.current?.cesiumElement;
        if (!viewer?.scene?.pickPosition) return;

        let pickedPosition = viewer.scene.pickPosition(movement.position);

        if (!Cesium.defined(pickedPosition)) {
            const ray = viewer.camera.getPickRay(movement.position);
            if (ray) {
                pickedPosition = viewer.scene.globe.pick(ray, viewer.scene);
            }
        }

        if (!Cesium.defined(pickedPosition)) {
            console.warn("Could not pick position on map");
            return;
        }

        const cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);

        updateFormData({ latitude, longitude });
        setSelectedPosition(pickedPosition);
    };

    // current location
    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude);

                updateFormData({ latitude, longitude });
                setSelectedPosition(newPosition);

                viewerRef.current?.cesiumElement?.camera.flyTo({
                    destination: newPosition,
                    duration: 2
                });
            },
            (error) => {
                alert('Unable to retrieve location. Enable location services.');
                console.error('Geolocation error:', error);
            }
        );
    };

    // fly with target
    const flyToPosition = (lat: number, lng: number) => {
        const position = Cesium.Cartesian3.fromDegrees(lng, lat);
        viewerRef.current?.cesiumElement?.camera.flyTo({
            destination: position,
            duration: 2
        });
    };
    // handle submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { name, building_type,   description, latitude, longitude } = formData;

        if (!name || !building_type || !latitude || !longitude ||!description) {
            alert("Please fill in all required fields.");
            return;
        }
        const lat  = parseFloat(String(formData.latitude));
        const long = parseFloat(String(formData.longitude));
        console.log(long , lat );
        try {
            await DashboardService.addPlace({
                name: formData.name,
                name_ar: formData.name_ar,
                name_fr: formData.name_fr,
                building_type: formData.building_type,
                description: formData.description,
                description_ar: formData.description_ar,
                description_fr: formData.description_fr,
                latitude: lat, // Convert to number
                longitude: long, // Convert to number
            });

            alert("Place added successfully!");
            resetForm();
        } catch (err) {
            console.error("Failed to save place:", err);
            alert("Failed to save place. Check console for errors.");
        }
    };

    // rest inputs
    const resetForm = () => {
        updateFormData({
            name: '',
            name_ar: '',
            name_fr: '',
            description:'',
            description_ar:'',
            description_fr:'',
            building_type: '',
            latitude: DEFAULT_COORDINATES.latitude,
            longitude: DEFAULT_COORDINATES.longitude
        });

        flyToPosition(
            DEFAULT_COORDINATES.latitude,
            DEFAULT_COORDINATES.longitude
        );

        const defaultPosition = Cesium.Cartesian3.fromDegrees(
            DEFAULT_COORDINATES.longitude,
            DEFAULT_COORDINATES.latitude
        );
        setSelectedPosition(defaultPosition);
    };


    return (
        <div className="min-h-screen w-screen bg-gray-50 py-8 overflow-y-auto">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Add New Place</h1>
                    <p className="text-gray-600 mt-2">Fill in details and select location on the 3D map</p>
                </div>

                <div className="bg-white text-black rounded-xl shadow-lg overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Name (English) *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={ formData.name }
                                        onChange={ handleNameChange }
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        placeholder="Enter place name"
                                    />
                                </div>

                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description (English) *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={ formData.description }
                                    onChange={ DescHandleChange }
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="Enter place description"
                                    rows={ 4 }
                                />
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description (Auto Translated)
                                    </label>
                                    <textarea
                                        disabled
                                        value={ formData.description_ar }
                                        className="w-full bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg mb-2"
                                        placeholder="Arabic description"
                                        rows={ 3 }
                                    />
                                    <textarea
                                        disabled
                                        value={ formData.description_fr }
                                        className="w-full bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg"
                                        placeholder="French description"
                                        rows={ 3 }
                                    />
                                </div>

                            </div>

                            {/* Right Column */ }
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Auto Translation
                                    </label>
                                    <input
                                        type="text"
                                        disabled
                                        value={ formData.name_ar }
                                        className="w-full bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Arabic translation"
                                    />
                                    <input
                                        type="text"
                                        disabled
                                        value={ formData.name_fr }
                                        className="w-full bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg mt-2"
                                        placeholder="French translation"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="building_type"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        Building Type *
                                    </label>
                                    <select
                                        id="building_type"
                                        name="building_type"
                                        value={ formData.building_type }
                                        onChange={ handleInputChange }
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    >
                                        <option value="">Select a type</option>
                                        { BUILDING_TYPES.map((type) => (
                                            <option key={ type } value={ type }>
                                                { type }
                                            </option>
                                        )) }
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="latitude"
                                               className="block text-sm font-medium text-gray-700 mb-1">
                                            Latitude
                                        </label>
                                        <input
                                            type="number"
                                            id="latitude"
                                            name="latitude"
                                            value={ formData.latitude }
                                            onChange={ handleNumberChange }
                                            step="any"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="longitude"
                                               className="block text-sm font-medium text-gray-700 mb-1">
                                            Longitude
                                        </label>
                                        <input
                                            type="number"
                                            id="longitude"
                                            name="longitude"
                                            value={ formData.longitude }
                                            onChange={ handleNumberChange }
                                            step="any"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={ useCurrentLocation }
                                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center"
                                >
                                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    Use Current Location
                                </button>
                            </div>
                        </div>

                        {/* Map Section */ }
                        <div className="mt-6">
                            <label className="block text-lg font-medium text-gray-700 mb-3">
                                Select Location on 3D Map
                            </label>
                            <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
                                { isMapReady && (
                                    <Viewer
                                        ref={ viewerRef }
                                        className="w-full h-full"
                                        homeButton={ false }
                                        timeline={ false }
                                        animation={ false }
                                        baseLayerPicker={ false }
                                        fullscreenButton={ false }
                                        vrButton={ false }
                                        geocoder={ false }
                                        infoBox={ false }
                                        sceneModePicker={ false}
                                        selectionIndicator={false}
                                        terrainProvider={terrainProvider}
                                        onReady={(viewer) => {
                                            viewer.scene.globe.depthTestAgainstTerrain = true;
                                        }}
                                    >
                                        {selectedPosition && (
                                            <Entity position={selectedPosition} name="Selected Location">
                                                <PointGraphics pixelSize={10} color={Cesium.Color.YELLOW} />
                                            </Entity>
                                        )}

                                        <CameraFlyTo
                                            destination={Cesium.Cartesian3.fromDegrees(
                                                SINAI_COORDINATES.longitude,
                                                SINAI_COORDINATES.latitude,
                                                SINAI_COORDINATES.height
                                            )}
                                            duration={3}
                                        />

                                        <ScreenSpaceEventHandler>
                                            <ScreenSpaceEvent
                                                action={handleMapClick}
                                                type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
                                            />
                                        </ScreenSpaceEventHandler>
                                    </Viewer>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Click on the map to set coordinates
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                            >
                                Add Place
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPlace;
