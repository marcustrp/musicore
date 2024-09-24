// type Writable has to be imported, otherwise there will be errors when generating the types
// when running pnpm package
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { writable, type Writable } from 'svelte/store';

// https://stackoverflow.com/questions/61462558/listening-to-a-dispatched-event-from-a-svelte-component
export const clearSelection = writable({});

export const update = writable({});
