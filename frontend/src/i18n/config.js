import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: 'Sinai GIS Map',
      buildings: 'Buildings',
      noBuildings: 'No buildings available',
      selectStart: 'Select Start Point',
      selectEnd: 'Select End Point',
      calculate: 'Calculate Distance & Time',
      distance: 'Distance',
      time: 'Estimated Time',
      km: 'km',
      minutes: 'minutes',
      clickMap: 'Click on the map to select points',
      startPoint: 'Start Point',
      endPoint: 'End Point',
      clear: 'Clear',
      language: 'Language',
      buildingType: {
        academic: 'Academic Building',
        administrative: 'Administrative',
        religious: 'Religious',
        landmark: 'Landmark',
        airport: 'Airport',
        commercial: 'Commercial',
        library: 'Library',
        dormitory: 'Dormitory',
        cafeteria: 'Cafeteria',
        sports: 'Sports Facility',
        park: 'Park',
        general: 'General',
        other: 'Other'
      }
    }
  },
  fr: {
    translation: {
      title: 'Carte SIG du Sinaï',
      buildings: 'Bâtiments',
      noBuildings: 'Aucun bâtiment disponible',
      selectStart: 'Sélectionner le point de départ',
      selectEnd: 'Sélectionner le point d\'arrivée',
      calculate: 'Calculer la distance et le temps',
      distance: 'Distance',
      time: 'Temps estimé',
      km: 'km',
      minutes: 'minutes',
      clickMap: 'Cliquez sur la carte pour sélectionner des points',
      startPoint: 'Point de départ',
      endPoint: 'Point d\'arrivée',
      clear: 'Effacer',
      language: 'Langue',
      buildingType: {
        academic: 'Bâtiment académique',
        administrative: 'Administratif',
        religious: 'Religieux',
        landmark: 'Point de repère',
        airport: 'Aéroport',
        commercial: 'Commercial',
        library: 'Bibliothèque',
        dormitory: 'Dortoir',
        cafeteria: 'Cafétéria',
        sports: 'Installation sportive',
        park: 'Parc',
        general: 'Général',
        other: 'Autre'
      }
    }
  },
  ar: {
    translation: {
      title: 'خريطة نظم المعلومات الجغرافية لسيناء',
      buildings: 'المباني',
      noBuildings: 'لا توجد مباني متاحة',
      selectStart: 'اختر نقطة البداية',
      selectEnd: 'اختر نقطة النهاية',
      calculate: 'احسب المسافة والوقت',
      distance: 'المسافة',
      time: 'الوقت المقدر',
      km: 'كم',
      minutes: 'دقائق',
      clickMap: 'انقر على الخريطة لاختيار النقاط',
      startPoint: 'نقطة البداية',
      endPoint: 'نقطة النهاية',
      clear: 'مسح',
      language: 'اللغة',
      buildingType: {
        academic: 'مبنى أكاديمي',
        administrative: 'إداري',
        religious: 'ديني',
        landmark: 'معلم',
        airport: 'مطار',
        commercial: 'تجاري',
        library: 'مكتبة',
        dormitory: 'سكن',
        cafeteria: 'كافتيريا',
        sports: 'منشأة رياضية',
        park: 'حديقة',
        general: 'عام',
        other: 'أخرى'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
