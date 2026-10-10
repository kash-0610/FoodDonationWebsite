// ngo.js - browse + claim donations

let allDonations = [];
let activeCategory = 'All';

const list = document.getElementById('donation-list');
const searchInput = document.getElementById('search-input');
const ngoInput = document.getElementById('ngo-name');
const countChip = document.getElementById('available-count');

// remember the ngo name so they don't type it again every time
ngoInput.value = localStorage.getItem('ngoName') || '';
ngoInput.addEventListener('input', function () {
  localStorage.setItem('ngoName', ngoInput.value);
});


function render() {
  const q = searchInput.value.toLowerCase();
  const now = new Date();

  const shown = allDonations.filter(function (d) {
    const notExpired = new Date(d.pickup_by) > now;
    const rightCategory = activeCategory === 'All' || d.category === activeCategory;
    const text = [d.food_name, d.donor_name, d.location].join(' ').toLowerCase();

    return notExpired && rightCategory && text.includes(q);
  });

  countChip.textContent = shown.length + ' available';

  if (shown.length === 0) {
    list.innerHTML = `
      <div class="empty-box">
        <ion-icon name="search-outline"></ion-icon>
        <h3>No matches for your filters</h3>
        <p>Try a different search term or category filter.</p>
      </div>`;
    return;
  }

  list.innerHTML = shown.map(function (d) {
    const left = timeLeft(d.pickup_by);

    const footer = `
      <div class="card-foot">
        <span class="status time-left ${left.cls}"><span class="dot ${left.cls}"></span> ${left.text}</span>
        <button type="button" class="claim-btn" data-id="${d.id}">
          <ion-icon name="hand-left-outline"></ion-icon> Claim
        </button>
      </div>`;

    return donationCard(d, footer);
  }).join('');
}


async function loadDonations() {
  const { data, error } = await supabaseClient
    .from('food_donations')
    .select('*')
    .eq('status', 'available')
    .order('pickup_by', { ascending: true });

  if (error) {
    // if this says "column status does not exist" run supabase-setup.sql first
    showToast('Error: ' + error.message, true);
    return;
  }

  allDonations = data;
  render();
}


// search box
searchInput.addEventListener('input', render);

// category buttons
document.querySelectorAll('.pill').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.pill').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    activeCategory = btn.textContent.trim();
    render();
  });
});


// claim button
list.addEventListener('click', async function (e) {
  const btn = e.target.closest('.claim-btn');
  if (!btn) return;

  const ngoName = ngoInput.value.trim();
  if (ngoName === '') {
    showToast('Type your NGO name at the top first', true);
    ngoInput.focus();
    return;
  }

  btn.disabled = true;

  // only works if it is still "available", so two ngos can't claim the same one
  const { data, error } = await supabaseClient
    .from('food_donations')
    .update({
      status: 'claimed',
      claimed_by: ngoName,
      claimed_at: new Date().toISOString()
    })
    .eq('id', btn.dataset.id)
    .eq('status', 'available')
    .select();

  if (error) {
    btn.disabled = false;
    showToast('Error: ' + error.message, true);
    return;
  }

  if (data.length === 0) {
    showToast('Oops, someone else already claimed this one', true);
  } else {
    showToast('Claimed! Go pick it up before the deadline');
  }

  loadDonations();
});


loadDonations();

// refresh every minute so new posts show up and expired ones disappear
setInterval(loadDonations, 60000);
