<script>
    import { countries } from "../lib/countries";
    import { cities } from "../lib/cities";
    import { configStore } from "../lib/store";
    import { saveConfiguration } from "../lib/ConfigurationService";
    import { onDestroy, onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { CalculationMethodList } from "../lib/Configuration";
    import { locales, t, translate, tCountry } from "../i18n/i18n";

    let config = null;
    let configUnsub = null;
    let showSnackbar = false;

    let selectedLocation = { country: "Kuwait", city: "Kuwait City" };

    $: if (config && config.location) {
        selectedLocation = { ...config.location };
    }

    onMount(() => {
        configUnsub = configStore.subscribe((value) => {
            config = value;
        });
    });

    onDestroy(() => {
        if (configUnsub) {
            configUnsub();
        }
    });

    /**
     * @param {keyof import('../lib/Configuration').Configuration} propertyName
     * @param {any} value
     */
    function updateConfigProperty(propertyName, value) {
        if (config) {
            config[propertyName] = value;
            updateStore(config);
        }
    }

    function handleLocationChange() {
        updateConfigProperty("location", selectedLocation);
    }

    function handleCalculationMethodChange() {
        // Here, the updated value is bound directly to config.calculation_method by svelte
        updateStore(config);
    }

    /**
     *
     * @param {import('../lib/Configuration').Configuration} updatedConfig
     */
    function updateStore(updatedConfig) {
        configStore.set(updatedConfig);
    }

    async function saveConfigAndNotify() {
        try {
            await saveConfiguration(config);
            showSnackbar = true;
            setTimeout(() => {
                showSnackbar = false;
            }, 3000); // Hide the snackbar after 3 seconds}
        } catch (e) {
            console.error(e);
        }
    }

    function handleLanguageChange() {
        // Then update the store if needed.
        updateStore(config);
    }
</script>

<main class="panel">
    {#if config}
        <div>
            <label for="language-select">{$t("configPage.language")}:</label>
            <select
                id="language-select"
                bind:value={config.language}
                on:change={handleLanguageChange}
            >
                {#each locales as locale}
                    <option value={locale}
                        >{translate(locale, "name", {})}</option
                    >
                {/each}
            </select>
        </div>
        <div>
            <label for="country-select">{$t("configPage.country")}:</label>
            <select
                id="country-select"
                bind:value={config.location.country}
                on:change={handleLocationChange}
            >
                {#each countries as country}
                    <option value={country}>{$tCountry(country)}</option>
                {/each}
            </select>
        </div>
        <div>
            <label for="city-select">{$t("configPage.city")}:</label>
            <select
                id="city-select"
                bind:value={config.location.city}
                on:change={handleLocationChange}
            >
                {#each cities[config.location.country] as city}
                    <option value={city.name}>{city.name}</option>
                {/each}
            </select>
        </div>
        <div>
            <label for="calculation-method-select"
                >{$t("configPage.calculationMethod")}:</label
            >
            <select
                id="calculation-method-select"
                bind:value={config.calculation_method}
                on:change={handleCalculationMethodChange}
            >
                {#each CalculationMethodList as calculationMethod}
                    <option value={calculationMethod}
                        >{$t(`configPage.calculationMethod.${calculationMethod}`)}</option
                    >
                {/each}
            </select>
        </div>
    {:else}
        <div>
            <label for="language-select">{$t("configPage.language")}:</label>
            <select id="language-select" />
        </div>
        <div>
            <label for="country-select">{$t("configPage.country")}:</label>
            <select id="country-select" />
        </div>
        <div>
            <label for="city-select">{$t("configPage.city")}:</label>
            <select id="city-select" />
        </div>
        <div>
            <label for="calculation-method-select"
                >{$t("configPage.calculationMethod")}:</label
            >
            <select id="calculation-method-select" />
        </div>
    {/if}

    <div>
        <button on:click={saveConfigAndNotify}
            >{$t("configPage.saveButton")}</button
        >
    </div>

    <!-- Snackbar Component -->
    {#if showSnackbar}
        <div class="snackbar" transition:fade={{ duration: 500 }}>
            {$t("configPage.snackbarText")}
        </div>
    {/if}
</main>

<style>
    .snackbar {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        font-family: "Consolas", "Noto Sans", monospace;
        transition: background-color 0.3s, color 0.3s;

        /* Default color scheme for light mode (can be adjusted as necessary) */
        background-color: #333;
        color: #ccc;
    }

    @media (prefers-color-scheme: light) {
        .snackbar {
            background-color: #242424;
            color: rgba(255, 255, 255, 0.87);
        }
    }

    @media (prefers-color-scheme: dark) {
        .snackbar {
            background-color: #555;
            color: #ccc;
        }
    }
</style>
