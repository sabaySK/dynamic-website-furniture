import productDining from "@/assets/product-dining.jpg";
import productSofa from "@/assets/product-sofa.jpg";
import productShelf from "@/assets/product-shelf.jpg";
import productLamp from "@/assets/product-lamp.jpg";
import productChair from "@/assets/product-chair.jpg";
import productTable from "@/assets/product-table.jpg";
import productBed from "@/assets/product-bed.jpg";

export type Category = "Living Room" | "Bedroom" | "Dining" | "Office" | "Lighting" | "Storage";

export type Material = "Wood" | "Metal" | "Fabric";
export type Color = "Natural" | "Black" | "White" | "Walnut" | "Oak" | "Grey";

export const materials: Material[] = ["Wood", "Metal", "Fabric"];
export const colors: Color[] = ["Natural", "Black", "White", "Walnut", "Oak", "Grey"];

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: Category;
  image: string;
  gallery?: string[];
  description: string;
  longDescription?: string;
  specs?: Record<string, string>;
  featured?: boolean;
  isNew?: boolean;
  rating: number;
  reviews?: number;
  material?: Material[];
  color?: Color;
  colorOptions?: Color[];
  inStock?: boolean;
  videoUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  author: string;
  authorRole: string;
  category: string;
  readTime: string;
  image: string;
  tags: string[];
}

export const categories: Category[] = [
  "Living Room",
  "Bedroom",
  "Dining",
  "Office",
  "Lighting",
  "Storage",
];

