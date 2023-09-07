import { derived, writable } from "svelte/store";
import translations from "./translations";
import { configStore } from "../lib/store";

/**
 * @type {import("./translations").Locale}
 */
const defaultLocale = "en";

/** @type {import("./translations").Locale[]} */
// @ts-ignore
export const locales = Object.keys(translations);
export const locale = derived(configStore, $configStore => $configStore?.language ?? defaultLocale);

// Update the body's dir attribute whenever the locale changes
locale.subscribe(currentLocale => {
  const direction = translations[currentLocale]?.dir;
  if (direction) {
    document.body.setAttribute('dir', direction);
  }
});

/**
 * @param {import("./translations").Locale} currentLocale
 * @param {keyof import("./translations").Translation} key
 * @param {{ [key: string]: string }} vars
 * @returns {string}
 */
export function translate(currentLocale, key, vars) {
  // Let's throw some errors if we're trying to use keys/locales that don't exist.
  if (!key) throw new Error("no key provided to $t()");
  if (!currentLocale) throw new Error(`no translation for key "${key}"`);

  // Grab the translation from the translations object.
  let text = translations[currentLocale][key];

  if (!text) throw new Error(`no translation found for ${currentLocale}.${key}`);

  // Replace any passed in variables in the translation string.
  Object.keys(vars).forEach((k) => {
    const regex = new RegExp(`{{${k}}}`, "g");
    text = text.replace(regex, vars[k]);
  });

  return text;
}

/** 
 * A derived store that returns a translation function.
 * The translation function can be passed a key (to fetch the appropriate translation)
 * and an optional 'vars' object for string replacements within the translation.
 *
 * @type {import("svelte/store").Readable<(key: keyof import("./translations").Translation, vars?: { [key: string]: string }) => string>}
 */
export const t = derived(locale, /** @param {import("./translations").Locale} $locale */ ($locale) => 
    /** 
     * @param {keyof import("./translations").Translation} key 
     * @param {{ [key: string]: string }} [vars={}] 
     * @returns {string} 
     */
    (key, vars = {}) => translate($locale, key, vars)
);
