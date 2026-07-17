/* ============================================================
   SMITH MADE — MEDIA & CONTACT SETTINGS
   ============================================================
   This is the only file you need to edit when you add photos
   or video. The recipe is always the same:

     1. Drop the file into the right folder inside assets/
     2. Update ONE line below so the site knows it exists.

   Anything left as "" (empty quotes) is simply skipped — the
   site shows its built-in artwork instead. You can't break
   the site by leaving things empty.
   ============================================================ */

window.SMITH_MADE = {

  /* ---- HERO VIDEO -----------------------------------------
     Film a clip of a build or a finished piece at a venue,
     save it as assets/video/hero.mp4, then set:
       heroVideo: "assets/video/hero.mp4",
     Until then the hero shows the still image below.        */
  heroVideo: "",

  /* ---- HERO STILL IMAGE -----------------------------------
     A wide photo (landscape, roughly 1600x900) shown behind
     the headline — and shown while the video loads too.
     Drop it in assets/img/ and point to it here:            */
  heroPoster: "assets/img/hero-poster.jpg",

  /* ---- PRODUCT PHOTOS -------------------------------------
     Drop each product photo into assets/img/catalog/ and add
     one line here. The name on the left must match the list
     below exactly (it's the product's id). Example:
       "arch-welcome-wall": "assets/img/catalog/arch-welcome-wall.jpg",

     Product ids:
       arch-welcome-wall     arched-welcome-sign
       a-frame-welcome-sign  live-edge-welcome-sign
       seating-chart-wall    framed-seating-chart
       champagne-wall        mobile-bar
       ceremony-arch         keepsake-established-sign      */
  photos: {
    "seating-chart-wall": "assets/img/catalog/seating-chart-wall.jpg",
    "framed-seating-chart": "assets/img/catalog/framed-seating-chart.jpg",
    "champagne-wall": "assets/img/catalog/champagne-wall.jpg",
    "arch-welcome-wall": "assets/img/catalog/arch-welcome-wall.jpg",
  },

  /* ---- GALLERY --------------------------------------------
     Real-wedding and shop photos. Drop files into
     assets/img/gallery/ and add one line per photo:
       "assets/img/gallery/june-wedding-01.jpg",
     The gallery section stays hidden until this list has at
     least one photo in it.                                  */
  gallery: [
  ],

  /* ---- INQUIRY FORM ---------------------------------------
     Leave empty and the form opens the visitor's email app
     with everything pre-filled, addressed to you. To receive
     inquiries directly instead: make a free account at
     formspree.io, create a form, and paste its link here:
       formEndpoint: "https://formspree.io/f/YOUR-ID",       */
  formEndpoint: "",

  /* ---- CONTACT DETAILS ------------------------------------ */
  email: "steenbballsmith@gmail.com",
  phone: "",                 /* e.g. "(864) 555-0123"        */
  instagram: ""              /* e.g. "https://instagram.com/smithmadesc" */
};
