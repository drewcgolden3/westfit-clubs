/* =========================================================================
   WESTFIT CLUBS — CONCEPT SITE CONFIG
   -------------------------------------------------------------------------
   Design concept prepared by The Switchboard Company.
   Every editable value lives here. The booking buttons currently open an
   in-page preview scheduler; going live means dropping in the real booking
   URL and nothing else on the site has to change.
   ========================================================================= */

window.SITE_CONFIG = {

  brand: {
    name: "WestFit Clubs",
    shortName: "WC",
    tagline: "Tennis, Swim and Fitness in Westford",
  },

  contact: {
    venueName: "WestFit Clubs",
    address: "4 Littleton Road, Westford, MA 01886",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=WestFit+Clubs+Westford+MA",
    phone: "(978) 692-7597",
    phoneHref: "tel:+19786927597",
    email: "pduffy@westfitclubs.com",
  },

  booking: {
    court: {
      type: "embed",
      demo: true,
      embedUrl: "https://book.westfit-clubs.example/schedule",
      title: "Reserve a Court",
      subtitle: "Tennis or pickleball courts, live availability.",
      services: [{"name": "Tennis court", "meta": "60 min \u00b7 indoor"}, {"name": "Pickleball court", "meta": "60 min \u00b7 up to 4"}, {"name": "Private lesson", "meta": "60 min \u00b7 with a pro"}, {"name": "Swim lesson", "meta": "30 min \u00b7 private"}],
      fallbackEmail: {
        to: "pduffy@westfitclubs.com",
        subject: "Reserve a Court",
        body: "Hi WestFit Clubs,\n\nI'd like to book. Here are my details:\n\n- Name:\n- Adult or junior:\n- Level:\n- Preferred days & times:\n\nThank you!",
      },
    },

    jrtennis: {
      type: "embed",
      demo: true,
      embedUrl: "https://book.westfit-clubs.example/schedule",
      title: "Junior Tennis",
      subtitle: "Tennis or pickleball courts, live availability.",
      services: [{"name": "Tennis court", "meta": "60 min \u00b7 indoor"}, {"name": "Pickleball court", "meta": "60 min \u00b7 up to 4"}, {"name": "Private lesson", "meta": "60 min \u00b7 with a pro"}, {"name": "Swim lesson", "meta": "30 min \u00b7 private"}],
      fallbackEmail: {
        to: "pduffy@westfitclubs.com",
        subject: "Junior Tennis",
        body: "Hi,\n\nI'd like to register for Junior Tennis.\n\nThank you!",
      },
    },

    swimschool: {
      type: "embed",
      demo: true,
      embedUrl: "https://book.westfit-clubs.example/schedule",
      title: "Swim School",
      subtitle: "Tennis or pickleball courts, live availability.",
      services: [{"name": "Tennis court", "meta": "60 min \u00b7 indoor"}, {"name": "Pickleball court", "meta": "60 min \u00b7 up to 4"}, {"name": "Private lesson", "meta": "60 min \u00b7 with a pro"}, {"name": "Swim lesson", "meta": "30 min \u00b7 private"}],
      fallbackEmail: {
        to: "pduffy@westfitclubs.com",
        subject: "Swim School",
        body: "Hi,\n\nI'd like to register for Swim School.\n\nThank you!",
      },
    },

    swim: {
      type: "embed",
      demo: true,
      embedUrl: "https://book.westfit-clubs.example/schedule",
      title: "Private Lessons",
      subtitle: "Tennis or pickleball courts, live availability.",
      services: [{"name": "Tennis court", "meta": "60 min \u00b7 indoor"}, {"name": "Pickleball court", "meta": "60 min \u00b7 up to 4"}, {"name": "Private lesson", "meta": "60 min \u00b7 with a pro"}, {"name": "Swim lesson", "meta": "30 min \u00b7 private"}],
      fallbackEmail: {
        to: "pduffy@westfitclubs.com",
        subject: "Private Lessons",
        body: "Hi,\n\nI'd like to register for Private Lessons.\n\nThank you!",
      },
    },

    training: {
      type: "embed",
      demo: true,
      embedUrl: "https://book.westfit-clubs.example/schedule",
      title: "Book a Trainer",
      subtitle: "Tennis or pickleball courts, live availability.",
      services: [{"name": "Tennis court", "meta": "60 min \u00b7 indoor"}, {"name": "Pickleball court", "meta": "60 min \u00b7 up to 4"}, {"name": "Private lesson", "meta": "60 min \u00b7 with a pro"}, {"name": "Swim lesson", "meta": "30 min \u00b7 private"}],
      fallbackEmail: {
        to: "pduffy@westfitclubs.com",
        subject: "Book a Trainer",
        body: "Hi,\n\nI'd like to register for Book a Trainer.\n\nThank you!",
      },
    },

    pickleball: {
      type: "embed",
      demo: true,
      embedUrl: "https://book.westfit-clubs.example/schedule",
      title: "Pickleball",
      subtitle: "Tennis or pickleball courts, live availability.",
      services: [{"name": "Tennis court", "meta": "60 min \u00b7 indoor"}, {"name": "Pickleball court", "meta": "60 min \u00b7 up to 4"}, {"name": "Private lesson", "meta": "60 min \u00b7 with a pro"}, {"name": "Swim lesson", "meta": "30 min \u00b7 private"}],
      fallbackEmail: {
        to: "pduffy@westfitclubs.com",
        subject: "Pickleball",
        body: "Hi,\n\nI'd like to register for Pickleball.\n\nThank you!",
      },
    },

    camp: {
      type: "embed",
      demo: true,
      embedUrl: "https://book.westfit-clubs.example/schedule",
      title: "Register for Camp",
      subtitle: "Tennis or pickleball courts, live availability.",
      services: [{"name": "Tennis court", "meta": "60 min \u00b7 indoor"}, {"name": "Pickleball court", "meta": "60 min \u00b7 up to 4"}, {"name": "Private lesson", "meta": "60 min \u00b7 with a pro"}, {"name": "Swim lesson", "meta": "30 min \u00b7 private"}],
      fallbackEmail: {
        to: "pduffy@westfitclubs.com",
        subject: "Register for Camp",
        body: "Hi,\n\nI'd like to register for Register for Camp.\n\nThank you!",
      },
    },

    secondary: {
      type: "embed",
      demo: true,
      embedUrl: "https://book.westfit-clubs.example/schedule",
      title: "Tennis-Only Membership",
      subtitle: "If you are here for the courts and nothing else, there is a membership priced for exactly that.",
      services: [{"name": "Tennis court", "meta": "60 min \u00b7 indoor"}, {"name": "Pickleball court", "meta": "60 min \u00b7 up to 4"}, {"name": "Private lesson", "meta": "60 min \u00b7 with a pro"}, {"name": "Swim lesson", "meta": "30 min \u00b7 private"}],
      fallbackEmail: {
        to: "pduffy@westfitclubs.com",
        subject: "Tennis-Only Membership",
        body: "Hi WestFit Clubs,\n\nI'm interested in Tennis-Only Membership.\n\nThank you!",
      },
    },
  },
};
