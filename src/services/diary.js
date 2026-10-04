import { supabase } from "../lib/supabaseClient.js";

const TABLE = "debugging_diary";

// Create
export async function addEntry(entry) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      tag: entry.tag,
      title: entry.title,
      symptom: entry.symptom,
      tried: entry.tried,
      root_cause: entry.rootCause,
      fix: entry.fix,
      lesson: entry.lesson,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Read all (newest first)
export async function getAllEntries() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Update
export async function updateEntry(id, updates) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Delete
export async function deleteEntry(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

// Search by title or tag (server-side via the `search_diary` RPC)
export async function searchEntries(query) {
  const { data, error } = await supabase.rpc("search_diary", { q: query });
  if (error) throw error;
  return data;
}
