import { writable } from 'svelte/store';

/**
 * @type {import('svelte/store').Writable<import('./Configuration').Configuration>}
 */
export const configStore = writable(null);