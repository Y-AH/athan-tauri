// translations.js

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
        "app.prayerTimes": "Prayer Times"
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
        "app.prayerTimes": "أوقات الصلاة"

    }
};

export default translations;