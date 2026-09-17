export type Room = {
  id: string
  name: string
  description: string
  image: string
  price: number
  details: string
  tag?: string
}

export const featuredRooms: Room[] = [
  {
    id: "garden-suite",
    name: "Garden Sanctuary Suite",
    description:
      "A quiet retreat with a private garden terrace and a deep soaking tub.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
    price: 289,
    details: "2 guests · 1 king bed",
    tag: "Most loved",
  },
  {
    id: "forest-king",
    name: "Forest King Room",
    description:
      "Warm natural textures, generous daylight, and a view into the pines.",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
    price: 219,
    details: "2 guests · 1 king bed",
  },
  {
    id: "azure-deluxe",
    name: "Azure Deluxe Room",
    description:
      "A light-filled room with a sitting nook made for slow mornings.",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85",
    price: 249,
    details: "3 guests · 1 king bed",
  },
]
