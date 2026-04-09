require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    merchant: { type: String, required: true },
    images: [String],
    tags: [String],
    stock: { type: Number, default: 10 },
    created_at: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

const products = [
    {
        name: "Structured Linen Blazer",
        description: "Cream-colored linen blazer with structured shoulders, perfect for minimalist wardrobes. Breathable fabric ideal for spring/summer layering.",
        category: "clothing",
        price: 185,
        merchant: "Tailored Elegance",
        images: ["images/blazer-cream.jpeg"],
        tags: ["minimalist", "formal", "outerwear", "linen", "cream", "blazer", "structured"],
        stock: 8
    },
    {
        name: "Layered Gold Necklace",
        description: "Delicate layered gold necklace with three chains of varying lengths. Adds subtle elegance to any outfit.",
        category: "jewelry",
        price: 145,
        merchant: "Fine Jewelry Co",
        images: ["images/necklace-gold.jpeg"],
        tags: ["minimalist", "formal", "casual", "gold", "necklace", "layered", "delicate"],
        stock: 15
    },
    {
        name: "Double-Breasted Coat",
        description: "Classic black wool overcoat with double-breasted design. Timeless piece for winter wardrobes with clean lines.",
        category: "clothing",
        price: 295,
        merchant: "Winter Essentials",
        images: ["images/coat-black.jpeg"],
        tags: ["minimalist", "formal", "outerwear", "wool", "black", "coat", "winter"],
        stock: 5
    },
    {
        name: "Silk Slip Dress",
        description: "Elegant beige silk slip dress with delicate straps. Versatile piece that transitions from day to evening.",
        category: "clothing",
        price: 215,
        merchant: "Elegant Threads",
        images: ["images/dress-silk.jpeg"],
        tags: ["minimalist", "formal", "casual", "silk", "beige", "dress", "slip"],
        stock: 12
    },
    {
        name: "Cashmere Crewneck",
        description: "Soft beige cashmere sweater with classic crewneck design. Essential layering piece for colder months.",
        category: "clothing",
        price: 165,
        merchant: "Nordic Knits",
        images: ["images/sweater-beige.jpeg"],
        tags: ["minimalist", "casual", "cashmere", "beige", "sweater", "knit", "winter"],
        stock: 10
    },
    {
        name: "Leather Tote Bag",
        description: "Premium tan leather tote with structured design and multiple compartments. Professional yet stylish everyday bag.",
        category: "accessories",
        price: 425,
        merchant: "Luxury Leather Co",
        images: ["images/bag-leather.jpeg"],
        tags: ["minimalist", "formal", "casual", "leather", "tan", "tote", "bag", "structured"],
        stock: 6
    },
    {
        name: "Wide-Leg Trousers",
        description: "High-waisted wide-leg trousers in charcoal grey. Tailored fit with pleats and side pockets.",
        category: "clothing",
        price: 135,
        merchant: "Tailored Elegance",
        tags: ["minimalist", "formal", "casual", "trousers", "grey", "wide-leg", "tailored"],
        stock: 14
    },
    {
        name: "Minimalist Watch",
        description: "Sleek stainless steel watch with white dial and leather strap. Clean design with Roman numerals.",
        category: "accessories",
        price: 245,
        merchant: "Fine Jewelry Co",
        tags: ["minimalist", "formal", "watch", "stainless-steel", "leather", "white"],
        stock: 9
    },
    {
        name: "Leather Loafers",
        description: "Classic black leather loafers with subtle stitching. Comfortable and versatile for office or casual wear.",
        category: "footwear",
        price: 195,
        merchant: "Winter Essentials",
        tags: ["minimalist", "formal", "casual", "leather", "black", "loafers", "shoes"],
        stock: 11
    },
    {
        name: "Cotton Shirt Dress",
        description: "Crisp white cotton shirt dress with button-down front and belt. Perfect transitional piece.",
        category: "clothing",
        price: 155,
        merchant: "Elegant Threads",
        tags: ["minimalist", "casual", "cotton", "white", "dress", "shirt-dress", "belted"],
        stock: 13
    },
    {
        name: "Wool Turtleneck",
        description: "Soft merino wool turtleneck in charcoal. Classic base layer for winter styling.",
        category: "clothing",
        price: 145,
        merchant: "Nordic Knits",
        tags: ["minimalist", "casual", "wool", "charcoal", "turtleneck", "winter"],
        stock: 16
    },
    {
        name: "Canvas Backpack",
        description: "Durable waxed canvas backpack with leather straps. Spacious interior with laptop compartment.",
        category: "accessories",
        price: 185,
        merchant: "Luxury Leather Co",
        tags: ["casual", "canvas", "backpack", "leather", "durable", "laptop"],
        stock: 7
    },
    {
        name: "Midi Skirt",
        description: "A-line midi skirt in navy with subtle pleats. Pairs well with tucked blouses or sweaters.",
        category: "clothing",
        price: 125,
        merchant: "Tailored Elegance",
        tags: ["minimalist", "formal", "casual", "skirt", "navy", "midi", "pleated"],
        stock: 10
    },
    {
        name: "Gold Hoop Earrings",
        description: "Medium-sized gold hoop earrings with brushed finish. Versatile everyday piece.",
        category: "jewelry",
        price: 95,
        merchant: "Fine Jewelry Co",
        tags: ["minimalist", "casual", "gold", "earrings", "hoops"],
        stock: 20
    },
    {
        name: "Wool Scarf",
        description: "Soft merino wool scarf in camel. Lightweight yet warm, perfect for layering.",
        category: "accessories",
        price: 85,
        merchant: "Nordic Knits",
        tags: ["minimalist", "casual", "wool", "camel", "scarf", "winter"],
        stock: 18
    },
    {
        name: "Ankle Boots",
        description: "Black leather ankle boots with low heel. Sleek design suitable for all-day wear.",
        category: "footwear",
        price: 215,
        merchant: "Winter Essentials",
        tags: ["minimalist", "formal", "casual", "leather", "black", "boots", "ankle"],
        stock: 8
    },
    {
        name: "Linen Shirt",
        description: "Relaxed-fit linen shirt in off-white. Breathable and perfect for warm weather.",
        category: "clothing",
        price: 95,
        merchant: "Elegant Threads",
        tags: ["minimalist", "casual", "linen", "white", "shirt", "relaxed"],
        stock: 15
    },
    {
        name: "Crossbody Bag",
        description: "Compact leather crossbody bag in cognac. Adjustable strap and interior card slots.",
        category: "accessories",
        price: 165,
        merchant: "Luxury Leather Co",
        tags: ["minimalist", "casual", "leather", "cognac", "bag", "crossbody"],
        stock: 12
    },
    {
        name: "Merino Cardigan",
        description: "Lightweight merino cardigan in grey with button closure. Ideal layering piece.",
        category: "clothing",
        price: 135,
        merchant: "Nordic Knits",
        tags: ["minimalist", "casual", "merino", "grey", "cardigan", "knit"],
        stock: 11
    },
    {
        name: "Silver Cuff Bracelet",
        description: "Simple sterling silver cuff with smooth finish. Modern and understated.",
        category: "jewelry",
        price: 115,
        merchant: "Fine Jewelry Co",
        tags: ["minimalist", "casual", "silver", "bracelet", "cuff"],
        stock: 14
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');
        
        await Product.deleteMany({});
        console.log('✓ Cleared existing products');
        
        await Product.insertMany(products);
        console.log(`✓ Inserted ${products.length} products`);
        
        console.log('\n✓ Seed complete!');
        process.exit(0);
    } catch (error) {
        console.error('✗ Seed error:', error);
        process.exit(1);
    }
}

seed();
