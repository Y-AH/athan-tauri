// Configuration.js
// @ts-ignore
import { cities } from "./cities";

const DEFAULTS = Object.freeze({
    version: '0.0.0',
    title: 'Athan Reminder',
    language: 'en',
    calculation_method: "Kuwait",
    location: {
        country: "Kuwait",
        city: "Kuwait City"
    },
    prayer_offset: {
        fajr: 0,
        sunrise: 0,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0,
    }
});


export const CalculationMethodList = [
    'MuslimWorldLeague',
    'Egyptian',
    'Karachi',
    'UmmAlQura',
    'Dubai',
    'MoonsightingCommittee',
    'NorthAmerica',
    'Kuwait',
    'Qatar',
    'Singapore',
    'Tehran',
    'Turkey'
];

export class Configuration {

    /**
     * @type {{ country?: string, city?: string, latitude?: number, longitude?: number }}
     */
    #location = {};


    constructor(...args) {
        const isObjectArg = args.length === 1 && typeof args[0] === 'object';
        const [version, title, language, calculation_method, location, prayer_offset] = isObjectArg
            ? [args[0].version, args[0].title, args[0].language, args[0].calculation_method, args[0].location, args[0].prayer_offset]
            : args;

        this.init(version, title, language, calculation_method, location, prayer_offset);
    }


    set location(value) {
        let { country = DEFAULTS.location.country, city = DEFAULTS.location.city } = value || {};
        let foundCity = (cities[country] ?? []).find((c) => c.name === city);
        if (!foundCity) {
            foundCity = cities[country][0];
            city = foundCity.name;
        }
        const { latitude = 0, longitude = 0 } = foundCity ?? {};
        this.#location = { country, city, latitude, longitude };
    }


    get location() {
        return this.#location;
    }

    init(
        version = DEFAULTS.version,
        title = DEFAULTS.title,
        language = DEFAULTS.language,
        calculation_method = DEFAULTS.calculation_method,
        location = {},
        prayer_offset = {}
    ) {
        this.version = version;
        this.title = title;
        this.language = language;
        this.calculation_method = calculation_method ?? DEFAULTS.calculation_method;
        this.location = location;  // This uses the setter method
        this.prayer_offset = {
            fajr: prayer_offset.fajr ?? DEFAULTS.prayer_offset.fajr,
            sunrise: prayer_offset.sunrise ?? DEFAULTS.prayer_offset.sunrise,
            dhuhr: prayer_offset.dhuhr ?? DEFAULTS.prayer_offset.dhuhr,
            asr: prayer_offset.asr ?? DEFAULTS.prayer_offset.asr,
            maghrib: prayer_offset.maghrib ?? DEFAULTS.prayer_offset.maghrib,
            isha: prayer_offset.isha ?? DEFAULTS.prayer_offset.isha,
        };
    }

    toPlainObject() {
        return {
            version: this.version,
            title: this.title,
            language: this.language,
            calculation_method: this.calculation_method,
            location: { ...this.location },
            prayer_offset: { ...this.prayer_offset },
        };
    }
}
