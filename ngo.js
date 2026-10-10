let allDonations = [];
let activeCategory = 'All';

const heading = document.querySelector('.results-heading');
const emptyBox = document.querySelector('.empty-state-box');
const list = document.createElement('div');
list.id = 'donation-list';
heading.after(list);

function esc(t) {
  const d = document.createElement('div');
  d.textContent = t ?? '';
  return d.innerHTML;
}

function render() {
  const q = document.getElementById('search-input').value.toLowerCase();
  const shown = allDonations.filter(d =>
    (activeCategory === 'All' || d.category === activeCategory) &&
    [d.food_name, d.donor_name, d.location].join(' ').toLowerCase().includes(q)
  );

  emptyBox.style.display = shown.length ? 'none' : 'block';
  list.innerHTML = shown.map(d => `
    <div class="donation-card">
      <h3>${esc(d.food_name)}</h3>
      <p>${esc(d.description)}</p>
      <p><b>Category:</b> ${esc(d.category)} &nbsp; <b>Quantity:</b> ${esc(d.quantity)}</p>
      <p><b>Donor:</b> ${esc(d.donor_name)} &nbsp; <b>Pickup at:</b> ${esc(d.location)}</p>
      <p><b>Collect before:</b> ${d.pickup_by ? new Date(d.pickup_by).toLocaleString() : '-'}</p>
      <button type="button" class="claim-btn">Claim</button>
    </div>`).join('');
}

async function loadDonations() {
  const { data, error } = await supabaseClient.from('food_donations').select('*');
  if (error) return alert('Error: ' + error.message);
  allDonations = data;
  render();
}

document.getElementById('search-input').addEventListener('input', render);

document.querySelectorAll('.pill-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.textContent.trim();
    render();
  });
});

list.addEventListener('click', (e) => {
  if (e.target.classList.contains('claim-btn')) {
    const ngo = document.getElementById('ngo-name').value || 'Your NGO';
    e.target.textContent = 'Claimed by ' + ngo;
    e.target.disabled = true;
  }
});

loadDonations();