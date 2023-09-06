// Prevents the creation of an additional console window on Windows when running the application in release mode.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, LogicalSize, Manager, PhysicalPosition, SystemTray, SystemTrayEvent, SystemTrayMenu};

const WINDOW_WIDTH: u32 = 360;
const WINDOW_HEIGHT: u32 = 410;
const QUIT_ITEM_ID: &str = "quit";

/// Entry point for the application.
fn main() {
    setup_and_run_tauri_app().expect("Failed to run Tauri app");
}

fn setup_and_run_tauri_app() -> Result<(), Box<dyn std::error::Error>> {
    let system_tray = setup_system_tray();

    tauri::Builder::default()
        .setup(initial_window_setup)
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| handle_system_tray_event(app, event))
        .on_window_event(handle_window_event)
        .run(tauri::generate_context!()).expect("TODO: panic message");
    Ok(())
}

fn setup_system_tray() -> SystemTray {
    let quit_item = CustomMenuItem::new(QUIT_ITEM_ID.to_string(), "Quit");
    let system_tray_menu = SystemTrayMenu::new().add_item(quit_item);
    SystemTray::new().with_menu(system_tray_menu)
}

fn initial_window_setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let window = app.get_window("main").expect("Couldn't get main window");
    window.hide()?;
    window.set_size(LogicalSize::new(WINDOW_WIDTH, WINDOW_HEIGHT))?;
    window.set_decorations(false)?;
    window.set_resizable(false)?;
    Ok(())
}

fn handle_system_tray_event(app: &tauri::AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::MenuItemClick { id, .. } if id == QUIT_ITEM_ID => std::process::exit(0),
        SystemTrayEvent::LeftClick { position, .. } => toggle_window_visibility(app, position),
        _ => {}
    }
}

fn toggle_window_visibility(app: &tauri::AppHandle, position: PhysicalPosition<f64>) {
    let window = app.get_window("main").expect("Main window not found");
    if let Ok(is_visible) = window.is_visible() {
        if is_visible {
            window.hide().expect("Failed to hide window");
        } else {
            position_window_near_tray_icon(app, position);
            window.show().expect("Failed to show window");
            window.set_always_on_top(true).expect("Failed to set window on top");
        }
    }
}

fn position_window_near_tray_icon(app: &tauri::AppHandle, position: PhysicalPosition<f64>) {
    let window = app.get_window("main").unwrap();
    let current_monitor = window.current_monitor().unwrap().unwrap();

    let top_left_of_screen = current_monitor.position();
    let max_position_of_screen = current_monitor.size();

    let window_width_physical = (WINDOW_WIDTH as f64 * current_monitor.scale_factor()) as i32;
    let window_height_physical = (WINDOW_HEIGHT as f64 * current_monitor.scale_factor()) as i32;

    // Calculate X position
    let mut new_position_x = if (position.x - top_left_of_screen.x as f64) < (max_position_of_screen.width as f64 / 2.0) {
        // If tray icon is on the left half of the screen
        position.x as i32
    } else {
        // If tray icon is on the right half of the screen
        (position.x - window_width_physical as f64) as i32
    };

    // Calculate Y position
    let mut new_position_y = if (position.y - top_left_of_screen.y as f64) < (max_position_of_screen.height as f64 / 2.0) {
        // If tray icon is on the top half of the screen
        position.y as i32
    } else {
        // If tray icon is on the bottom half of the screen
        (position.y - window_height_physical as f64) as i32
    };

    // Ensure the window doesn't go off-screen
    if new_position_x + window_width_physical > (top_left_of_screen.x + max_position_of_screen.width as i32) {
        new_position_x -= window_width_physical;
    }

    if new_position_y + window_height_physical > (top_left_of_screen.y + max_position_of_screen.height as i32) {
        new_position_y -= window_height_physical;
    }

    window.set_position(PhysicalPosition::new(new_position_x, new_position_y)).unwrap();
    window.set_size(LogicalSize::<u32>::new(WINDOW_WIDTH, WINDOW_HEIGHT)).unwrap();
}

fn handle_window_event(event: tauri::GlobalWindowEvent) {
    match event.event() {
        tauri::WindowEvent::CloseRequested { api, .. } => {
            event.window().hide().expect("Failed to hide window");
            api.prevent_close();
        }
        tauri::WindowEvent::Focused(is_focused) if !is_focused => {
            event.window().hide().expect("Failed to hide window");
        }
        _ => {}
    }
}

