<script>
    import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
    import {
        isPermissionGranted,
        requestPermission,
        sendNotification,
    } from "@tauri-apps/api/notification";
    import { onDestroy, onMount } from "svelte";
    import { loadConfiguration } from "./lib/ConfigurationService";
    import PrayerTimesPage from "./pages/PrayerTimesPage.svelte";
    import ConfigurationPage from "./pages/ConfigurationPage.svelte";
    import { configStore } from "./lib/store";
    import { slide } from "svelte/transition";
    import { appWindow } from "@tauri-apps/api/window";
    import { t } from "./i18n/i18n";

    const PAGE = {
        Configurations: "Configurations",
        PrayerTimes: "PrayerTimes",
    };

    let permissionChecked = false;
    let currentDayStr = formatDate();
    let openPage = PAGE.PrayerTimes;

    let config = null;
    let configSub = null;
    const prayerNotifications = {
        fajr: false,
        sunrise: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
    };
    let currentDate = new Date();
    let updateTimeInterval;

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
            config &&
            activePrayer !== "none" &&
            !prayerNotifications[activePrayer] &&
            sinceLastPrayer(prayerTimes.timeForPrayer(activePrayer), 10, "m")
        ) {
            sendPrayerNotification(activePrayer);
            prayerNotifications[activePrayer] = true;
        }
    }

    function formatDate(fromDate = new Date()) {
        return `${fromDate.getDate().toString().padStart(2, "0")}/${(
            fromDate.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}/${fromDate.getFullYear().toString()}`;
    }

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

    async function ensureNotificationPermission() {
        if (!permissionChecked && !(await isPermissionGranted())) {
            permissionChecked = true;
            console.log(await requestPermission());
        }
    }

    /**
     * @param {"fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha"} prayer
     */
    async function sendPrayerNotification(prayer) {
        await sendNotification({
            title: $t("app.notificationTitle", { prayer: $t(`prayerTimesPage.prayerNames.${prayer}`) }),
            body: $t("app.notificationBody"),
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
        }, 500); // This has to be less than one second since we are updating the UI with a countdown inside PrayerTimesPage
        loadConfiguration().then((configuration) => {
            configStore.set(configuration);
        });
        configSub = configStore.subscribe((value) => {
            config = value;
        });
    });

    function openConfiguration() {
        openPage = PAGE.Configurations;
    }

    function openPrayerTimes() {
        openPage = PAGE.PrayerTimes;
    }

    function closeWindow() {
        appWindow.hide();
    }
</script>

{#if config}
    <button class="fixed-top-left" on:click={closeWindow}>X</button>
    <div class="nav-buttons">
        <button
            class:active={openPage === PAGE.Configurations}
            on:click={openConfiguration}
            >{$t("app.configurations")}
        </button>
        <button
            class:active={openPage === PAGE.PrayerTimes}
            on:click={openPrayerTimes}
            >{$t("app.prayerTimes")}
        </button>
    </div>

    {#if openPage === PAGE.Configurations}
        <div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
            <ConfigurationPage />
        </div>
    {:else if prayerTimes}
        <div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
            <PrayerTimesPage
                {currentDate}
                {prayerTimes}
                {calcualtionParameters}
                {userCoordinates}
            />
        </div>
    {/if}
{/if}

<style>
    .fixed-top-left {
        position: absolute;
        top: 0;
        left: 0;
        margin-top: 8px;
        margin-left: 8px;
    }
    :root {
        --highlight-color-light: rgba(0, 255, 251, 0.8);
        --highlight-color-hover: rgba(0, 255, 251, 0.7);
        --highlight-color-light-active: rgba(0, 255, 251, 0.9);
        --highlight-color-dark-active: rgba(0, 255, 251, 0.7);
        --highlight-color-dark-hover: rgba(0, 255, 251, 0.6);
    }

    .nav-buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        border-color: transparent;
        font-family: inherit; /* Adopt the font family from the root */
    }

    .nav-buttons > button:focus {
        outline: none;
    }

    .nav-buttons > button.active {
        background-color: var(--highlight-color-light);
        color: #f4f4f4;
        border-color: transparent;
    }

    .nav-buttons > button:not(.active):hover {
        background-color: var(--highlight-color-hover);
        border-color: transparent;
    }

    @media (prefers-color-scheme: light) {
        .nav-buttons > button.active {
            background-color: var(--highlight-color-light-active);
            color: #213547;
        }

        .nav-buttons > button:not(.active):hover {
            background-color: var(--highlight-color-light-active);
        }
    }

    @media (prefers-color-scheme: dark) {
        .nav-buttons > button.active {
            background-color: var(--highlight-color-dark-active);
            color: #f4f4f4;
        }

        .nav-buttons > button:not(.active):hover {
            background-color: var(--highlight-color-dark-hover);
        }
    }
</style>
