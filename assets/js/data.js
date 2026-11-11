/* All content for the MUFASA site.
   REAL = taken from MUFASA's EPK, SoundCloud, YouTube, Instagram, Linktree (Nov 2026).
   MOCK = invented for this concept site; marked inline. */

const SCT = id => `https://api.soundcloud.com/tracks/${id}`;

window.MUFASA = {
  links: {
    soundcloud: "https://soundcloud.com/mufasa_ofir_meir",
    horizonPlaylist: "https://soundcloud.com/mufasa_ofir_meir/sets/mufasa-horizon-series",
    youtube: "https://www.youtube.com/@MufasaSoulTrance",
    spotify: "https://open.spotify.com/artist/0R10ImF36hKI8UydOtklN6",
    instagram: "https://www.instagram.com/mufasa.soul.trance/",
    facebook: "https://www.facebook.com/profile.php?id=61590630098518",
    linktree: "https://linktr.ee/mufasa.soul.trance",
    epk: "https://drive.google.com/file/d/1Fjq1RikZKZyQO_E6P6zsSL9gJOrPjirK/view",
    email: "lionking1008@gmail.com",
    interview: "https://www.youtube.com/watch?v=49zcWd8tcqg",
    liveReel: "https://www.instagram.com/reel/De-R0DFFBzF/",
  },

  /* REAL: the Horizon Series. Episode 02 and 05 are MOCK placeholders for the unreleased parts of the night. */
  horizon: [
    {
      ep: "01", title: "Golden Hour", clock: "18:30", phase: "Sunset",
      band: "linear-gradient(90deg,#f5a524 0%,#c2410c 30%,#6d28d9 100%)",
      art: "assets/img/art/golden-hour.jpg", sc: SCT(2432885223), scPage: "https://soundcloud.com/mufasa_ofir_meir/01-rec-2026-11-05", yt: "JNOq6H0lAxI",
      text: "The journey begins as the sun sets. Warm melodies, soulful grooves, uplifting techno and progressive trance: an invitation to leave the day behind.",
      list: `00:00:00|Chant of Freedom - Darwish
00:06:03|Bungee Jump - Astrix, Captain Hook (Perfect Stranger remix)
00:12:11|MANTRA - Argy, Omiki, Lell Nahar
00:15:39|Etnica In Dub - Nix (Nix rework)
00:19:39|Presence - Ace Ventura (Interactive Noise remix)
00:24:08|Liquid Hook - Liquid Soul, Victor Ruiz, Captain Hook (Victor Ruiz remix)
00:27:39|Mother - Kaufmann
00:30:46|Raven Raver - Kobi, In Between
00:33:21|Teleport - Man With No Name (Save the Robot remix)
00:38:09|24/7 - Broosh
00:42:47|Omiki - Balkan
00:46:53|Ibu 3000 - Kaufmann
00:51:49|Let There Be Light - Captain Hook (Libra remix)
00:57:52|Trip Tonight - Etnica (Loud remix)
01:02:47|Black Velvet - Artur Achziger, Karlo Wanny
01:09:12|Sound Healing - Mufasa`
    },
    {
      ep: "02", title: "Blue Hour", clock: "19:40", phase: "Dusk", soon: "In the studio", /* MOCK */
      band: "linear-gradient(90deg,#1e3a8a 0%,#0891b2 45%,#4c1d95 100%)",
      text: "The sun is gone, the first star is out. The bridge between the warm-up and the dark: rolling progressive, more space, less light."
    },
    {
      ep: "03", title: "Nightfall", clock: "21:00", phase: "Night",
      band: "linear-gradient(90deg,#312e81 0%,#6d28d9 50%,#be185d 100%)",
      art: "assets/img/art/nightfall.jpg", sc: SCT(2355138176), scPage: "https://soundcloud.com/mufasa_ofir_meir/horizon-series-03-nightfall-dj", yt: "BxgNw4Tp-GM",
      text: "Darkness settles in and the night comes alive. Driving rhythms, rich atmospheres and growing intensity carry the journey into its deepest hours.",
      list: `00:00:00|Bear Line - Dekel
00:07:25|Gated Sky - Oxiv
00:11:36|Sedated - Shtuby
00:19:08|Alchemy - Artmis
00:25:14|Liquid Hook - Liquid Sky, Captain Hook (Gorovich remix)
00:29:15|Bungee Jump - Captain Hook (Lish remix)
00:34:07|Inside - Gorovich
00:38:21|Sadhu - Rising Dust, Skizologic
00:43:27|The Point - Kanok, Detune
00:45:46|Ravers Army - Vini Vici
00:51:12|Horizons - Aura Vortex, Blazy (Phaxe remix)
00:57:11|Spiritual Beings - Ace Ventura, Asgard
01:04:09|Sound Life Freedom - Shivatree
01:06:33|Back Into the Wild - Biolight, Kosta
01:11:18|Dun Dun - Dekel, Shtuby
01:16:17|Ritual - Artmis`
    },
    {
      ep: "04", title: "Midnight Horizon", clock: "00:00", phase: "Peak",
      band: "linear-gradient(90deg,#0b0718 0%,#1e1b4b 40%,#0e7490 100%)",
      art: "assets/img/art/midnight-horizon.jpg", sc: SCT(2405602713), scPage: "https://soundcloud.com/mufasa_ofir_meir/horizon-series-04-midnight", yt: "mHglLLyLOoA",
      text: "The night reaches its peak. Powerful psytrance, driving basslines and euphoric melodic moments, where rhythm, emotion and psychedelic energy collide.",
      list: `00:00:00|Starting to Feel - Rising Dust
00:05:44|Subinya - Loud (Ace Ventura remix)
00:11:06|Dunes - Ritmo, Asgard
00:15:53|Kof Tibeti - Space Cat, Pixel
00:17:49|Voices - Detune, Bigitam
00:22:10|Abduction 101 - Biolight
00:25:49|Darkside - Kobi, Oxiv
00:30:55|Nothing to Worry About - Space Cat, Pixel
00:32:44|Cereal - Tzabi
00:35:54|Astral Pancakes - Hallucinogen (Soundaholix, Domestic & Pixel remix)
00:40:52|Eigengrau - Kobi, Migdalor
00:45:36|The Source - Artmis, Amigdala
00:50:00|Youmma - Libra
00:55:41|Navras - Juno Reactor (Bliss remix)
00:59:31|Abracadabra - X-Noize, Narkissi
01:05:30|Pac-Man Theory - Modus
01:08:31|The Lost Diamond - Captain Hook, Skizologic
01:13:29|Subjective - Libra
01:18:21|Dream - Burn in Noise, Shivatree (Inside Mind remix)
01:20:10|Meditation - Biolight
01:24:57|Sacred Shamans - Terra, Major7
01:31:19|Why Worry - Mufasa`
    },
    {
      ep: "05", title: "Dawn", clock: "05:40", phase: "First light", soon: "Premiere Jan 2027", /* MOCK */
      band: "linear-gradient(90deg,#be185d 0%,#f472b6 40%,#67e8f9 100%)",
      text: "The last episode of the night. The sky opens, the tempo eases, and the dancefloor walks out into the morning together."
    }
  ],

  /* REAL: originals. Stories paraphrased from MUFASA's own YouTube release notes. */
  originals: [
    {
      id: "sound-healing", title: "Sound Healing", date: "13 Jul 2026", plays: "255 plays",
      art: "assets/img/art/sound-healing.jpg", sc: SCT(2360069381), scPage: "https://soundcloud.com/mufasa_ofir_meir/sound-healing", yt: "asoT7YqhYEg",
      quote: "“It tells my story, and perhaps that of many others.”",
      text: "The first track. Nine months from the first note to release. It doesn't follow any genre's rules. It goes from pain, frustration and rage, through the strongest healing tool he knows, to light and calm.",
      credits: [["Production", "Ofir Meir"], ["Vocal", "Limor Bachar"], ["Guitar", "Ami Sterling"]]
    },
    {
      id: "masks-off", title: "Masks Off", date: "15 Sep 2026", plays: "170 views",
      art: "assets/img/art/masks-off.jpg", sc: SCT(2374206437), scPage: "https://soundcloud.com/mufasa_ofir_meir/masks-off", yt: "X3ODDjnSJu8",
      quote: "“In this noise I find my silence.”",
      text: "Melodic trance about dropping the masks we are used to wearing. No explanations needed, no definitions required. It closed the birthday set.",
      credits: [["Production", "Ofir Meir"], ["Mixing", "Biolight"]]
    },
    {
      id: "tribal-roots", title: "Tribal Roots", feat: "feat. Berto", date: "23 Sep 2026", plays: "39 plays",
      art: "assets/img/constellation-lion.jpg", sc: SCT(2405525229), scPage: "https://soundcloud.com/mufasa_ofir_meir/tribal-roots-featuring-berto",
      quote: "“Back to the drum.”", /* MOCK line */
      text: "A collaboration with Berto. Hand percussion and a rolling progressive bassline, built around the oldest dance there is.", /* MOCK description */
      credits: [["Production", "Ofir Meir"], ["Featuring", "Berto"]]
    },
    {
      id: "why-worry", title: "Why Worry", date: "11 Nov 2026", plays: "Out today", isNew: true,
      art: "assets/img/art/why-worry.jpg", sc: SCT(2374206071), scPage: "https://soundcloud.com/mufasa_ofir_meir/why-worry", yt: "q-HHcyZXJs8",
      quote: "“Let the music speak for itself now.”",
      text: "Soaked in the colours, scents and spirit of India, his favourite place in the world. Sitar, tabla and an Indian female vocal, with a simple message that runs deeper than it sounds.",
      credits: [["Production", "Ofir Meir"], ["Mixing", "Biolight"]]
    }
  ],

  /* REAL: Birthday set 27.8.26, 2.5 hours, recorded live. */
  bday: {
    yt: "07K_ATuu5UI", sc: SCT(2420543118), scPage: "https://soundcloud.com/mufasa_ofir_meir/mufasa-b-day-set-27-8-26",
    art: "assets/img/art/bday-set.jpg", end: 2 * 3600 + 30 * 60,
    list: `00:00|Take Off - Mufasa (unreleased)
06:27|Octopus - Art of Trance (3 of Life & Domestic remix)
09:29|Shivatron - Porat
14:30|Teleport - Man With No Name (Antinomy remix)
19:00|Eigengrau - Kobi, Migdalor
23:44|Golden Hour - Dekol, Modus
26:27|Light Inside You - Mufasa (unreleased)
34:20|Rebirth - Ace Ventura (Faders & Blazy remix)
38:50|Maisamma - Animato
43:47|Cloud Passing - Ritmo, Pettra
49:19|Navras - Juno Reactor (Bliss remix)
53:09|Optimistic Resonance - Kosta, Artmis
57:12|Jupiter - Detune, Mystic
1:01:29|Inside - Gorovich
1:05:52|Why Worry - Mufasa (unreleased)
1:13:35|Negev - Animato, Pettra
1:17:32|Anything & Everything - Pixel, Vini Vici
1:21:22|The Point - Kanok, Detune
1:23:02|Two Full Moons & a Trout - Union Jack (Freedom Fighters, Domestic & Pixel remix)
1:28:24|Om Namah Shivaya - Electric Universe, Greg
1:32:34|Coolio - Astrix (Darwish remix)
1:37:25|Asfur - Darwish, Pettra
1:43:10|Dunes - Ritmo, Asgard
1:47:27|I Am the Flute - Darwish, Multiverse
1:51:57|Rituals - Artmis
1:53:09|Lucy - Rising Dust, Subway Shamans (Volcano remix)
2:01:11|Mysticism - Zyce
2:04:00|Soft & Crunchy - Pixel, No Spoon
2:06:49|Snooze Off - Pixel, No Spoon
2:09:38|Takatini - Awen, Breezer Live, Crazy Box
2:12:03|Sacred Shamans - Terra, Major7
2:16:23|Dance as One - Darwish
2:23:46|Masks Off - Mufasa`
  },

  /* REAL videos */
  videos: [
    { yt: "49zcWd8tcqg", title: "Interview on “HaBit HaBa”", sub: "Roy Schochat hosts MUFASA · 13.10.2026", big: true },
    { yt: "q-HHcyZXJs8", title: "Why Worry", sub: "Official audio · 11.11.2026" },
    { yt: "X3ODDjnSJu8", title: "Masks Off", sub: "Official audio · 170 views" },
    { yt: "07K_ATuu5UI", title: "Birthday set 27.8.26", sub: "2h 30m live · 481 views" },
    { yt: "XzL-l122XKU", title: "DJ set POV", sub: "Short · 27.10.2026" },
    { yt: "asoT7YqhYEg", title: "Sound Healing", sub: "The first track · 15.7.2026" },
  ],

  /* MOCK upcoming dates */
  dates: [
    { d: "27", m: "Nov 2026", dow: "Fri", event: "Shanti Gathering", where: "Arava desert, Israel", coord: "30.06°N 35.12°E", slot: "Sunset set · 17:00", status: "Tickets" },
    { d: "12", m: "Dec 2026", dow: "Sat", event: "Horizon Series Live: Nightfall", where: "The Hangar, Tel Aviv", coord: "32.08°N 34.78°E", slot: "Nightfall set · 23:30", status: "Tickets" },
    { d: "31", m: "Dec 2026", dow: "Thu", event: "Dawn Ceremony NYE", where: "Ramon Crater, Mitzpe Ramon", coord: "30.61°N 34.80°E", slot: "Sunrise set · 05:00", status: "Sold out" },
    { d: "23", m: "Jan 2027", dow: "Sat", event: "Horizon 05: Dawn premiere", where: "Haifa, Israel", coord: "32.79°N 34.99°E", slot: "Full night · 22:00", status: "Soon" },
    { d: "14", m: "Feb 2027", dow: "Sun", event: "Full Moon Under the Palms", where: "Vagator, Goa, India", coord: "15.60°N 73.73°E", slot: "Midnight set · 00:00", status: "Soon" },
  ],

  /* REAL Instagram posts (dates and subjects from the public profile) */
  notes: [
    { href: "https://www.instagram.com/mufasa.soul.trance/reel/DfZXmwgoCIF/", kind: "Reel", date: "06 Nov 2026", text: "Horizon Series poster drop", n: ["#3b1c6e", "#0e7490"] },
    { href: "https://www.instagram.com/mufasa.soul.trance/reel/DfSZMh5DVgf/", kind: "Reel", date: "03 Nov 2026", text: "Studio humour, trance edition", n: ["#4c1d95", "#be185d"] },
    { href: "https://www.instagram.com/mufasa.soul.trance/reel/DfCwkbjmlsA/", kind: "Reel", date: "28 Oct 2026", text: "A cartoon about the scene", n: ["#1e1b4b", "#6d28d9"] },
    { href: "https://www.instagram.com/reel/De-R0DFFBzF/", kind: "Reel", date: "26 Oct 2026", text: "A peek from inside a live set", n: ["#0b0718", "#0891b2"] },
    { href: "https://www.instagram.com/roy.schochat/reel/DequsDeoJWO/", kind: "Collab", date: "19 Oct 2026", text: "On air with Roy Schochat", n: ["#831843", "#4c1d95"] },
    { href: "https://www.instagram.com/mufasa.soul.trance/p/DepgpMpNqlD/", kind: "Post", date: "18 Oct 2026", text: "Words before the set", n: ["#312e81", "#be185d"] },
    { href: "https://www.instagram.com/mufasa.soul.trance/p/DekYGOeNz2t/", kind: "Post", date: "16 Oct 2026", text: "Birthday set is out", n: ["#c2410c", "#6d28d9"] },
    { href: "https://www.instagram.com/mufasa.soul.trance/reel/Dde3wEIMnu2/", kind: "Reel", date: "19 Sep 2026", text: "Masks Off, dropping for the first time", n: ["#0e7490", "#4c1d95"] },
    { href: "https://www.instagram.com/mufasa.soul.trance/p/DdI85IICt5c/", kind: "Post", date: "11 Sep 2026", text: "The MUFASA poster, outdoors", n: ["#6d28d9", "#f5a524"] },
    { href: "https://www.instagram.com/mufasa.soul.trance/p/Dctd0SrDy19/", kind: "Post", date: "31 Aug 2026", text: "Night lights on the water", n: ["#1e3a8a", "#d946ef"] },
  ]
};
