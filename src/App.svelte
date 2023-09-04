<script>
  import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";
  import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
  } from "@tauri-apps/api/notification";
  import { onDestroy, onMount } from "svelte";
  import {
    loadConfiguration,
    saveConfiguration,
  } from "./lib/ConfigurationService";
  import { debounce } from "./lib/utils";
  import PrayerTimesPage from "./pages/PrayerTimesPage.svelte";
  import ConfigurationPage from "./pages/ConfigurationPage.svelte";
  import { configStore } from './lib/store';
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

  let openPage = "Configurations";

  /**
   * @type {import('./lib/Configuration').Configuration | null}
   */
  let config = null;
  /**
   * @type {import('svelte/store').Unsubscriber}
   */
  let configSub = null;


  let selectedLocation = { country: "DefaultCountry", city: "DefaultCity" };

  $: if (config && config.location) {
    selectedLocation = { ...config.location };
  }

  function handleLocationChange() {
    if (config) {
      config.location = selectedLocation;
    }
  }

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

  $: userCoordinates = new Coordinates(
    config?.location?.latitude ?? 0,
    config?.location?.longitude ?? 0
  );
  $: calcualtionParameters =
    CalculationMethod[config?.calculation_method ?? "Kuwait"]();

  $: prayerTimes = new PrayerTimes(
    userCoordinates,
    currentDate,
    calcualtionParameters
  );

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

  onDestroy(() => {
    if (configSub) {
      configSub();
    }
    if (updateTimeInterval) {
      clearInterval(updateTimeInterval);
    }
  });

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
    loadConfiguration().then((configuration) => {
      configStore.set(configuration);
    });
    configSub = configStore.subscribe(value => {
      config = value; 
    });
  });
</script>

{#if openPage === "Configurations"}
  <ConfigurationPage />
{:else if prayerTimes}
  <PrayerTimesPage
    {currentDate}
    {prayerTimes}
    {calcualtionParameters}
    {userCoordinates}
  />
{/if}
