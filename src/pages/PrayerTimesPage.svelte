<script>
    import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";
    import { t, locale } from "../i18n/i18n";

    /**
     * Current date and time.
     * @type {Date}
     */
    export let currentDate = new Date();

    export let userCoordinates = new Coordinates(0, 0);
    export let calcualtionParameters = CalculationMethod.Kuwait();

    export let prayerTimes = null;

    $: upcomingPrayer = prayerTimes?.nextPrayer(new Date());
    $: nextPrayerTime =
        upcomingPrayer === "none"
            ? new PrayerTimes(
                  userCoordinates,
                  new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      currentDate.getDate() + 1
                  ),
                  calcualtionParameters
              ).timeForPrayer("fajr")
            : prayerTimes?.timeForPrayer(upcomingPrayer);

    /**
     * Convert milliseconds to formatted time string.
     * @param {number} ms - Time in milliseconds.
     * @returns {string} Formatted time string.
     */
    function msToFormattedTime(ms) {
        const totalSecs = Math.floor(ms / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const remainingSecs = totalSecs % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
    }

    /**
     * Format date to display time in 12-hour format.
     * @param {Date} date - Date to format.
     * @returns {string} Time in AM/PM format.
     */
    function formatTimeWithAMPM(date) {
        return new Intl.DateTimeFormat($locale, { hour: '2-digit', minute: '2-digit', hour12: true }).format(date);
    }
</script>

<main class="panel">
    <div>
        <div
            class:highlight={upcomingPrayer === "fajr" ||
                upcomingPrayer === "none"}
            class="prayer"
        >
            <span>{$t("prayerTimesPage.prayerNames.fajr")}:</span>
            <span class="prayer-time"
                >{formatTimeWithAMPM(prayerTimes.fajr)}</span
            >
            <!-- <button class="pause-button" /> -->
        </div>
        <div class:highlight={upcomingPrayer === "sunrise"} class="prayer">
            <span>{$t("prayerTimesPage.prayerNames.sunrise")}:</span>
            <span class="prayer-time"
                >{formatTimeWithAMPM(prayerTimes.sunrise)}</span
            >
            <!-- <button class="pause-button" /> -->
        </div>
        <div class:highlight={upcomingPrayer === "dhuhr"} class="prayer">
            <span>{$t("prayerTimesPage.prayerNames.dhuhr")}:</span>
            <span class="prayer-time"
                >{formatTimeWithAMPM(prayerTimes.dhuhr)}</span
            >
            <!-- <button class="pause-button" /> -->
        </div>
        <div class:highlight={upcomingPrayer === "asr"} class="prayer">
            <span>{$t("prayerTimesPage.prayerNames.asr")}:</span>
            <span class="prayer-time"
                >{formatTimeWithAMPM(prayerTimes.asr)}</span
            >
            <!-- <button class="pause-button" /> -->
        </div>
        <div class:highlight={upcomingPrayer === "maghrib"} class="prayer">
            <span>{$t("prayerTimesPage.prayerNames.maghrib")}:</span>
            <span class="prayer-time"
                >{formatTimeWithAMPM(prayerTimes.maghrib)}</span
            >
            <!-- <button class="pause-button" /> -->
        </div>
        <div class:highlight={upcomingPrayer === "isha"} class="prayer">
            <span>{$t("prayerTimesPage.prayerNames.isha")}:</span>
            <span class="prayer-time"
                >{formatTimeWithAMPM(prayerTimes.isha)}</span
            >
            <!-- <button class="pause-button" /> -->
        </div>
    </div>
    <div class="countdown">
        {$t("prayerTimesPage.countdownText")}
        {msToFormattedTime(nextPrayerTime.getTime() - Date.now())}
    </div>
</main>
