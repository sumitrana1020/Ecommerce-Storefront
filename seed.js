const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const seedProducts = async () => {
  console.log("Fetching products from DummyJSON...");
  
  const res = await fetch("https://dummyjson.com/products?limit=100");
  const data = await res.json();
  
  console.log(`Found ${data.products.length} products. Inserting...`);
  
  let success = 0;
  let failed = 0;

  for (const product of data.products) {
    const payload = {
      name: product.title,
      description: product.description,
      price: product.price * 83, // convert USD to INR
      stock: product.stock,
      category: product.category,
      imageUrl: product.thumbnail
    };

    try {
      const response = await fetch("https://ecommerce-storefront-0cfa.onrender.com/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log(`✅ Added: ${product.title}`);
        success++;
      } else {
        console.log(`❌ Failed: ${product.title}`);
        failed++;
      }
    } catch (err) {
      console.log(`❌ Error: ${product.title} - ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone! ✅ ${success} added, ❌ ${failed} failed`);
};

seedProducts();