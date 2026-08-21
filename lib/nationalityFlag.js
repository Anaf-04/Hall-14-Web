// Maps free-text nationality values (as stored on residents.nationality) to
// ISO 3166-1 alpha-2 codes, then to a flag emoji via Unicode regional
// indicator symbols. Falls back to a white flag when unmapped.
const NATIONALITY_TO_ISO = {
  "hong kong": "HK",
  "china": "CN",
  "mainland china": "CN",
  "taiwan": "TW",
  "macau": "MO",
  "macao": "MO",
  "south korea": "KR",
  "korea": "KR",
  "north korea": "KP",
  "japan": "JP",
  "united states": "US",
  "united states of america": "US",
  "usa": "US",
  "united kingdom": "GB",
  "uk": "GB",
  "england": "GB",
  "india": "IN",
  "indonesia": "ID",
  "malaysia": "MY",
  "singapore": "SG",
  "thailand": "TH",
  "vietnam": "VN",
  "philippines": "PH",
  "france": "FR",
  "germany": "DE",
  "italy": "IT",
  "spain": "ES",
  "portugal": "PT",
  "canada": "CA",
  "australia": "AU",
  "new zealand": "NZ",
  "nigeria": "NG",
  "pakistan": "PK",
  "bangladesh": "BD",
  "sri lanka": "LK",
  "nepal": "NP",
  "myanmar": "MM",
  "cambodia": "KH",
  "laos": "LA",
  "mongolia": "MN",
  "kazakhstan": "KZ",
  "russia": "RU",
  "brazil": "BR",
  "mexico": "MX",
  "netherlands": "NL",
  "sweden": "SE",
  "norway": "NO",
  "denmark": "DK",
  "finland": "FI",
  "switzerland": "CH",
  "austria": "AT",
  "poland": "PL",
  "turkey": "TR",
  "egypt": "EG",
  "south africa": "ZA",
  "saudi arabia": "SA",
  "united arab emirates": "AE",
  "uae": "AE",
  "israel": "IL",
};

function isoToFlagEmoji(iso) {
  if (!iso || iso.length !== 2) return null;
  const codePoints = iso
    .toUpperCase()
    .split("")
    .map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function nationalityToFlag(nationality) {
  if (!nationality) return "🏳️";
  const key = nationality.trim().toLowerCase();
  const iso = NATIONALITY_TO_ISO[key] ?? (key.length === 2 ? key.toUpperCase() : null);
  return isoToFlagEmoji(iso) ?? "🏳️";
}
