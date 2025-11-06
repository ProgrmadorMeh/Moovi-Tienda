import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

// Define a singleton instance of the Supabase client
const supabaseClient = createPagesBrowserClient();

/**
 * Provides a singleton instance of the Supabase client.
 * This function is used to ensure that only one instance of the Supabase client is used throughout the application.
 * This is the client-side client.
 * @returns The Supabase client instance.
 */
export function createClient() {
    return supabaseClient;
}
