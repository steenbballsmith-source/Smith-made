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
  heroPoster: "",

  /* ---- PRODUCT PHOTOS -------------------------------------
     Drop each product photo into assets/img/catalog/ and add
     one line here. The name on the left must match the list
     below exactly (it's the product's id). Example:
       "arch-welcome-wall": "assets/img/catalog/arch-welcome-wall.jpg",

     Product ids (No. 01-10):
       arched-welcome        seating-chart-wall
       family-round          champagne-wall
       unplugged-ceremony    bar-menu
       grand-arch-welcome-wall  ceremony-arch-set
       slat-backdrop         mobile-bar                     */
  photos: {
  },

  /* ---- GALLERY --------------------------------------------
     Real-wedding and shop photos. Drop files into
     assets/img/gallery/ and add one line per photo:
       "assets/img/gallery/june-wedding-01.jpg",
     The gallery section stays hidden until this list has at
     least one photo in it.                                  */
  gallery: [
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
  phone: "",                 /* e.g. "(864) 555-0123"        */
  instagram: ""              /* e.g. "https://instagram.com/smithmadesc" */
};
