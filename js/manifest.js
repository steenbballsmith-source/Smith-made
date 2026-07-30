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
  heroPoster: "assets/img/hero-staged.jpg",

  /* ---- PRODUCT PHOTOS -------------------------------------
     Drop each product photo into assets/img/catalog/ and add
     one line here. The name on the left must match the list
     below exactly (it's the product's id). Example:
       "arch-welcome-wall": "assets/img/catalog/arch-welcome-wall.jpg",

     Product ids (No. 01-08):
       arched-welcome        seating-chart-wall
       family-round          champagne-wall
       grand-arch-welcome-wall  ceremony-arch-set
       slat-backdrop         mobile-bar                     */
  photos: {
  },

  /* ---- GALLERY --------------------------------------------
     Real-wedding and shop photos. Drop files into
     assets/img/gallery/ and add one line per photo. Either
     form works:
       "assets/img/gallery/june-wedding-01.jpg",
       { src: "assets/img/gallery/june.jpg", finish: "Natural oak" },
     The second form prints that little caption under the photo.
     The gallery stays hidden until this list has one photo.  */
  gallery: [
    { src: "assets/img/gallery/staged-arch-riser.jpg", finish: "The Arched Welcome · natural white oak" },
    { src: "assets/img/gallery/staged-arch-opening.jpg", finish: "Grand Arch Welcome Wall · painted cream" },
    { src: "assets/img/gallery/staged-bar-fluted.jpg", finish: "The Mobile Bar · fluted natural oak" },
    { src: "assets/img/gallery/staged-slat-arch-black.jpg", finish: "Slat Monogram Backdrop · blackened frame, oak slats" },
    { src: "assets/img/gallery/staged-champagne-wall.jpg", finish: "Champagne Wall · natural white oak" },
    { src: "assets/img/gallery/staged-welcome-panel.jpg", finish: "Seating Chart Wall · painted panel, walnut base" },
    { src: "assets/img/gallery/staged-cream-bar.jpg", finish: "The Mobile Bar · painted cream with an oak top" },
    { src: "assets/img/gallery/staged-heart.jpg", finish: "Keepsake shapes · natural white oak" },
    { src: "assets/img/gallery/staged-display-shelf.jpg", finish: "Display wall · painted cream" },
    { src: "assets/img/gallery/staged-arch-trio.jpg", finish: "Ceremony Arch Set · natural birch" },
    { src: "assets/img/gallery/staged-round-disc.jpg", finish: "The Family Round · natural white oak" },
    { src: "assets/img/gallery/staged-wave-backdrop.jpg", finish: "Slat Monogram Backdrop · sculpted wave edge" },
    { src: "assets/img/gallery/staged-bar-round.jpg", finish: "The Mobile Bar · round, natural oak" },
    { src: "assets/img/gallery/staged-walkthrough.jpg", finish: "Grand Arch Welcome Wall · natural birch" },
  ],

  /* ---- PAYMENTS: THE $50 DATE HOLD ------------------------
     Lets couples lock their date on the spot. Make a FREE
     Square account (squareup.com), link your bank, then in
     Square go to: Payment Links -> Create link -> "Collect a
     payment" -> name it "Smith Made Date Hold", amount $50.
     Copy the link Square gives you and paste it here:
       dateHoldUrl: "https://square.link/u/XXXXXXXX",
     The "pay your date hold" button appears on the site the
     moment this line is filled in. Money lands in your linked
     bank account (Square pays out next business day).        */
  dateHoldUrl: "https://square.link/u/w6KAdXlo",

  /* ---- INQUIRY FORM ---------------------------------------
     The form sends straight to the email below through
     FormSubmit (free, no account). ONE-TIME ACTIVATION: the
     very first submission triggers a confirmation email to
     that inbox — open it and click the activate button once,
     and every inquiry after that lands in the inbox.
     (To route through Formspree instead, paste its link here
     in place of the FormSubmit one.)                         */
  formEndpoint: "https://formsubmit.co/ajax/will.smithmade@gmail.com",

  /* ---- CONTACT DETAILS ------------------------------------ */
  email: "will.smithmade@gmail.com",
  phone: "(541) 570-5570",
  instagram: ""              /* e.g. "https://instagram.com/smithmadesc" */
};
