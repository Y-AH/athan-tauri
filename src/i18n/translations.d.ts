// translations.d.ts
import { countriesToISO } from '../lib/countries';
declare type Locale = "en" | "ar";

interface Translation {
    name: string;
    dir: "ltr" | "rtl";
    "prayerTimesPage.prayerNames.fajr": string;
    "prayerTimesPage.prayerNames.sunrise": string;
    "prayerTimesPage.prayerNames.dhuhr": string;
    "prayerTimesPage.prayerNames.asr": string;
    "prayerTimesPage.prayerNames.maghrib": string;
    "prayerTimesPage.prayerNames.isha": string;
    "prayerTimesPage.countdownText": string;
    "configPage.country": string;
    "configPage.city": string;
    "configPage.calculationMethod": string;
    "configPage.saveButton": string;
    "configPage.snackbarText": string;
    "configPage.language": string;
    "app.notificationTitle": string;
    "app.notificationBody": string;
    "app.configurations": string;
    "app.prayerTimes": string;
    "configPage.calculationMethod.MuslimWorldLeague": string;
    "configPage.calculationMethod.Egyptian": string;
    "configPage.calculationMethod.Karachi": string;
    "configPage.calculationMethod.UmmAlQura": string;
    "configPage.calculationMethod.Dubai": string;
    "configPage.calculationMethod.MoonsightingCommittee": string;
    "configPage.calculationMethod.NorthAmerica": string;
    "configPage.calculationMethod.Kuwait": string;
    "configPage.calculationMethod.Qatar": string;
    "configPage.calculationMethod.Singapore": string;
    "configPage.calculationMethod.Tehran": string;
    "configPage.calculationMethod.Turkey": string;
}

declare const translations: { [key in Locale]: Translation };

export default translations;
export { Locale, Translation };
export function translateCountry(country: keyof countriesToISO, locale: Locale): string;