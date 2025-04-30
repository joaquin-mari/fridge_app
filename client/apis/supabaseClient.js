import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vnqxjmwdwjfbquliltru.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucXhqbXdkd2pmYnF1bGlsdHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDk1MTYsImV4cCI6MjA2MDAyNTUxNn0.WH9HjMKif8qRKvcc7HHVpTGbvUF_4HHT-vnKf7aWdVg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
