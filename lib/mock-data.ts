// Mock data for development
import type { User, HotelRoom, TaxiService, Pet, CityPricing, RoomPricing, District } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "Ahmet Yılmaz",
    phone: "+905551234567",
    passwordHash: "hashed_password_123",
    role: "user",
    emailVerified: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "admin-1",
    email: "admin@petfendy.com",
    name: "Admin User",
    phone: "+905559876543",
    passwordHash: "hashed_admin_password",
    role: "admin",
    emailVerified: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

export const mockHotelRooms: HotelRoom[] = [
  {
    id: "room-1",
    name: "Standart Oda",
    type: "standard",
    capacity: 1,
    pricePerNight: 150,
    available: true,
    amenities: ["Yatak", "Su Kasesi", "Oyuncaklar"],
  },
  {
    id: "room-2",
    name: "Deluxe Oda",
    type: "deluxe",
    capacity: 2,
    pricePerNight: 250,
    available: true,
    amenities: ["Yatak", "Oyun Alanı", "Kamera Gözetimi", "Klima"],
  },
  {
    id: "room-3",
    name: "Suite Oda",
    type: "suite",
    capacity: 3,
    pricePerNight: 400,
    available: true,
    amenities: ["Geniş Yatak", "Özel Oyun Alanı", "24/7 Kamera", "Klima", "Isıtma"],
  },
]

export const mockTaxiServices: TaxiService[] = [
  {
    id: "taxi-1",
    name: "Pet Taxi",
    description: "Güvenli ve ekonomik evcil hayvan taşıma servisi",
    basePrice: 50,
    pricePerKm: 15,
    maxPetWeight: 10,
    capacity: 2,
    features: ["Güvenli taşıma", "Klima", "Temizlik", "Deneyimli şoför"],
    available: true,
  },
  {
    id: "taxi-2",
    name: "Luxury Pet Transport",
    description: "Premium araçlarla lüks evcil hayvan taşıma hizmeti",
    basePrice: 75,
    pricePerKm: 25,
    maxPetWeight: 20,
    capacity: 4,
    features: ["Premium araç", "Veteriner refakat", "GPS takip", "Özel bakım"],
    available: true,
  },
  {
    id: "taxi-3",
    name: "Express Pet Service",
    description: "Hızlı ve acil durum evcil hayvan taşıma servisi",
    basePrice: 100,
    pricePerKm: 20,
    maxPetWeight: 30,
    capacity: 1,
    features: ["Hızlı servis", "Özel bakım", "Acil durum desteği", "7/24 hizmet"],
    available: true,
  },
]

export const mockPets: Pet[] = [
  {
    id: "pet-1",
    userId: "1",
    name: "Boncuk",
    type: "dog",
    breed: "Golden Retriever",
    age: 3,
    weight: 25,
    specialNeeds: "Hiçbiri",
  },
  {
    id: "pet-2",
    userId: "1",
    name: "Misi",
    type: "cat",
    breed: "Siamese",
    age: 2,
    weight: 4,
    specialNeeds: "Diyetli mama",
  },
]

// City-based pricing for taxi service
export const mockCityPricings: CityPricing[] = [
  {
    id: "city-1",
    fromCity: "İstanbul",
    toCity: "Ankara",
    additionalFee: 100,
    discount: 0,
    distanceKm: 450,
  },
  {
    id: "city-2",
    fromCity: "İstanbul",
    toCity: "İzmir",
    additionalFee: 150,
    discount: 10,
    distanceKm: 470,
  },
  {
    id: "city-3",
    fromCity: "Ankara",
    toCity: "İzmir",
    additionalFee: 80,
    discount: 0,
    distanceKm: 590,
  },
]

// Room pricing for dynamic date-based pricing
export const mockRoomPricings: RoomPricing[] = [
  {
    id: "price-1",
    roomId: "room-1",
    date: new Date("2025-12-31"),
    pricePerNight: 250,
    available: true,
  },
  {
    id: "price-2",
    roomId: "room-2",
    date: new Date("2025-12-31"),
    pricePerNight: 400,
    available: true,
  },
]

// Turkish cities for taxi service
export const mockTurkishCities = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Şanlıurfa",
  "Kocaeli",
  "Mersin",
  "Diyarbakır",
  "Hatay",
  "Manisa",
  "Kayseri",
]

