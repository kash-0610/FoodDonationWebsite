// home.js - the two numbers on the home page

async function loadStats() {
  const now = new Date().toISOString();

  // donations that are still available and not expired
  const live = await supabaseClient
    .from('food_donations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'available')
    .gt('pickup_by', now);

  if (live.error) {
    console.log('could not load available count:', live.error.message);
  } else {
    document.getElementById('live-count').textContent = live.count;
  }

  // donations claimed since midnight
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);

  const claimed = await supabaseClient
    .from('food_donations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'claimed')
    .gte('claimed_at', midnight.toISOString());

  if (claimed.error) {
    console.log('could not load claimed count:', claimed.error.message);
  } else {
    document.getElementById('claimed-today').textContent = claimed.count;
  }
}

loadStats();
