const sampleListings = [
  {
    title: "Shanti Nivas PG",
    description:
      "Safe and comfortable girls PG with WiFi, home-style food, and 24/7 security. Perfect for students.",
    image: {
      filename: "listingimage",
      url: "https://media.istockphoto.com/id/2206923937/photo/industry-building.jpg?s=1024x1024&w=is&k=20&c=Ly5OnAnAUpYHm4020qqDotV580GIm7CNvUVXUBZZfQE=",
    },
    price: 5000,
    location: "Ranchi",
    country: "India",
  },
  {
    title: "Om Residency",
    description:
      "Affordable boys hostel with furnished rooms, laundry service, and healthy mess food.",
    image: {
      filename: "listingimage",
      url: "https://is1-3.housingcdn.com/4f2250e8/c7af25ac831c164497ed93b3862a6208/v5/fs.jpg",
    },
    price: 4500,
    location: "Namkum",
    country: "India",
  },
  {
    title: "Gokul Residency",
    description:
      "Spacious rooms for students with high-speed WiFi and study environment near BIT Mesra.",
    image: {
      filename: "listingimage",
      url: "data:image/jpeg;base64,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",
    },
    price: 6500,
    location: "Ranchi",
    country: "India",
  },
  {
    title: "Patel Lodge",
    description:
      "Secure PG accommodation for working women with AC rooms, meals, and CCTV security.",
    image: {
      filename: "listingimage",
      url: "https://content.jdmagicbox.com/comp/ranchi/w7/0651px651.x651.230422160051.z8w7/catalogue/g20lhmupn03u2px-ig1gjgcfds.jpg",
    },
    price: 8000,
    location: "Delhi",
    country: "India",
  },
  {
    title: "Muskan Girls Hostel",
    description:
      "Comfortable boys PG with attached bathroom, WiFi, and daily housekeeping.",
    image: {
      filename: "listingimage",
      url: "https://content.jdmagicbox.com/comp/ranchi/a1/0651px651.x651.240407135749.w9a1/catalogue/sa6tqd30eci63r8-1gi8j2qra8.jpg",
    },
    price: 7000,
    location: "Delhi",
    country: "India",
  },
  {
    title: "Kainath Girls Hostel",
    description:
      "Well-maintained girls hostel with mess facility and biometric security.",
    image: {
      filename: "listingimage",
      url: "https://media.istockphoto.com/id/474413060/photo/ndrf-are-at-work.webp?a=1&b=1&s=612x612&w=0&k=20&c=xUo9RRA1-8e5T-FG8QeFa1u_wchR5bRAeohEjIkxKQs=",
    },
    price: 9000,
    location: "Mumbai",
    country: "India",
  },
  {
    title: "CampusNest",
    description:
      "Budget-friendly hostel for students with shared rooms and study hall.",
    image: {
      filename: "listingimage",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG3r4eRtxCYG3Ye1djy2Tp2DNgDFQ_N-35SQ&s",
    },
    price: 4000,
    location: "Pune",
    country: "India",
  },
  {
    title: "Sai Residency",
    description:
      "Premium PG accommodation with gym, WiFi, and fully furnished rooms.",
    image: {
      filename: "listingimage",
      url: "https://asset-cdn.stanzaliving.com/stanza-living/image/upload/f_auto,q_auto,w_600/e_improve/e_sharpen:10/e_saturation:10/f_auto,q_auto/v1655710355/Website/CMS-Uploads/nimekawcrl9v4ywioi2y.jpg",
    },
    price: 12000,
    location: "Bangalore",
    country: "India",
  },
  {
    title: "Cozy Girls PG",
    description:
      "Friendly girls PG with home-cooked meals and peaceful environment.",
    image: {
      filename: "listingimage",
      url: "https://asset-cdn.stanzaliving.com/stanza-living/image/upload/f_auto,q_auto,w_600/e_improve/e_sharpen:10/e_saturation:10/f_auto,q_auto/v1655711918/Website/CMS-Uploads/dlqvtme3rcpwcf6f9ztd.jpg",
    },
    price: 6500,
    location: "Hyderabad",
    country: "India",
  },
  {
    title: "CityNest Ranchi",
    description:
      "Comfortable hostel for working professionals with AC rooms and WiFi.",
    image: {
      filename: "listingimage",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpa9CToshZGrAymCPyAJEroSM_2H3OA2-5kA&s",
    },
    price: 7500,
    location: "Chennai",
    country: "India",
  },
];

module.exports = { data: sampleListings };