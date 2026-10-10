document.getElementById('listing-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const row = {
    food_name: document.getElementById('title').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    quantity: document.getElementById('quantity').value,
    donor_name: document.getElementById('donor-name').value,
    location: document.getElementById('location').value,
    pickup_by: new Date(document.getElementById('pickup-time').value).toISOString()
  };

  const { error } = await supabaseClient.from('food_donations').insert(row);
  if (error) return alert('Error: ' + error.message);

  alert('Listing published!');
  e.target.reset();
});