export const products: Product[] = [
  {
    id: "1",
    name: "Nordic Linen Sofa",
    price: 1299,
    originalPrice: 1599,
    category: "Living Room",
    image: productSofa,
    gallery: [productSofa, productTable, productChair],
    description: "Handcrafted linen sofa with solid oak frame. Timeless Scandinavian design meets unparalleled comfort.",
    longDescription: "Our Nordic Linen Sofa is the centerpiece of any living room. Crafted from sustainably sourced solid oak and upholstered in premium European linen, this sofa combines the best of Scandinavian design with uncompromising comfort. The deep, plush cushions are filled with a blend of down and high-resilience foam for the perfect balance of softness and support. Each sofa is handmade by skilled artisans in our Stockholm workshop, ensuring exceptional quality and attention to detail.",
    specs: { "Dimensions": "220 × 90 × 80 cm", "Weight": "45 kg", "Frame": "Solid Oak", "Upholstery": "100% European Linen", "Cushion Fill": "Down & HR Foam Blend", "Seating Capacity": "3 persons" },
    featured: true,
    rating: 4.8,
    reviews: 124,
    material: ["Wood", "Fabric"],
    color: "Natural",
    colorOptions: ["Natural", "Grey", "Black"],
    inStock: true,
    videoUrl: "https://www.youtube.com/embed/nVjsGKrE9E8",
  },
  {
    id: "2",
    name: "Artisan Dining Table",
    price: 899,
    category: "Dining",
    image: productDining,
    gallery: [productDining, productShelf, productTable],
    description: "Solid oak dining table for 6, with elegant tapered legs and natural grain finish.",
    longDescription: "The Artisan Dining Table is where family and friends gather. Carved from a single slab of FSC-certified European oak, each table showcases the wood's unique grain pattern. The tapered legs are joined with traditional mortise-and-tenon joinery—no screws, no shortcuts. Finished with a food-safe natural oil that deepens the wood's character over time.",
    specs: { "Dimensions": "180 × 90 × 75 cm", "Weight": "38 kg", "Material": "Solid European Oak", "Finish": "Natural Oil", "Seats": "6 persons", "Assembly": "Legs attach in 10 min" },
    featured: true,
    rating: 4.9,
    reviews: 87,
    material: ["Wood"],
    color: "Oak",
    inStock: true,
  },
  {
    id: "3",
    name: "Minimalist Bookshelf",
    price: 649,
    category: "Storage",
    image: productShelf,
    gallery: [productShelf, productDining, productLamp],
    description: "Modular bookshelf system in natural oak. Configure it your way with adjustable shelves.",
    longDescription: "Our Minimalist Bookshelf brings order and elegance to any space. This modular system lets you customize shelf heights to fit books, art, and objects of all sizes. Built from solid oak with integrated lower cabinets for concealed storage. The open-back design creates a light, airy feel while keeping everything beautifully organized.",
    specs: { "Dimensions": "160 × 35 × 200 cm", "Weight": "52 kg", "Material": "Solid Oak", "Shelves": "6 adjustable + 3 fixed", "Cabinets": "3 with soft-close doors", "Finish": "Natural Matte" },
    featured: true,
    rating: 4.7,
    reviews: 63,
    material: ["Wood"],
    color: "Oak",
    inStock: true,
  },
  {
    id: "4",
    name: "Studio Desk Lamp",
    price: 189,
    originalPrice: 229,
    category: "Lighting",
    image: productLamp,
    gallery: [productLamp, productChair, productBed],
    description: "Adjustable brass desk lamp with matte black finish. Warm, focused illumination for your workspace.",
    longDescription: "The Studio Desk Lamp merges industrial character with refined Scandinavian sensibility. Its adjustable arm and pivoting shade direct warm, flicker-free light exactly where you need it. The solid brass base with matte black powder-coat finish adds a sculptural element to your desk. Compatible with standard E27 bulbs up to 60W, or use your favorite smart bulb.",
    specs: { "Height": "45 cm (adjustable)", "Base": "12 cm diameter", "Material": "Brass & Steel", "Finish": "Matte Black Powder Coat", "Bulb": "E27, max 60W (not included)", "Cable Length": "180 cm" },
    isNew: true,
    rating: 4.6,
    reviews: 41,
    material: ["Metal"],
    color: "Black",
    inStock: true,
  },
  {
    id: "5",
    name: "Lounge Armchair",
    price: 749,
    category: "Living Room",
    image: productChair,
    gallery: [productChair, productSofa, productTable],
    description: "Mid-century inspired armchair with solid walnut frame and premium cotton cushion.",
    longDescription: "The Lounge Armchair pays homage to mid-century Scandinavian masters while adding our own contemporary twist. The solid walnut frame is shaped using steam-bending techniques that create its signature flowing curves. Topped with a generous cushion in organic cotton, it's the kind of chair you sink into and never want to leave.",
    specs: { "Dimensions": "72 × 78 × 82 cm", "Seat Height": "42 cm", "Weight": "12 kg", "Frame": "Solid Walnut", "Cushion": "Organic Cotton, removable", "Max Load": "150 kg" },
    featured: true,
    isNew: true,
    rating: 4.9,
    reviews: 96,
    material: ["Wood", "Fabric"],
    color: "Walnut",
    inStock: true,
  },
  {
    id: "6",
    name: "Round Coffee Table",
    price: 449,
    category: "Living Room",
    image: productTable,
    gallery: [productTable, productSofa, productChair],
    description: "Sculptural coffee table in solid oak with organic curved base. A statement piece for any room.",
    longDescription: "The Round Coffee Table is where geometry meets nature. Its organic curved base is carved from a single block of oak, creating a sculptural foundation that supports a perfectly circular top. The natural oil finish highlights the wood's grain and develops a beautiful patina over years of use.",
    specs: { "Diameter": "90 cm", "Height": "40 cm", "Weight": "22 kg", "Material": "Solid European Oak", "Finish": "Natural Oil", "Assembly": "None required" },
    rating: 4.5,
    reviews: 58,
    material: ["Wood"],
    color: "Oak",
    inStock: true,
  },
  {
    id: "7",
    name: "Platform Bed Frame",
    price: 1099,
    category: "Bedroom",
    image: productBed,
    gallery: [productBed, productLamp, productShelf],
    description: "Low-profile platform bed in natural oak with integrated nightstands. Clean lines, maximum comfort.",
    longDescription: "Our Platform Bed Frame redefines bedroom simplicity. The low-profile design creates a grounded, zen-like atmosphere while integrated nightstands eliminate clutter. Crafted from solid oak with precision-cut slats that support your mattress without a box spring. The hidden cable channel lets you charge devices without visible wires.",
    specs: { "Dimensions (Queen)": "210 × 170 × 35 cm", "Weight": "55 kg", "Material": "Solid Oak", "Slats": "18 precision-cut", "Nightstand Width": "40 cm each", "Mattress Compatibility": "Any queen mattress" },
    isNew: true,
    rating: 4.8,
    reviews: 72,
    material: ["Wood"],
    color: "Oak",
    inStock: true,
  },
  {
    id: "8",
    name: "Writing Desk",
    price: 599,
    category: "Office",
    image: productDining,
    gallery: [productDining, productLamp, productChair],
    description: "Compact writing desk with hidden cable management. Perfect for modern home offices.",
    longDescription: "The Writing Desk is designed for focused creativity. Its clean surface hides a clever cable management system with a rear channel and integrated power strip compartment. Two slim drawers on soft-close slides keep essentials at hand. Made from solid oak with a natural oil finish that's warm to the touch.",
    specs: { "Dimensions": "120 × 60 × 75 cm", "Weight": "28 kg", "Material": "Solid Oak", "Drawers": "2 with soft-close", "Cable Management": "Integrated rear channel", "Finish": "Natural Oil" },
    rating: 4.4,
    reviews: 35,
    material: ["Wood"],
    color: "Oak",
    inStock: false,
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Art of Scandinavian Minimalism",
    excerpt: "Discover how less becomes more in the world of Nordic interior design. From clean lines to natural materials.",
    content: [
      "Scandinavian design emerged in the early 20th century as a response to the ornate excesses of Victorian interiors. Designers across Denmark, Sweden, Norway, Finland, and Iceland began to ask a radical question: what if every object in a home had to earn its place?",
      "The answer gave birth to an aesthetic philosophy that now shapes interiors around the globe. At its core, Scandinavian minimalism is not about emptiness — it is about intentionality. Each piece of furniture, each texture, each beam of carefully considered light exists because it adds meaning or function, preferably both.",
      "Natural materials are the foundation. Solid oak, pine, and birch bring warmth and honesty to a space. Undyed linens and wools introduce softness without artifice. The palette draws from the Nordic landscape — pale creams, deep charcoals, muted sage greens, and the warm amber of firelight.",
      "Lighting plays an outsized role in Nordic interiors, largely because Scandinavian winters bring long stretches of darkness. Layered light sources — a floor lamp casting a warm pool in one corner, candles on a dining table, a pendant above a reading chair — create an atmosphere the Danes call 'hygge': a feeling of coziness and contentment.",
      "Perhaps most importantly, Scandinavian minimalism is not cold. The popular misconception that Nordic interiors are sterile misses the point entirely. The discipline of reduction is always in service of comfort. Fewer objects means the ones that remain are more treasured. A single handcrafted bowl on a shelf speaks louder than a dozen decorative pieces competing for attention.",
      "As you consider your own home, start with subtraction. Remove what you do not love or use. Then, slowly and deliberately, bring back only what earns its place. That is the art of Scandinavian minimalism.",
    ],
    date: "2026-02-01",
    author: "Emma Lindström",
    authorRole: "Head of Design",
    category: "Design",
    readTime: "5 min",
    image: productTable,
    tags: ["Minimalism", "Scandinavian", "Interior Design"],
  },
  {
    id: "2",
    title: "Sustainable Wood: Our Promise",
    excerpt: "Every piece tells a story. Learn about our commitment to responsibly sourced materials and eco-friendly craftsmanship.",
    content: [
      "When we founded this workshop, we made a promise: every tree used in our furniture would be replaced. Twenty years later, that promise has grown into something far more comprehensive — a full commitment to responsible forestry, zero-waste production, and long-lasting design.",
      "We source exclusively from FSC-certified forests across Northern Europe. These forests are managed under strict guidelines that ensure biodiversity is preserved, water cycles are protected, and local communities benefit from sustainable harvesting practices. We visit our suppliers every year, walk the forests, and meet the people who tend them.",
      "In our workshop, offcuts become smaller components — drawer runners, shelf brackets, internal bracing. Sawdust is compressed into fuel pellets that heat the workshop in winter. We have reduced production waste by 78% over the past decade, and we are not finished.",
      "Our finishing oils and waxes are plant-based and VOC-free, safe for your home and safe for the craftspeople who apply them. Upholstery textiles are GOTS-certified organic, free from pesticides and synthetic dyes.",
      "Perhaps our most important sustainability commitment is longevity. The most sustainable piece of furniture is the one that never needs replacing. Every joint we cut, every surface we finish, every cushion we fill is designed to last decades, not seasons. We offer a five-year warranty on all structural components and lifetime repair services at our workshop.",
      "Sustainability is not a feature we offer. It is the way we work.",
    ],
    date: "2026-01-20",
    author: "Lars Andersen",
    authorRole: "Founder & Master Craftsman",
    category: "Sustainability",
    readTime: "4 min",
    image: productShelf,
    tags: ["Sustainability", "Craftsmanship", "Materials"],
  },
  {
    id: "3",
    title: "Small Spaces, Big Ideas",
    excerpt: "Transform compact living areas into functional, beautiful spaces with modular furniture solutions.",
    content: [
      "The average city apartment has shrunk by nearly 30% over the past three decades. Yet the desire for a home that feels spacious, comfortable, and personal has not diminished. The challenge — and the opportunity — lies in designing smarter, not smaller.",
      "The first principle of small-space design is verticality. When floor space is limited, draw the eye upward. Floor-to-ceiling shelving transforms a wall into a library, a display, a statement. A tall, slender lamp adds height to a room without consuming square footage. Hanging plants cascade from shelves rather than sitting on precious surfaces.",
      "Modular furniture is your greatest ally. A bookshelf that converts to a room divider. A dining table with fold-down leaves that seats two on a Tuesday and eight on a Saturday. A platform bed with integrated storage that eliminates the need for a separate dresser. Every piece should serve at least two purposes.",
      "Light is the single most powerful tool for making a space feel larger. Maximize natural light by keeping window sills clear and using sheer curtains rather than heavy drapes. Place mirrors strategically — opposite a window to bounce light deep into the room, or at the end of a narrow corridor to visually extend it.",
      "Color matters more in small spaces than large ones. A consistent, light-toned palette — warm cream, soft white, pale oak — creates visual continuity that expands a room. Reserve bolder colors for accents: a terracotta cushion, a deep blue throw, a single artwork that commands attention.",
      "Finally, embrace editing. In a small space, every object competes for attention. Be ruthless about what earns a place in your home. The result is not a compromised life — it is a curated one.",
    ],
    date: "2026-01-10",
    author: "Sofia Bergman",
    authorRole: "Interior Stylist",
    category: "Tips",
    readTime: "6 min",
    image: productChair,
    tags: ["Small Spaces", "Interior Tips", "Modular"],
  },
  {
    id: "4",
    title: "Living Room Design Ideas",
    excerpt: "Inspiration for creating a cozy, stylish living room that reflects your personality and lifestyle.",
    content: [
      "The living room is the heart of the home—a place for relaxation, conversation, and making memories. Whether you prefer minimalist Scandinavian aesthetics or a more eclectic mix, the key is to create a space that feels both inviting and functional.",
      "Start with your focal point. For many, it's the sofa—the anchor of the room. Choose a piece that balances comfort with style. A neutral-toned sofa offers flexibility for changing accents, while a bold statement piece can define the entire space.",
      "Layer textures to add depth. Combine linen upholstery with a wool throw, a wooden coffee table with a ceramic vase. The interplay of materials creates visual interest and tactile warmth.",
      "Lighting sets the mood. Combine ambient overhead light with task lamps for reading and accent lights to highlight artwork or plants. Dimmers are essential for transitioning from day to evening.",
      "Don't forget the power of plants. A few well-placed indoor plants bring life and freshness to any living room. Choose low-maintenance varieties like pothos or snake plants if you're new to plant care.",
    ],
    date: "2026-02-15",
    author: "Emma Lindström",
    authorRole: "Head of Design",
    category: "Design",
    readTime: "4 min",
    image: productSofa,
    tags: ["Living Room", "Interior Design", "Styling"],
  },
  {
    id: "5",
    title: "Best Sofa for Small House",
    excerpt: "How to choose the perfect sofa when space is limited—without sacrificing comfort or style.",
    content: [
      "Finding the right sofa for a small living room can feel like solving a puzzle. You need comfort, style, and proportions that work—all within a tight footprint. Here's how to make the right choice.",
      "Measure twice, buy once. Before you shop, measure your space and leave at least 30 inches for walkways. A sofa that's too large will make the room feel cramped; too small and it can look lost.",
      "Consider scale over size. A low-profile sofa with clean lines can seat three people while occupying less visual space than a bulky sectional. Look for sofas with exposed legs—they create an airy feel.",
      "Modular and sectional options offer flexibility. A two-seater with a chaise can be reconfigured as your needs change. Some designs allow you to add or remove modules over time.",
      "Fabric choice matters. Light colors and subtle patterns can make a sofa feel less imposing. Velvet and linen both work well in small spaces—velvet adds depth, linen keeps things light.",
      "Finally, think multi-function. A sofa bed or one with built-in storage can maximize every square inch of your small home.",
    ],
    date: "2026-02-20",
    author: "Sofia Bergman",
    authorRole: "Interior Stylist",
    category: "Tips",
    readTime: "5 min",
    image: productSofa,
    tags: ["Sofa", "Small Spaces", "Buying Guide"],
  },
  {
    id: "6",
    title: "How to Choose Dining Table",
    excerpt: "A practical guide to selecting the perfect dining table for your space, style, and lifestyle.",
    content: [
      "The dining table is where families gather, friends share meals, and memories are made. Choosing the right one requires balancing size, material, style, and durability.",
      "Start with capacity. How many people do you need to seat regularly? Allow 24–30 inches per person for comfort. A 6-seater typically needs a table around 72 inches long; for 8, aim for 96 inches.",
      "Consider your space. A round table works well in square rooms and encourages conversation. Rectangular tables suit longer rooms. Extendable tables offer flexibility for occasional guests.",
      "Material affects both aesthetics and maintenance. Solid wood—oak, walnut, maple—ages beautifully and can be refinished. It's an investment that lasts generations. Veneer offers a similar look at a lower price. Glass tops feel light and modern but require more care.",
      "Think about your lifestyle. Do you have young children? A durable, easy-to-clean surface matters. Do you host often? Extendable leaves or a larger fixed size might be worth it.",
      "Finally, match the table to your chairs—or intentionally mix styles for an eclectic look. The dining area should feel cohesive with the rest of your home.",
    ],
    date: "2026-02-25",
    author: "Lars Andersen",
    authorRole: "Founder & Master Craftsman",
    category: "Buying Guide",
    readTime: "5 min",
    image: productDining,
    tags: ["Dining Table", "Buying Guide", "Furniture"],
  },
  {
    id: "7",
    title: "Furniture Care Tips",
    excerpt: "Keep your wooden and upholstered furniture looking beautiful for years with these simple care practices.",
    content: [
      "Quality furniture deserves quality care. With a few simple habits, you can keep your pieces looking and performing their best for decades.",
      "For solid wood furniture: Dust regularly with a soft, dry cloth. Avoid harsh chemicals—a damp cloth with mild soap is sufficient for spills. Use coasters under drinks and placemats under hot dishes to prevent rings and heat damage. Reapply oil or wax finishes annually to maintain the wood's luster and protection.",
      "For upholstered pieces: Vacuum weekly to remove dust and allergens. Rotate cushions periodically to ensure even wear. Address spills immediately—blot, don't rub—and use a fabric-appropriate cleaner. Consider professional cleaning every 1–2 years for deep cleaning.",
      "Protect from sun and heat. Direct sunlight can fade wood and fabrics over time. Use curtains or blinds during peak hours. Keep furniture away from radiators and vents to prevent drying and cracking.",
      "Handle with care. When moving furniture, lift rather than drag to protect legs and joints. Use felt pads under chair and table legs to prevent scratches on floors.",
      "With these practices, your furniture will age gracefully and serve your home for generations.",
    ],
    date: "2026-03-01",
    author: "Lars Andersen",
    authorRole: "Founder & Master Craftsman",
    category: "Care",
    readTime: "4 min",
    image: productShelf,
    tags: ["Care", "Maintenance", "Wood", "Upholstery"],
  },
];
