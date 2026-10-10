// donor.js - the form + the "your listings" list

const form = document.getElementById('listing-form');
const myList = document.getElementById('my-listings');
const totalChip = document.getElementById('total-chip');

// there is no login, so we remember which listings were made on this
// browser by saving their ids in localStorage
function getMyIds() {
  try {
    const ids = JSON.parse(localStorage.getItem('myListings')) || [];
    // throw away empty / null ids (they can get saved if something went wrong once)
    return ids.filter(function (id) {
      return id !== null && id !== undefined && id !== 'null';
    });
  } catch (e) {
    return [];
  }
}

function saveMyIds(ids) {
  localStorage.setItem('myListings', JSON.stringify(ids));
}


// can't pick a pickup time that already passed
const pickupInput = document.getElementById('pickup-time');
const rightNow = new Date();
rightNow.setMinutes(rightNow.getMinutes() - rightNow.getTimezoneOffset());
pickupInput.min = rightNow.toISOString().slice(0, 16);


// ----- publish a listing -----
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const pickup = new Date(pickupInput.value);
  if (pickup <= new Date()) {
    showToast('Pickup time has to be in the future', true);
    return;
  }

  const row = {
    food_name: document.getElementById('title').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    quantity: document.getElementById('quantity').value,
    donor_name: document.getElementById('donor-name').value,
    location: document.getElementById('location').value,
    pickup_by: pickup.toISOString(),
    status: 'available'
  };

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;

  const { data, error } = await supabaseClient
    .from('food_donations')
    .insert(row)
    .select()
    .single();

  button.disabled = false;

  if (error) {
    showToast('Error: ' + error.message, true);
    return;
  }

  // remember this listing belongs to this browser
  if (data && data.id) {
    const ids = getMyIds();
    ids.push(data.id);
    saveMyIds(ids);
  } else {
    console.log('no id came back, did you run supabase-setup.sql?');
  }

  showToast('Listing published!');
  form.reset();
  loadMyListings();
});


// ----- show the listings -----
async function loadMyListings() {
  const ids = getMyIds();

  if (ids.length === 0) {
    totalChip.textContent = '0 total';
    myList.innerHTML = `
      <div class="empty-box">
        <ion-icon name="cube-outline"></ion-icon>
        <h3>Nothing posted yet</h3>
        <p>Fill the form and your listings will show up here.</p>
      </div>`;
    return;
  }

  const { data, error } = await supabaseClient
    .from('food_donations')
    .select('*')
    .in('id', ids)
    .order('pickup_by', { ascending: true });

  if (error) {
    showToast('Error: ' + error.message, true);
    return;
  }

  totalChip.textContent = data.length + ' total';

  myList.innerHTML = data.map(function (d) {
    // what to show in the status part
    let dotClass = 'ok';
    let statusText = 'Live';

    if (d.status === 'claimed') {
      dotClass = 'soon';
      statusText = 'Claimed by ' + esc(d.claimed_by);
    } else if (new Date(d.pickup_by) < new Date()) {
      dotClass = 'gone';
      statusText = 'Expired';
    }

    const footer = `
      <div class="card-foot">
        <span class="status"><span class="dot ${dotClass}"></span> ${statusText}</span>
        <button type="button" class="remove-btn" data-id="${d.id}">
          <ion-icon name="trash-outline"></ion-icon> Remove
        </button>
      </div>`;

    return donationCard(d, footer);
  }).join('');
}


// ----- remove a listing -----
myList.addEventListener('click', async function (e) {
  const btn = e.target.closest('.remove-btn');
  if (!btn) return;

  if (!confirm('Remove this listing?')) return;

  const id = btn.dataset.id;

  const { error } = await supabaseClient
    .from('food_donations')
    .delete()
    .eq('id', id);

  if (error) {
    showToast('Error: ' + error.message, true);
    return;
  }

  // take it out of the saved ids too
  saveMyIds(getMyIds().filter(function (savedId) {
    return String(savedId) !== String(id);
  }));

  showToast('Listing removed');
  loadMyListings();
});


loadMyListings();

// refresh every minute so "Live" turns into "Expired" and claims show up
setInterval(loadMyListings, 60000);
