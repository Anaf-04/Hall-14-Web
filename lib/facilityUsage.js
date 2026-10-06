// Daily (60-min) per-facility-type usage quota, tracked per resident.
// Resets at 00:00 Hong Kong time by comparing against residents.usage_date.

export const DAILY_LIMIT_MINUTES = 60;

const USAGE_COLUMNS = {
  PS5_CONTROLLER: "ps5_minutes_used",
  NINTENDO_SWITCH: "nintendo_switch_minutes_used",
  TABLE_TENNIS_SET: "table_tennis_minutes_used",
  SHOE_WASHER_KEY: "shoe_washer_minutes_used",
};

export function getUsageColumn(item) {
  return USAGE_COLUMNS[item] ?? null;
}

function todayInHongKong() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// Returns { allowed, minutesUsed } — minutesUsed is 0 if the resident's
// usage_date is a prior day (quota hasn't been reset yet, read-only here).
export async function checkFacilityQuota(supabaseAdmin, sid, item) {
  const column = getUsageColumn(item);
  if (!column) return { allowed: true, minutesUsed: 0 };

  const { data: resident, error } = await supabaseAdmin
    .from("residents")
    .select(`usage_date, ${column}`)
    .eq("sid", sid)
    .single();

  if (error || !resident) return { allowed: true, minutesUsed: 0 };

  const minutesUsed =
    resident.usage_date === todayInHongKong() ? resident[column] ?? 0 : 0;

  return { allowed: minutesUsed < DAILY_LIMIT_MINUTES, minutesUsed };
}

// Adds elapsed minutes to the resident's quota for this facility type,
// resetting the counter first if usage_date is a prior day.
export async function recordFacilityUsage(supabaseAdmin, sid, item, minutesElapsed) {
  const column = getUsageColumn(item);
  if (!column || minutesElapsed <= 0) return;

  const { data: resident } = await supabaseAdmin
    .from("residents")
    .select(`usage_date, ${column}`)
    .eq("sid", sid)
    .single();

  if (!resident) return;

  const today = todayInHongKong();
  const currentMinutes = resident.usage_date === today ? resident[column] ?? 0 : 0;
  const newMinutes = Math.min(DAILY_LIMIT_MINUTES, currentMinutes + minutesElapsed);

  await supabaseAdmin
    .from("residents")
    .update({ usage_date: today, [column]: newMinutes })
    .eq("sid", sid);
}
