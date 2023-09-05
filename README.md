# Athan Tauri

Athan Tauri is a cross-platform desktop application that displays Islamic prayer times based on the user's selected location and calculation method. It's built with Svelte, Vite, and Tauri.

**GitHub Repository**: [Athan Tauri](https://github.com/Y-AH/athan-tauri)

## Features

- **Dynamic Prayer Times**: Displays the prayer times for the day and highlights the upcoming prayer.
- **Countdown Timer**: Shows the time remaining until the next prayer.
- **Location Selection**: Allows users to select their country and city for accurate prayer times.
- **Customizable Calculation Method**: Offers various calculation methods for prayer times.
- **Configurations with TOML**: User configurations, such as location and calculation method, are saved in a TOML file located in the application data directory. This is handled with the Tauri API, smol-toml library, and custom functions to load and save configurations.

## Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) and [Rust](https://www.rust-lang.org/) installed.
- Tauri requires additional [setup](https://tauri.studio/en/docs/getting-started/intro) depending on the platform.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Y-AH/athan-tauri.git
```

2. Navigate to the project directory:

```bash
cd athan-tauri
```

3. Install the dependencies:

```bash
npm install
```

## Usage

1. To run the app in development mode:

```bash
npm run tauri dev
```

The application should launch as a standalone window.

2. On the main screen, you'll see the prayer times for the day.
3. To adjust your location and calculation method, go to the settings page.
4. Choose your country, city, and preferred calculation method.
5. Click "Save" to update and see the prayer times based on your preferences.
6. The application's configurations are saved in a TOML file. By default, this configuration file is located in the application's data directory. You can check the path to this directory using the provided methods in the Tauri API.

## Building for Production

To build the app for production, use:

```bash
npm run tauri build
```

This will create a standalone executable for your platform.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### License

MIT
