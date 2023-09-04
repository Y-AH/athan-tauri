import { fs, path } from '@tauri-apps/api';
import { parse, stringify } from 'smol-toml';
import { Configuration } from './Configuration';

/**
 * Loads the application configuration from the 'config.toml' file located in the application data directory.
 * If the file does not exist, it initializes a default configuration, saves it to the path, and returns it.
 *
 * @async
 * @function
 * @throws Will throw an error if there's an issue reading or writing the configuration file.
 * @returns {Promise<Configuration>} A Configuration object containing the application settings.
 */
export async function loadConfiguration() {
    try {
        const dataDir = await path.appDataDir();
        const configPath = await path.join(dataDir, 'config.toml');
        if (await fs.exists(configPath)) {
            console.log(`Loading ${configPath}.`)
            const configFile = await fs.readTextFile(configPath);
            const configJson = parse(configFile);
            const config = new Configuration(configJson);
            console.log(config);
            return config;
        } else {
            const config = new Configuration();
            await createDirectoryIfDoesntExist(dataDir); // Pass the directory, not the file path
            await fs.writeTextFile(configPath, stringify(config));
            return config;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * 
 * @param {Configuration} config 
 */
export async function saveConfiguration(config) {
    const dataDir = await path.appDataDir();
    const configPath = await path.join(dataDir, 'config.toml');
    if (!(await fs.exists(dataDir))) {
        await createDirectoryIfDoesntExist(dataDir);
    }
    await fs.writeTextFile(configPath, stringify(config.toPlainObject()));
}

/**
 * Creates the specified directory if it doesn't exist.
 *
 * @async
 * @function
 * @param {string} directoryPath - The path to the directory to be created.
 * @throws Will throw an error if there's an issue creating the directory.
 */
async function createDirectoryIfDoesntExist(directoryPath) {
    if (!await fs.exists(directoryPath)) {
        await fs.createDir(directoryPath, { recursive: true });
    }
}
