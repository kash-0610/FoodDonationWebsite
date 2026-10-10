# PlateShare - Food Donation Network

PlateShare connects people who have extra food (caterers, hotels, college messes, events) with NGOs that can use it, so good food doesn't end up in the trash.

This is our first project as second year AI & Data Science engineering students (team of 4).

## What it does

- **Home** - shows how the site works and how many donations are available right now
- **Donor Portal** - fill a form to post surplus food (what, how much, where, and the pickup deadline). You can see your own listings and remove them
- **NGO Portal** - browse available food, search it, filter by category, see how much time is left and claim it. Once it's claimed nobody else can take it

## Built with

- HTML, CSS and plain JavaScript (no framework)
- [Supabase](https://supabase.com) for the database
- [Ionicons](https://ionic.io/ionicons) for the icons
- Inter font from Google Fonts

## How to run it

1. Download or clone this repo
2. Open the folder in VS Code and run `index.html` with the Live Server extension (or just double click it)
3. Go to your Supabase project -> SQL Editor and run everything in `supabase-setup.sql` (only needed once)

## Files

| File | What it is |
| --- | --- |
| `index.html` | home page |
| `donor.html` | donor portal |
| `ngo.html` | NGO portal |
| `style.css` | styling for all the pages |
| `app.js` | stuff every page uses (menu, time left, popup messages, card html) |
| `home.js` | the numbers on the home page |
| `donor.js` | posting and removing listings |
| `ngo.js` | searching, filtering and claiming |
| `supabase.js` | connects to Supabase |
| `supabase-setup.sql` | database changes |

## Things we want to add later

- Login for donors and NGOs (right now listings are linked to the browser you posted from)
- Photos for the food listings
- Notifications (WhatsApp / SMS) when a listing gets claimed
- Map to show pickup locations

## Team

1.Shaikh Khadija Liyaquat
2.Sayyed Fouziya Abdul Razzaque
3.Mahale Bhavini Santosh
4.Kolsune Mrunali Muralidhar
