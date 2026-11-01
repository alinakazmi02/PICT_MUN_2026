export const INITIAL_LISTINGS = [
  {
    id: 'LF-LOST-2026-1001',
    type: 'lost',
    title: 'Sony WH-1000XM4 Wireless Headphones',
    category: 'Electronics',
    description: 'Black Sony over-ear noise-cancelling headphones in a dark grey protective travel case. The left ear cushion has a tiny scuff mark. Extremely important as I need them for project audio editing.',
    brand: 'Sony',
    color: 'Matte Black',
    distinguishingFeatures: 'Small scratch near left hinge, custom anime sticker on inner headphone case.',
    date: '2026-10-15',
    time: 'Around 2:30 PM',
    location: 'Central Library',
    locationDetails: 'Left on the 2nd-floor silent study cubicle #14.',
    status: 'Possible Match',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    reporter: {
      name: 'Alina Kazmi',
      email: 'a.kazmi@campus.edu',
      contactPreference: 'In-app Claim & Campus Email',
      phone: '+1 (555) 234-5678'
    },
    createdAt: '2026-10-15T15:20:00Z',
    views: 142,
    isDemoUser: true
  },
  {
    id: 'LF-FOUND-2026-2001',
    type: 'found',
    title: 'Black Over-Ear Wireless Headphones in Case',
    category: 'Electronics',
    description: 'Found a premium black wireless over-ear headphone set left behind on a study desk. They are inside a hard zipper case with audio adapter cable.',
    brand: 'Sony',
    color: 'Black',
    distinguishingFeatures: 'Zipper case contains audio cable and sticker inside.',
    date: '2026-10-15',
    time: 'Approx. 4:00 PM',
    location: 'Central Library',
    locationDetails: 'Found on 2nd-floor study desk row B.',
    status: 'Active',
    handoverStatus: 'Submitted to College Office',
    handoverLocation: 'Central Library Reception Desk (Ticket #LIB-88)',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    secretDetail: 'Distinct sticker on the interior lid of the zipper case.',
    finder: {
      name: 'Priya Sharma',
      email: 'p.sharma@campus.edu',
      contactPreference: 'College Office Handover'
    },
    createdAt: '2026-10-15T16:30:00Z',
    views: 89,
    isDemoUser: false
  },
  {
    id: 'LF-FOUND-2026-2002',
    type: 'found',
    title: 'Cobalt Blue Insulated Water Bottle',
    category: 'Bottles and Lunch Boxes',
    description: 'Stainless steel vacuum insulated 32oz water bottle with wide mouth lid. Has several campus club and tech stickers on the exterior.',
    brand: 'Hydro Flask',
    color: 'Cobalt Blue',
    distinguishingFeatures: 'Includes a "Robotics Club 2025" and "Save Earth" sticker.',
    date: '2026-10-16',
    time: '1:15 PM',
    location: 'Campus Canteen & Cafeteria',
    locationDetails: 'Left near the juice bar corner table.',
    status: 'Active',
    handoverStatus: 'Currently With Finder',
    handoverLocation: 'Will meet at Student Center lobby or Canteen entrance.',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'
    ],
    secretDetail: 'Small dent on bottom rim and personalized initials engraved underneath.',
    finder: {
      name: 'Marcus Chen',
      email: 'm.chen@campus.edu',
      contactPreference: 'In-app Claim'
    },
    createdAt: '2026-10-16T13:45:00Z',
    views: 64,
    isDemoUser: false
  },
  {
    id: 'LF-LOST-2026-1002',
    type: 'lost',
    title: 'Engineering Mechanics Spiral Notebook & Notes',
    category: 'Books and Stationery',
    description: 'Thick black 5-subject spiral notebook with all lecture notes for ME201 and handwritten formula sheets for midterm preparation.',
    brand: 'Five Star',
    color: 'Black / Silver Wire',
    distinguishingFeatures: 'Red "URGENT MIDTERM" note taped on the inside cover; mechanical engineering blueprints tucked in pocket.',
    date: '2026-10-14',
    time: '11:45 AM',
    location: 'Lecture Hall Complex',
    locationDetails: 'Room 204, row 4 near the projector stand.',
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    reporter: {
      name: 'Devin Taylor',
      email: 'd.taylor@campus.edu',
      contactPreference: 'Campus Email'
    },
    createdAt: '2026-10-14T12:30:00Z',
    views: 110,
    isDemoUser: false
  },
  {
    id: 'LF-FOUND-2026-2003',
    type: 'found',
    title: 'Bunch of Keys with Motorcycle Key & Lanyard',
    category: 'Keys',
    description: 'Set of 4 keys including a Yamaha motorcycle ignition key, small brass lock key, and two locker keys on a blue campus lanyard.',
    brand: 'Yamaha / Master Lock',
    color: 'Silver / Brass / Blue Lanyard',
    distinguishingFeatures: 'Blue woven lanyard with mini metallic carabiner and rubber guitar keychain.',
    date: '2026-10-17',
    time: '5:30 PM',
    location: 'Sports Complex & Grounds',
    locationDetails: 'Found by the basketball bleachers near court 2.',
    status: 'Active',
    handoverStatus: 'Submitted to College Office',
    handoverLocation: 'Campus Security Gate 1 Desk',
    images: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80'
    ],
    secretDetail: 'Exact number stamped on the brass key.',
    finder: {
      name: 'Officer Ramirez',
      email: 'security.gate1@campus.edu',
      contactPreference: 'Security Desk Gate 1'
    },
    createdAt: '2026-10-17T18:00:00Z',
    views: 153,
    isDemoUser: false
  },
  {
    id: 'LF-LOST-2026-1003',
    type: 'lost',
    title: 'Brown Leather Bi-Fold Wallet',
    category: 'Bags and Wallets',
    description: 'Vintage brown leather bifold wallet containing student transit card, library card, driver license, and emergency cash. Do not care about cash, just need documents back!',
    brand: 'Bellroy',
    color: 'Cognac Brown',
    distinguishingFeatures: 'Initials "A.K." stamped in gold on bottom right corner.',
    date: '2026-10-16',
    time: 'Approx. 10:15 AM',
    location: 'Main Administration Building',
    locationDetails: 'Lost between Admissions registrar stairs and Registrar fountain.',
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'
    ],
    reporter: {
      name: 'Alina Kazmi',
      email: 'a.kazmi@campus.edu',
      contactPreference: 'In-app Claim',
      phone: '+1 (555) 234-5678'
    },
    createdAt: '2026-10-16T10:45:00Z',
    views: 204,
    isDemoUser: true
  },
  {
    id: 'LF-FOUND-2026-2004',
    type: 'found',
    title: 'Casio fx-991EX Scientific Calculator',
    category: 'Electronics',
    description: 'White and black ClassWiz high-precision scientific calculator with sliding hard cover. Left behind on laboratory bench after afternoon session.',
    brand: 'Casio',
    color: 'White & Black',
    distinguishingFeatures: 'Name etched in small marker inside slide cover; solar panel intact.',
    date: '2026-10-16',
    time: '3:45 PM',
    location: 'Science & Engineering Labs',
    locationDetails: 'Found in Physics Lab 3, station 6.',
    status: 'Possible Match',
    handoverStatus: 'Currently With Finder',
    handoverLocation: 'Physics Dept Lab Assistant Office',
    images: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80'
    ],
    secretDetail: 'Handwritten chemical formula scratched inside back cover.',
    finder: {
      name: 'Lab Assistant Kenneth',
      email: 'physics.lab@campus.edu',
      contactPreference: 'Physics Lab 3 Office'
    },
    createdAt: '2026-10-16T16:15:00Z',
    views: 77,
    isDemoUser: false
  },
  {
    id: 'LF-FOUND-2026-2005',
    type: 'found',
    title: 'Student ID Card - Sarah Jenkins',
    category: 'ID Cards and Documents',
    description: 'Official College Student Identification Card for Sarah Jenkins, Department of Biological Sciences, valid through 2027. Found dropped on steps.',
    brand: 'Campus ID Card',
    color: 'White / Blue Ribbon',
    distinguishingFeatures: 'Attached to a lanyard with a science society pin badge.',
    date: '2026-10-17',
    time: '12:00 PM',
    location: 'Main Auditorium',
    locationDetails: 'Auditorium entrance steps leading to west wing.',
    status: 'Active',
    handoverStatus: 'Submitted to College Office',
    handoverLocation: 'Central Library Reception',
    images: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
    ],
    secretDetail: 'Exact student barcode digits and major track.',
    finder: {
      name: 'Jordan Lee',
      email: 'j.lee@campus.edu',
      contactPreference: 'Submitted to Office'
    },
    createdAt: '2026-10-17T12:30:00Z',
    views: 92,
    isDemoUser: false
  },
  {
    id: 'LF-LOST-2026-1004',
    type: 'lost',
    title: 'Apple 67W USB-C Power Adapter & Braided Cable',
    category: 'Electronics',
    description: 'White MacBook Pro fast charger block with 2-meter braided white MagSafe 3 cable. Essential for upcoming exam prep and coding assignments.',
    brand: 'Apple',
    color: 'White',
    distinguishingFeatures: 'Neon green silicone cable protector sleeve wrapped around neck.',
    date: '2026-10-17',
    time: '2:15 PM',
    location: 'Student Common Room',
    locationDetails: 'Plugged into the power strip beneath the lounge sofa near foosball table.',
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    reporter: {
      name: 'Elena Rostova',
      email: 'e.rostova@campus.edu',
      contactPreference: 'In-app Claim'
    },
    createdAt: '2026-10-17T14:40:00Z',
    views: 88,
    isDemoUser: false
  },
  {
    id: 'LF-FOUND-2026-2006',
    type: 'found',
    title: 'Swissgear Navy Blue Water-Resistant Backpack',
    category: 'Bags and Wallets',
    description: 'Dark navy backpack with padded laptop compartment, padded straps, and side mesh pockets. Contains notebooks and a pencil pouch.',
    brand: 'Swissgear',
    color: 'Navy Blue',
    distinguishingFeatures: 'Reflective silver strip on front pocket, Swiss cross emblem.',
    date: '2026-10-16',
    time: '6:10 PM',
    location: 'Campus Canteen & Cafeteria',
    locationDetails: 'Under the wooden patio booth outside the canteen terrace.',
    status: 'Claim Pending',
    handoverStatus: 'Submitted to College Office',
    handoverLocation: 'Campus Security Gate 1 Desk',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    secretDetail: 'Color and title of the paperback novel in the front organizer pouch.',
    finder: {
      name: 'Canteen Staff Tariq',
      email: 'tariq.cafeteria@campus.edu',
      contactPreference: 'Security Desk Gate 1'
    },
    createdAt: '2026-10-16T18:30:00Z',
    views: 215,
    isDemoUser: false
  },
  {
    id: 'LF-LOST-2026-1005',
    type: 'lost',
    title: 'Fossil Chronograph Watch with Brown Leather Strap',
    category: 'Jewellery and Watches',
    description: 'Men\'s stainless steel chronograph watch with cream dial, three sub-dials, and brown stitched leather band. Gift from family, deeply sentimental value.',
    brand: 'Fossil',
    color: 'Silver / Cream / Brown',
    distinguishingFeatures: 'Light scratch at 4 o\'clock position on bezel; engraved date on stainless steel back.',
    date: '2026-10-13',
    time: 'Evening 6:00 PM',
    location: 'Sports Complex & Grounds',
    locationDetails: 'Taken off before intramural soccer match, left on trackside bench.',
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    ],
    reporter: {
      name: 'Liam Vance',
      email: 'l.vance@campus.edu',
      contactPreference: 'Campus Email'
    },
    createdAt: '2026-10-13T19:15:00Z',
    views: 176,
    isDemoUser: false
  },
  {
    id: 'LF-FOUND-2026-2007',
    type: 'found',
    title: 'Apple AirPods Pro 2 Wireless Charging Case',
    category: 'Electronics',
    description: 'Glossy white Apple AirPods Pro second-generation case with lanyard loop. The case was found on a study table. (Earbuds were inside!).',
    brand: 'Apple',
    color: 'Glossy White',
    distinguishingFeatures: 'Small engraved emoji or clear plastic protective shell with carabiner ring.',
    date: '2026-10-17',
    time: '11:00 AM',
    location: 'Central Library',
    locationDetails: 'Found on 3rd floor periodicals table near window.',
    status: 'Active',
    handoverStatus: 'Submitted to College Office',
    handoverLocation: 'Central Library Reception',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80'
    ],
    secretDetail: 'Exact name displayed when Bluetooth case is popped open near an iPhone.',
    finder: {
      name: 'Zoe Martinez',
      email: 'z.martinez@campus.edu',
      contactPreference: 'Library Reception'
    },
    createdAt: '2026-10-17T11:45:00Z',
    views: 198,
    isDemoUser: false
  },
  {
    id: 'LF-LOST-2026-1006',
    type: 'lost',
    title: 'Bright Yellow Fulton Windproof Umbrella',
    category: 'Clothing and Accessories',
    description: 'Sturdy yellow compact folding umbrella with curved wooden handle. Left behind on the umbrella stand during sudden rainy morning.',
    brand: 'Fulton',
    color: 'Bright Yellow',
    distinguishingFeatures: 'Curved wood handle with small brass tag; storm-proof fiberglass ribs.',
    date: '2026-10-15',
    time: '9:00 AM',
    location: 'Campus Entrance Gate 1',
    locationDetails: 'Placed in the tall metal umbrella rack right by the gate security booth.',
    status: 'Returned',
    images: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
    ],
    reporter: {
      name: 'Chloe Bennett',
      email: 'c.bennett@campus.edu',
      contactPreference: 'Campus Email'
    },
    createdAt: '2026-10-15T09:30:00Z',
    views: 130,
    isDemoUser: false
  },
  {
    id: 'LF-FOUND-2026-2008',
    type: 'found',
    title: 'Tortoiseshell Reading Glasses in Hard Case',
    category: 'Clothing and Accessories',
    description: 'Prescription reading glasses with stylish tortoiseshell frames, stored inside a black magnetic closure clamshell case.',
    brand: 'Warby Parker',
    color: 'Tortoiseshell / Amber Brown',
    distinguishingFeatures: 'Gold brand script on inner right temple, microfibre cleaning cloth included.',
    date: '2026-10-16',
    time: '4:20 PM',
    location: 'Seminar Hall B',
    locationDetails: 'Found on seat G12 after the guest lecture.',
    status: 'Active',
    handoverStatus: 'Currently With Finder',
    handoverLocation: 'Can be picked up at Student Affairs Building Room 102.',
    images: [
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80'
    ],
    secretDetail: 'The prescription strength or exact model name stamped inside left temple.',
    finder: {
      name: 'Prof. Henderson',
      email: 'd.henderson@campus.edu',
      contactPreference: 'Department Office Room 102'
    },
    createdAt: '2026-10-16T17:00:00Z',
    views: 84,
    isDemoUser: false
  }
];

export const INITIAL_CLAIMS = [
  {
    id: 'CLM-2026-5001',
    itemId: 'LF-FOUND-2026-2006',
    itemTitle: 'Swissgear Navy Blue Water-Resistant Backpack',
    claimantName: 'Alina Kazmi',
    claimantEmail: 'a.kazmi@campus.edu',
    claimantPhone: '+1 (555) 234-5678',
    status: 'Pending Review',
    ownershipProof: 'I left it after lunch. Inside there is a red Five Star spiral notebook and a copy of "Clean Code" paperback in the front pouch. My initials AK are also on the notebook.',
    secretAnswer: 'Book is "Clean Code" by Robert C. Martin',
    submittedAt: '2026-10-17T09:15:00Z',
    isDemoUser: true
  }
];
