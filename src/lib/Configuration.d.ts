// Configuration.d.ts

type CalculationMethod = 'MuslimWorldLeague'| 'Egyptian'| 'Karachi'| 'UmmAlQura'| 'Dubai'| 'MoonsightingCommittee'| 'NorthAmerica'| 'Kuwait'| 'Qatar'| 'Singapore'| 'Tehran'| 'Turkey';

export declare class Configuration {
    version: string;
    title: string;
    calculation_method: CalculationMethod;
    location: Location;
    prayer_offset: PrayerOffset;

    constructor(version?: string, title?: string, calculation_method?: CalculationMethod, location?: Partial<Location>, prayer_offset?: Partial<PrayerOffset>);
    constructor(config: ConfigurationOptions);

    private init(version?: string, title?: string, calculation_method?: CalculationMethod, location?: Partial<Location>, prayer_offset?: Partial<PrayerOffset>): void;
}

interface Location {
    country: string;
    city: string;
    latitude?: number;
    longitude?: number;
}

interface PrayerOffset {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
}

interface ConfigurationOptions {
    version?: string;
    title?: string;
    calculation_method?: CalculationMethod;
    location?: Partial<Location>;
    prayer_offset?: Partial<PrayerOffset>;
}

export = Configuration;
