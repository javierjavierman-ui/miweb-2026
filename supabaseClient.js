// Inicialización global de Supabase para IAparaseniors
const SUPABASE_URL = 'https://uvsvyelbhjhenufndbcw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2c3Z5ZWxiaGpoZW51Zm5kYmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODY0OTYsImV4cCI6MjA5MjM2MjQ5Nn0.xwrQbQZ9rtnJwszQtcYXaAebn0CIm_V29_FiwFoWw-s';

// Configuración explícita para compatibilidad con Safari iOS (ITP)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storageKey: 'iaparaseniors-admin-session',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});
