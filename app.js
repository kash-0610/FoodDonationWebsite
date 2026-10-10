// app.js - stuff that every page uses

// open / close the menu on phones
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

menuBtn.addEventListener('click', function () {
  navLinks.classList.toggle('open');
});


// makes text safe before we put it inside html
// (so nobody can type <script> in the form and break the page)
function esc(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}


// small message at the bottom of the screen
function showToast(message, isError) {
  let toast = document.getElementById('toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = 'toast show' + (isError ? ' error' : '');

  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 3000);
}


// how much time is left before the pickup deadline
// returns the text and a css class (ok = green, soon = orange, gone = grey)
function timeLeft(dateString) {
  const diff = new Date(dateString) - new Date();

  if (diff <= 0) {
    return { text: 'Expired', cls: 'gone' };
  }

  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  let text;
  if (days > 0) {
    text = days + 'd ' + hours + 'h left';
  } else if (hours > 0) {
    text = hours + 'h ' + minutes + 'm left';
  } else {
    text = minutes + 'm left';
  }

  // less than 6 hours = hurry up
  const cls = diff < 6 * 60 * 60 * 1000 ? 'soon' : 'ok';
  return { text: text, cls: cls };
}


// "Sat, 10 Oct, 12:18 pm"
function prettyTime(dateString) {
  return new Date(dateString).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit'
  });
}


// builds one donation card. footerHtml is the bottom part,
// it's different on the donor page and the ngo page
function donationCard(d, footerHtml) {
  const left = timeLeft(d.pickup_by);
  // "Prepared Meals" -> "prepared" (for the badge colour)
  const catClass = (d.category || '').toLowerCase().split(' ')[0];

  return `
    <div class="card">
      <div class="card-img">
        <span class="badge ${catClass}">${esc(d.category)}</span>
        <ion-icon name="cube-outline"></ion-icon>
      </div>
      <div class="card-body">
        <h3>${esc(d.food_name)}</h3>
        <p class="desc">${esc(d.description)}</p>
        <ul class="meta">
          <li><ion-icon name="cube-outline"></ion-icon> ${esc(d.quantity)}</li>
          <li><ion-icon name="person-outline"></ion-icon> ${esc(d.donor_name)}</li>
          <li><ion-icon name="location-outline"></ion-icon> ${esc(d.location)}</li>
          <li>
            <ion-icon name="time-outline"></ion-icon>
            <span>Pickup by ${prettyTime(d.pickup_by)} <span class="time-left ${left.cls}">&middot; ${left.text}</span></span>
          </li>
        </ul>
        ${footerHtml}
      </div>
    </div>`;
}
