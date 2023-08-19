<script>
  import {
    Coordinates,
    CalculationMethod,
    PrayerTimes,
    CalculationParameters,
  } from "adhan";
  import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
  } from "@tauri-apps/api/notification";
  import { onDestroy, onMount } from "svelte";
  /**
   * User's coordinates for prayer time calculation.
   * @type {Coordinates}
   */
  const userCoordinates = new Coordinates(29.3117, 47.4818);
  /**
   * Calculation method for prayer times.
   * @type {CalculationParameters}
   */
  const calculationMethod = CalculationMethod.Kuwait();
  /**
   * Flag to track if notification permission has been checked.
   * @type {boolean}
   */
  let permissionChecked = false;
  /**
   * Current day in formatted string.
   * @type {string}
   */
  let currentDayStr = formatDate();

  /**
   * Tracks which prayer notifications have been sent.
   * @type {Object.<string, boolean>}
   */
  const prayerNotifications = {
    fajr: false,
    sunrise: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  };

  /**
   * Current date and time.
   * @type {Date}
   */
  let currentDate = new Date();

  $: prayerTimes = new PrayerTimes(
    userCoordinates,
    currentDate,
    calculationMethod
  );
  $: upcomingPrayer = prayerTimes.nextPrayer(new Date());
  $: nextPrayerTime =
    upcomingPrayer === "none"
      ? new PrayerTimes(
          userCoordinates,
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1
          ),
          calculationMethod
        ).timeForPrayer("fajr")
      : prayerTimes.timeForPrayer(upcomingPrayer);

  $: {
    const now = new Date();
    const activePrayer = prayerTimes.currentPrayer(now);
    if (
      activePrayer !== "none" &&
      !prayerNotifications[activePrayer] &&
      sinceLastPrayer(prayerTimes.timeForPrayer(activePrayer), 10, "m")
    ) {
      sendPrayerNotification(activePrayer);
      prayerNotifications[activePrayer] = true;
    }
  }

  let updateTimeInterval;

  /**
   * Format a date into a string.
   * @param {Date} [fromDate=new Date()] - Date to format.
   * @returns {string} Formatted date string.
   */
  function formatDate(fromDate = new Date()) {
    return `${fromDate.getDate().toString().padStart(2, "0")}/${(
      fromDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${fromDate.getFullYear().toString()}`;
  }

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

  /**
   * Ensure the user has granted notification permissions.
   * @returns {Promise<void>}
   */
  async function ensureNotificationPermission() {
    if (!permissionChecked && !(await isPermissionGranted())) {
      permissionChecked = true;
      console.log(await requestPermission());
    }
  }

  /**
   * Send a notification to the user for the specified prayer.
   * @param {string} prayer - Name of the prayer.
   * @returns {Promise<void>}
   */
  async function sendPrayerNotification(prayer) {
    await sendNotification({
      title: `🕌 It's ${prayer} 🕋 time.`,
      body: "🚶‍♂️ Get up, 🛑 take a break, and 🙏 pray.",
    });
  }

  onMount(() => {
    ensureNotificationPermission();
    updateTimeInterval = setInterval(() => {
      currentDate = new Date();
      const newDayStr = formatDate(currentDate);
      if (newDayStr !== currentDayStr) {
        currentDayStr = newDayStr;
        for (const prayer in prayerNotifications) {
          prayerNotifications[prayer] = false;
        }
      }
    }, 500);
  });

  onDestroy(() => {
    clearInterval(updateTimeInterval);
  });
</script>

<main class="prayer-panel">
  <div>
    <div class:highlight={upcomingPrayer === "fajr"} class="prayer">
      <span>Fajir:</span>
      <span class="prayer-time">{formatTimeWithAMPM(prayerTimes.fajr)}</span>
      <!-- <button class="pause-button" /> -->
    </div>
    <div class:highlight={upcomingPrayer === "sunrise"} class="prayer">
      <span>Sunrise:</span>
      <span class="prayer-time">{formatTimeWithAMPM(prayerTimes.sunrise)}</span>
      <!-- <button class="pause-button" /> -->
    </div>
    <div class:highlight={upcomingPrayer === "dhuhr"} class="prayer">
      <span>Duhr:</span>
      <span class="prayer-time">{formatTimeWithAMPM(prayerTimes.dhuhr)}</span>
      <!-- <button class="pause-button" /> -->
    </div>
    <div class:highlight={upcomingPrayer === "asr"} class="prayer">
      <span>Asr:</span>
      <span class="prayer-time">{formatTimeWithAMPM(prayerTimes.asr)}</span>
      <!-- <button class="pause-button" /> -->
    </div>
    <div class:highlight={upcomingPrayer === "maghrib"} class="prayer">
      <span>Maghrib:</span>
      <span class="prayer-time">{formatTimeWithAMPM(prayerTimes.maghrib)}</span>
      <!-- <button class="pause-button" /> -->
    </div>
    <div class:highlight={upcomingPrayer === "isha"} class="prayer">
      <span>Isha:</span>
      <span class="prayer-time">{formatTimeWithAMPM(prayerTimes.isha)}</span>
      <!-- <button class="pause-button" /> -->
    </div>
  </div>
  <div class="countdown">
    Time until next prayer {msToFormattedTime(
      nextPrayerTime.getTime() - Date.now()
    )}
  </div>
</main>

<style>
  .highlight {
    background-color: rgba(0, 255, 251, 0.5);
    border-radius: 4px;
    grid-column: 1 / -1; /* This will make it span all columns */
  }
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    transition: background-color 0.3s;
  }

  .prayer-panel {
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    width: 300px;
    transition: background-color 0.3s;
  }

  .prayer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px;
    transition: background-color 0.3s ease; /* Transition effect */
  }

  .prayer > :first-child {
    justify-self: start; /* Aligns to the left of its cell */
  }

  /* .prayer > :nth-child(2) {
    justify-self: center;
  } */

  .prayer > :last-child {
    justify-self: end; /* Aligns to the right of its cell */
  }

  .prayer-time {
    color: #555;
  }

  .pause-button {
    background-color: #ddd;
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    transition: background-color 0.3s;
  }

  .pause-button::before {
    content: "||";
    color: #555;
  }

  .countdown {
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }

  /* Light theme styles (default) */
  body {
    background-color: #f4f4f4;
  }

  .prayer-panel {
    background-color: #fff;
  }

  /* Dark theme styles */
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #1a1a1a;
    }

    .prayer-panel {
      background-color: #333;
    }

    .prayer-time,
    .countdown {
      color: #ccc;
    }

    .pause-button {
      background-color: #555;
    }

    .pause-button::before {
      color: #ccc;
    }
    .highlight {
      background-color: rgba(
        100,
        200,
        200,
        0.5
      ); /* Adjust as needed for the dark theme */
    }
  }
</style>
