async function fetchData() {
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Response status:', error.response ? error.response.status : 'N/A');
        console.error('Response text:', error.response ? error.response.statusText : 'N/A');
        return null;
    }
}

function createCard(product) {
    const card = document.createElement('div');
    card.className = 'card';

    const backgroundImageContainer = document.createElement('div');
    backgroundImageContainer.className = 'background-image-container';

    const backgroundImage = new Image();
    backgroundImage.src = product.image;
    backgroundImage.className = 'background-image';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    ['badge_text', 'additional_text'].forEach(prop => {
        if (product[prop]) {
            const badge = document.createElement('p');
            badge.className = prop === 'badge_text' ? 'badge-on-image' : 'additional-text-on-image';
            badge.textContent = product[prop];
            imageContainer.appendChild(badge);
        }
    });

    backgroundImageContainer.appendChild(imageContainer);
    backgroundImageContainer.appendChild(backgroundImage);
    card.appendChild(backgroundImageContainer);

    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';

    const title = document.createElement('h3');
    title.textContent = product.title;
    title.className = 'product-title';
    textContainer.appendChild(title);

    const vendor = document.createElement('p');
    vendor.textContent = product.vendor;
    textContainer.appendChild(vendor);

    card.appendChild(textContainer);

    const priceContainer = document.createElement('div');
    priceContainer.className = 'price-container';

    ['price', 'compare_at_price'].forEach(prop => {
        const priceElement = document.createElement('p');
        priceElement.textContent = prop === 'price' ? `Price: $${product[prop]}` : `$${product[prop]}`;
        if (prop === 'compare_at_price') priceElement.classList.add('compare-price');
        priceContainer.appendChild(priceElement);
    });

    const discount = document.createElement('p');
    discount.className = 'discount';
    discount.textContent = `${calculateDiscount(product.price, product.compare_at_price)}% off`;
    priceContainer.appendChild(discount);

    card.appendChild(priceContainer);

    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'add-to-cart-btn';
    addToCartBtn.textContent = 'Add to Cart';
    card.appendChild(addToCartBtn);

    return card;
}

async function switchTab(category) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';

    const apiResponse = await fetchData();

    if (!apiResponse) {
        console.error('Unable to fetch data.');
        return;
    }

    const selectedCategory = apiResponse.categories.find(cat => cat.category_name === category);

    selectedCategory.category_products.forEach(product => {
        const card = createCard(product);
        productContainer.appendChild(card);
    });
}

function calculateDiscount(price, compareAtPrice) {
    const discountPercentage = compareAtPrice ? ((compareAtPrice - price) / compareAtPrice) * 100 : 0;
    return Math.round(discountPercentage);
}

// Initial load (show Women's products by default)
switchTab('Women');
