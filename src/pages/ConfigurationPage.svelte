<script>
    import { countries } from "../lib/countries";
    import { cities } from "../lib/cities";
    import { configStore } from "../lib/store";
    import { saveConfiguration } from "../lib/ConfigurationService";
    import { onDestroy, onMount } from "svelte";
    import { CalculationMethodList } from "../lib/Configuration";

    let config = null;
    let configUnsub = null;

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
</script>

<main class="panel">
    {#if config}
        <div>
            <label for="country-select">Country:</label>
            <select
                id="country-select"
                bind:value={config.location.country}
                on:change={handleLocationChange}
            >
                {#each countries as country}
                    <option value={country}>{country}</option>
                {/each}
            </select>
        </div>
        <div>
            <label for="city-select">City:</label>
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
            <label for="calculation-method-select">Calculation Method:</label>
            <select
                id="calculation-method-select"
                bind:value={config.calculation_method}
                on:change={handleCalculationMethodChange}
            >
                {#each CalculationMethodList as calculationMethod}
                    <option value={calculationMethod}
                        >{calculationMethod}</option
                    >
                {/each}
            </select>
        </div>
    {/if}
    <div>
        <button
            on:click={() => {
                saveConfiguration(config);
            }}>Save</button
        >
    </div>
</main>