// Districts (ilçeler) with distances from city center
export const mockDistricts: District[] = [
  // İstanbul - Avrupa Yakası
  { id: "ist-1", name: "Kadıköy", cityName: "İstanbul", distanceFromCenter: 5 },
  { id: "ist-2", name: "Beşiktaş", cityName: "İstanbul", distanceFromCenter: 3 },
  { id: "ist-3", name: "Şişli", cityName: "İstanbul", distanceFromCenter: 5 },
  { id: "ist-4", name: "Üsküdar", cityName: "İstanbul", distanceFromCenter: 6 },
  { id: "ist-5", name: "Kartal", cityName: "İstanbul", distanceFromCenter: 25 },
  { id: "ist-6", name: "Maltepe", cityName: "İstanbul", distanceFromCenter: 20 },
  { id: "ist-7", name: "Pendik", cityName: "İstanbul", distanceFromCenter: 30 },
  { id: "ist-8", name: "Ataşehir", cityName: "İstanbul", distanceFromCenter: 18 },
  { id: "ist-9", name: "Bakırköy", cityName: "İstanbul", distanceFromCenter: 12 },
  { id: "ist-10", name: "Beylikdüzü", cityName: "İstanbul", distanceFromCenter: 35 },
  { id: "ist-11", name: "Başakşehir", cityName: "İstanbul", distanceFromCenter: 25 },
  { id: "ist-12", name: "Sarıyer", cityName: "İstanbul", distanceFromCenter: 20 },
  { id: "ist-13", name: "Silivri", cityName: "İstanbul", distanceFromCenter: 65 },
  { id: "ist-14", name: "Çatalca", cityName: "İstanbul", distanceFromCenter: 60 },
  { id: "ist-15", name: "Tuzla", cityName: "İstanbul", distanceFromCenter: 40 },

  // Ankara
  { id: "ank-1", name: "Çankaya", cityName: "Ankara", distanceFromCenter: 3 },
  { id: "ank-2", name: "Keçiören", cityName: "Ankara", distanceFromCenter: 8 },
  { id: "ank-3", name: "Yenimahalle", cityName: "Ankara", distanceFromCenter: 10 },
  { id: "ank-4", name: "Mamak", cityName: "Ankara", distanceFromCenter: 7 },
  { id: "ank-5", name: "Etimesgut", cityName: "Ankara", distanceFromCenter: 15 },
  { id: "ank-6", name: "Sincan", cityName: "Ankara", distanceFromCenter: 25 },
  { id: "ank-7", name: "Gölbaşı", cityName: "Ankara", distanceFromCenter: 30 },
  { id: "ank-8", name: "Pursaklar", cityName: "Ankara", distanceFromCenter: 20 },
  { id: "ank-9", name: "Altındağ", cityName: "Ankara", distanceFromCenter: 4 },
  { id: "ank-10", name: "Polatlı", cityName: "Ankara", distanceFromCenter: 70 },

  // İzmir
  { id: "izm-1", name: "Konak", cityName: "İzmir", distanceFromCenter: 2 },
  { id: "izm-2", name: "Karşıyaka", cityName: "İzmir", distanceFromCenter: 8 },
  { id: "izm-3", name: "Bornova", cityName: "İzmir", distanceFromCenter: 12 },
  { id: "izm-4", name: "Buca", cityName: "İzmir", distanceFromCenter: 10 },
  { id: "izm-5", name: "Çiğli", cityName: "İzmir", distanceFromCenter: 18 },
  { id: "izm-6", name: "Gaziemir", cityName: "İzmir", distanceFromCenter: 15 },
  { id: "izm-7", name: "Balçova", cityName: "İzmir", distanceFromCenter: 8 },
  { id: "izm-8", name: "Narlıdere", cityName: "İzmir", distanceFromCenter: 12 },
  { id: "izm-9", name: "Bayraklı", cityName: "İzmir", distanceFromCenter: 6 },
  { id: "izm-10", name: "Menderes", cityName: "İzmir", distanceFromCenter: 25 },
  { id: "izm-11", name: "Urla", cityName: "İzmir", distanceFromCenter: 40 },
  { id: "izm-12", name: "Çeşme", cityName: "İzmir", distanceFromCenter: 85 },

  // Bursa
  { id: "bur-1", name: "Osmangazi", cityName: "Bursa", distanceFromCenter: 3 },
  { id: "bur-2", name: "Nilüfer", cityName: "Bursa", distanceFromCenter: 8 },
  { id: "bur-3", name: "Yıldırım", cityName: "Bursa", distanceFromCenter: 5 },
  { id: "bur-4", name: "Mudanya", cityName: "Bursa", distanceFromCenter: 30 },
  { id: "bur-5", name: "Gemlik", cityName: "Bursa", distanceFromCenter: 35 },
  { id: "bur-6", name: "İnegöl", cityName: "Bursa", distanceFromCenter: 45 },

  // Antalya
  { id: "ant-1", name: "Muratpaşa", cityName: "Antalya", distanceFromCenter: 3 },
  { id: "ant-2", name: "Kepez", cityName: "Antalya", distanceFromCenter: 8 },
  { id: "ant-3", name: "Konyaaltı", cityName: "Antalya", distanceFromCenter: 10 },
  { id: "ant-4", name: "Döşemealtı", cityName: "Antalya", distanceFromCenter: 25 },
  { id: "ant-5", name: "Aksu", cityName: "Antalya", distanceFromCenter: 15 },
  { id: "ant-6", name: "Alanya", cityName: "Antalya", distanceFromCenter: 130 },
  { id: "ant-7", name: "Manavgat", cityName: "Antalya", distanceFromCenter: 75 },

  // Adana
  { id: "ada-1", name: "Seyhan", cityName: "Adana", distanceFromCenter: 3 },
  { id: "ada-2", name: "Çukurova", cityName: "Adana", distanceFromCenter: 5 },
  { id: "ada-3", name: "Sarıçam", cityName: "Adana", distanceFromCenter: 12 },
  { id: "ada-4", name: "Yüreğir", cityName: "Adana", distanceFromCenter: 8 },
  { id: "ada-5", name: "Ceyhan", cityName: "Adana", distanceFromCenter: 45 },
]
