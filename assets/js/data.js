/* Marshall Advertising Company – shared content store.
   Public site and admin panel both read from here.
   Admin edits are saved to localStorage (demo). Swap for a real API later. */
(function () {
  var KEY = 'marshall_data_v1';

  var defaults = {
    settings: {
      company: 'Marshall Advertising Company',
      phone1: '9811490033',
      phone2: '9811470033',
      email: 'connect@macad.in',
      address: ['A-269, 3rd Floor', 'Defence Colony', 'Bhishma Pitamah Marg', 'New Delhi – 110024'],
      tagline: 'Converting the abstract into the absolute.',
      popup: {
        enabled: true,
        eyebrow: 'Welcome to Marshall',
        title: 'Ideas made visible.',
        emphasis: 'Stories made memorable.',
        text: 'Print, electronic, outdoor, events and digital – one agency for the whole conversation. Bring us a brief, a deadline, or simply an idea you want to explore.',
        cta: 'Start a conversation',
        link: 'contact.html'
      }
    },
    services: [
      { id: 1, icon: 'news', title: 'Print Media', desc: 'Be it print ads in newspapers and magazines, trust us to deliver – squeezing more value out of your limited budget.' },
      { id: 2, icon: 'books', title: 'Print Production', desc: 'Coffee table books, reports or publications with large print runs, we go the extra mile to ensure customer delight.' },
      { id: 3, icon: 'tv', title: 'Electronic Media', desc: 'Your TVCs, Videos, AVs or Radio will have the best names in the industry enhancing your brand visibility and bottom line.' },
      { id: 4, icon: 'easel', title: 'Exhibitions and Events', desc: 'When experiential is everything, expect us to support your desire to stand out in the crowd … and more.' },
      { id: 5, icon: 'board', title: 'Outdoor', desc: 'From mass transit to bill boards and everything in between, we will make sure that your brand is visible and out there. Wherever it needs to be.' },
      { id: 6, icon: 'mega', title: 'Digital Marketing and Social Media', desc: 'Whatever it takes, from innovative digital marketing campaigns, e-mailers, QR coded collaterals and invites, websites we do it all.' }
    ],
    portfolio: [
      { id: 1, title: '120 Years of PHDCCI', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 2, title: 'National Students’ Convocation', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 3, title: '100 Years of ASSOCHAM', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 4, title: 'ASSOCHAM Annual Conference', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 5, title: 'New Delhi: Aspiring $5 Trillion Economy', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 6, title: 'Vision for India’s Growth Story', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 7, title: 'ASSOCHAM Centenary Highlights', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 8, title: 'GST Launch Campaign', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 9, title: 'National Highways Builders Federation', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 10, title: 'PHDCCI 117th Annual Session', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 11, title: 'India at the Helm of G20', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 12, title: 'Infrastructural Conclave', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 13, title: 'Weaves & Crafts from the Heart of India', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 14, title: 'Silk Delights for the Festival of Lights', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 15, title: 'New Season Textile Campaign', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 16, title: 'Weaving Ancient Folklore', cat: 'Print Ads', tag: 'Print Advertising', img: '' },
      { id: 17, title: 'DBT Coffee Table Book', cat: 'Books', tag: 'Coffee Table Book', img: '' },
      { id: 18, title: 'Compendium Book 2020', cat: 'Books', tag: 'Compendium', img: '' },
      { id: 19, title: 'BIRAC4', cat: 'Books', tag: 'Publication', img: '' },
      { id: 20, title: 'BCIL5', cat: 'Books', tag: 'Publication', img: '' },
      { id: 21, title: 'ASSOCHAM January Bulletin', cat: 'Bulletins & Newsletters', tag: 'Bulletin', img: '' },
      { id: 22, title: 'Kaleidoscope January Issue', cat: 'Bulletins & Newsletters', tag: 'Newsletter', img: '' },
      { id: 23, title: 'AAI Newsletter — Issue 04', cat: 'Bulletins & Newsletters', tag: 'Newsletter', img: '' },
      { id: 24, title: 'BCIL1', cat: 'Bulletins & Newsletters', tag: 'Newsletter', img: '' }
    ],
    clients: [
      { id: 1, name: 'SCOPE', logo: '' },
      { id: 2, name: 'Mrignayani', logo: '' },
      { id: 3, name: 'ASSOCHAM', logo: '' },
      { id: 4, name: 'PHD Chamber', logo: '' },
      { id: 5, name: 'BCIL', logo: '' },
      { id: 6, name: 'Govt. of India', logo: '' },
      { id: 7, name: 'Canara HSBC Life', logo: '' },
      { id: 8, name: 'Northern Railway', logo: '' },
      { id: 9, name: 'PFC', logo: '' }
    ],
    testimonials: [
      { id: 1, name: 'Deepak Kumar', role: 'Chief Public Relation Officer', org: 'Northern Railway', quote: 'As someone who was a client of Mr. Khurana for three years, I’ve benefited from his problem-solving, tireless work ethic and willingness to do whatever it takes to turn a client’s brief into interesting communication solutions.', home: true },
      { id: 2, name: 'Manju Negi', role: 'Director (PR)', org: 'ASSOCHAM', quote: 'Marshall Advertising can easily be described as conscientious, dedicated and meticulous. The agency remains eager to learn new skills, tools and technologies and is ever ready to adopt new dimensions at work. It’s a delight to have them take care of your project.', home: true },
      { id: 3, name: 'Vibha Ahuja', role: 'Chief General Manager', org: 'BCIL', quote: 'Having worked across various facets of advertising, marketing & digital, Marshall Advertising has robust experience in the overall sphere of marketing & communications – especially in the public enterprise, non-profit and the biotechnology sector.', home: true },
      { id: 4, name: 'B. N. Tiwari', role: 'Dy. Chief General Manager (I/C)', org: 'MP Laghu Udhyog Nigam', quote: 'I’ve known BK for more than two decades in different roles. From a mature manager 24 years ago to a seasoned senior leader with a strategic mindset and excellent people skills, the passion he showed as a young executive remains.', home: false }
    ]
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && typeof s === 'object') return Object.assign(clone(defaults), s);
    } catch (e) { /* ignore */ }
    return clone(defaults);
  }

  window.MarshallStore = {
    key: KEY,
    get: load,
    save: function (d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} },
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} },
    defaults: defaults
  };
  window.SITE = load();
})();
