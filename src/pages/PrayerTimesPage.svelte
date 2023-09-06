<script>
    import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";

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
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        return `${(hours % 12 || 12).toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")} ${ampm}`;
    }

    /**
     * Check if it's been a specified duration since the given prayer time.
     * @param {Date} prayerTime - Time of the prayer.
     * @param {number} amount - Amount of the duration.
     * @param {("ms"|"s"|"m"|"h")} [unit="ms"] - Unit of the duration.
     * @returns {boolean} Whether it's been the specified duration.
     */
    function sinceLastPrayer(prayerTime, amount, unit = "ms") {
        const conversion = {
            ms: 1,
            s: 1000,
            m: 60000,
            h: 3600000,
        };
        const durationMs = amount * conversion[unit];
        return Date.now() - prayerTime.getTime() <= durationMs;
    }
</script>

<main class="panel">
    <div>
        <div class:highlight={upcomingPrayer === "fajr" || upcomingPrayer === 'none'} class="prayer">
            <span>Fajir:</span>
            <span class="prayer-time"
                >{formatTimeWithAMPM(prayerTimes.fajr)}</span
            >
            <!-- <button class="pause-button" /> -->
        </div>
        <div class:highlight={upcomingPrayer === "sunrise"} class="prayer">
            <span>Sunrise:</span>
            <span class="prayer-time"
                >{formatTimeWithAMPM(prayerTimes.sunrise)}</span
            >
            <!-- <button class="pause-button" /> -->
        </div>
        <div class:highlight={upcomingPrayer === "dhuhr"} class="prayer">
            <span>Duhr:</span>
            <span class="prayer-time"
                >{formatTimeWithAMPM(prayerTimes.dhuhr)}</span
            >
            <!-- <button class="pause-button" /> -->
        </div>
        <div class:highlight={upcomingPrayer === "asr"} class="prayer">
            <span>Asr:</span>
            <span class="prayer-time"
                >{formatTimeWithAMPM(prayerTimes.asr)}</span
            >
            <!-- <button class="pause-button" /> -->
        </div>
        <div class:highlight={upcomingPrayer === "maghrib"} class="prayer">
            <span>Maghrib:</span>
            <span class="prayer-time"
                >{formatTimeWithAMPM(prayerTimes.maghrib)}</span
            >
            <!-- <button class="pause-button" /> -->
        </div>
        <div class:highlight={upcomingPrayer === "isha"} class="prayer">
            <span>Isha:</span>
            <span class="prayer-time"
                >{formatTimeWithAMPM(prayerTimes.isha)}</span
            >
            <!-- <button class="pause-button" /> -->
        </div>
    </div>
    <div class="countdown">
        Time until next prayer {msToFormattedTime(
            nextPrayerTime.getTime() - Date.now()
        )}
    </div>
</main>
