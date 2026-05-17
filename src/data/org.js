export const org = {
  name: "Wesoamo Child Cancer Foundation",
  tagline: "Awareness • Welfare Support • Counselling • Survivorship",
  mission:
    "We create awareness on childhood cancer and provide financial, welfare, counselling, and follow-up support for children battling cancer and their families in Ghana.",
  primaryCta: { label: "Donate", href: "/get-involved#donate" },
  secondaryCta: { label: "Volunteer", href: "/get-involved#volunteer" },

  donateUrl: "https://www.wesoamochildcancer.com/donate",

  volunteerFormUrl: "https://www.wesoamochildcancer.com/volunteer",

  phoneRaw: "0555945515",
  phoneE164: "+233555945515",
  whatsapp: "233555945515",
  email: "info@wesoamochildcancer.com",
  mapUrl: "https://maps.app.goo.gl/1ksPWUgzUUBudWLt5",
  facebook: "https://www.facebook.com/share/18H2a7NzVQ/",
  photoAlbums: [
    {
      label: "Google Drive album (about 60 photos)",
      href: "https://drive.google.com/drive/folders/1W6nlTnW47kbcyhcLlH0DQ7GgGK6AvAIn"
    },
    {
      label: "Google Photos album (about 64 photos)",
      href: "https://photos.app.goo.gl/HYL4ewLqpJhUCRLs9"
    }
  ],
  region: "Ghana",
  logoPath: "/images/logo.jpg",
  baseUrl: "https://www.wesoamochildcancer.com"
};

export const contactLinks = {
  brand: {
    name: org.name,
    logoUrl: `${org.baseUrl}${org.logoPath}`
  },
  contact: {
    phone: org.phoneE164,
    whatsapp: org.whatsapp,
    telegram: "",
    email: org.email,
    website: org.baseUrl
  },
  social: {
    instagram: "",
    facebook: org.facebook,
    tiktok: "",
    youtube: "",
    x: "",
    linkedin: ""
  }
};
