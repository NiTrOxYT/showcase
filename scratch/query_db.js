global.WebSocket = class {};

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Parse .env.local manually
const envFile = fs.readFileSync(path.resolve(__dirname, "../.env.local"), "utf8");
const env = {};
envFile.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join("=").trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function run() {
  const { data, error } = await supabase.from("projects").select("id, title, tech_stack");
  if (error) {
    console.error(error);
    return;
  }
  data.forEach((p) => {
    console.log(p.title, "tech_stack:", p.tech_stack, "type:", typeof p.tech_stack, "isArray:", Array.isArray(p.tech_stack));
  });
}

run();
