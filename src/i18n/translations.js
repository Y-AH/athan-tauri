// translations.js
import isoCountries from "i18n-iso-countries";
import isoEn from "i18n-iso-countries/langs/en.json";
import isoAr from "i18n-iso-countries/langs/ar.json";
import { countriesToISO } from "../lib/countries";

isoCountries.registerLocale(isoAr);
isoCountries.registerLocale(isoEn);

/**
 * 
 * @param {keyof countriesToISO} country
 * @param {import("./translations").Locale} locale
 */
export function translateCountry(country, locale) {
    console.log({country, iso: countriesToISO[country], locale});
    return isoCountries.getName(countriesToISO[country], locale);
}

/** @type {{ [key in import("./translations").Locale]: import("./translations").Translation }} */
const translations = {
    en: {
        name: "English",
        dir: "ltr",
        "prayerTimesPage.prayerNames.fajr": "Fajir",
        "prayerTimesPage.prayerNames.sunrise": "Sunrise",
        "prayerTimesPage.prayerNames.dhuhr": "Duhr",
        "prayerTimesPage.prayerNames.asr": "Asr",
        "prayerTimesPage.prayerNames.maghrib": "Maghrib",
        "prayerTimesPage.prayerNames.isha": "Isha",
        "prayerTimesPage.countdownText": "Time until next prayer",
        "configPage.country": "Country",
        "configPage.city": "City",
        "configPage.calculationMethod": "Calculation Method",
        "configPage.saveButton": "Save",
        "configPage.snackbarText": "Configurations Saved!",
        "configPage.language": "Language",
        "app.notificationTitle": "🕌 It's {{prayer}} 🕋 time.",
        "app.notificationBody": "🚶‍♂️ Get up, 🛑 take a break, and 🙏 pray.",
        "app.configurations": "Configurations",
        "app.prayerTimes": "Prayer Times",
        "configPage.calculationMethod.MuslimWorldLeague": "Muslim World League",
        "configPage.calculationMethod.Egyptian": "Egyptian",
        "configPage.calculationMethod.Karachi": "Karachi",
        "configPage.calculationMethod.UmmAlQura": "Umm Al-Qura",
        "configPage.calculationMethod.Dubai": "Dubai",
        "configPage.calculationMethod.MoonsightingCommittee": "Moonsighting Committee",
        "configPage.calculationMethod.NorthAmerica": "North America",
        "configPage.calculationMethod.Kuwait": "Kuwait",
        "configPage.calculationMethod.Qatar": "Qatar",
        "configPage.calculationMethod.Singapore": "Singapore",
        "configPage.calculationMethod.Tehran": "Tehran",
        "configPage.calculationMethod.Turkey": "Turkey"
    },
    ar: {
        name: "العربية",
        dir: "rtl",
        "prayerTimesPage.prayerNames.fajr": "الفجر",
        "prayerTimesPage.prayerNames.sunrise": "الشروق",
        "prayerTimesPage.prayerNames.dhuhr": "الظهر",
        "prayerTimesPage.prayerNames.asr": "العصر",
        "prayerTimesPage.prayerNames.maghrib": "المغرب",
        "prayerTimesPage.prayerNames.isha": "العشاء",
        "prayerTimesPage.countdownText": "الوقت حتى الصلاة القادمة",
        "configPage.country": "الدولة",
        "configPage.city": "المدينة",
        "configPage.calculationMethod": "طريقة الحساب",
        "configPage.saveButton": "حفظ",
        "configPage.snackbarText": "تم حفظ الإعدادات!",
        "configPage.language": "اللغة",
        "app.notificationTitle": "🕌 حان وقت {{prayer}} 🕋.",
        "app.notificationBody": "🚶‍♂️ قم، 🛑 خذ استراحة، و 🙏 صل.",
        "app.configurations": "الإعدادات",
        "app.prayerTimes": "أوقات الصلاة",
        "configPage.calculationMethod.MuslimWorldLeague": "رابطة العالم الإسلامي",
        "configPage.calculationMethod.Egyptian": "المصرية",
        "configPage.calculationMethod.Karachi": "كراتشي",
        "configPage.calculationMethod.UmmAlQura": "أم القرى",
        "configPage.calculationMethod.Dubai": "دبي",
        "configPage.calculationMethod.MoonsightingCommittee": "لجنة الرؤية",
        "configPage.calculationMethod.NorthAmerica": "أمريكا الشمالية",
        "configPage.calculationMethod.Kuwait": "الكويت",
        "configPage.calculationMethod.Qatar": "قطر",
        "configPage.calculationMethod.Singapore": "سنغافورة",
        "configPage.calculationMethod.Tehran": "طهران",
        "configPage.calculationMethod.Turkey": "تركيا"
    }
};

export default translations;