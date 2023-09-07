// translations.d.ts

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
}

declare const translations: { [key in Locale]: Translation };

export default translations;
export { Locale, Translation };
