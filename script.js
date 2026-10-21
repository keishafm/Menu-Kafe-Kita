/* ==========================================
   1. DATA MENU KAFE (ARRAY OF OBJECTS)
   ================================---------- */
// Di sinilah kamu bisa menambah, mengurangi, atau mengubah menu kafe dengan mudah!
const menuData = [
    {
        id: 1,
        name: "Caffe Latte",
        category: "coffee",
        price: 25000,
        desc: "Espresso dengan susu segar pilihan yang creamy bikin semangat seharian.",
        img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=150"
    },
    {
        id: 2,
        name: "Nasi Goreng Spesial",
        category: "food",
        price: 30000,
        desc: "Nasi goreng rempah rahasia kafe lengkap dengan telur dan ayam suwir gurih.",
        img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=150"
    },
    {
        id: 3,
        name: "Kentang Goreng",
        category: "snack",
        price: 18000,
        desc: "Kentang renyah di luar, lembut di dalam, bertabur bumbu gurih nagih.",
        img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=150"
    },
    {
        id: 4,
        name: "Matcha Ice Blend",
        category: "coffee",
        price: 28000,
        desc: "Minuman teh hijau Jepang dingin yang manis dan menyegarkan tenggorokan.",
        img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=150"
    }
];

// Variabel untuk menampung item yang dipilih pelanggan di keranjang
let cart = [];

/* ==========================================
   2. MENAMPILKAN MENU KE HALAMAN (RENDER)
   ================================---------- */
function displayMenu(menus) {
    const menuList = document.getElementById('menuList');
    menuList.innerHTML = ''; // Kosongkan daftar sebelum diisi ulang

    menus.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('menu-card');
        card.setAttribute('data-category', item.category);
        card.setAttribute('data-name', item.name.toLowerCase());

        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="menu-img">
            <div class="menu-info">
                <div class="menu-title">${item.name}</div>
                <div class="menu-desc">${item.desc}</div>
                <div class="menu-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                <button class="add-btn" onclick="addToCart('${item.name}', ${item.price})">+ Tambah</button>
            </div>
        `;
        menuList.appendChild(card);
    });
}

// Jalankan fungsi tampil menu saat pertama kali web dibuka
window.onload = function() {
    displayMenu(menuData);
};

/* ==========================================
   3. LOGIKA KERANJANG BELANJA (CART)
   ================================---------- */
function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    
    updateCartUI();
}

function updateCartUI() {
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    document.getElementById('cartCount').innerText = totalItems + ' item';
    document.getElementById('cartTotal').innerText = 'Rp ' + totalPrice.toLocaleString('id-ID');
}

/* ==========================================
   4. FITUR PENCARIAN & FILTER KATEGORI
   ================================---------- */
// Filter berdasarkan kategori tombol
function filterMenu(category) {
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        displayMenu(menuData);
    } else {
        const filtered = menuData.filter(item => item.category === category);
        displayMenu(filtered);
    }
}

// Pencarian menu secara real-time via search input
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const keyword = e.target.value.toLowerCase();
        const filtered = menuData.filter(item => item.name.toLowerCase().includes(keyword));
        displayMenu(filtered);
    });
}

/* ==========================================
   5. CHECKOUT KE WHATSAPP KASIR
   ================================---------- */
function checkoutWhatsApp() {
    let tableNo = document.getElementById('tableNumber').value.trim();
    
    if (!tableNo) {
        alert('Ups! Jangan lupa isi nomor meja kamu dulu ya di bagian atas! 😉');
        document.getElementById('tableNumber').focus();
        return;
    }

    if (cart.length === 0) {
        alert('Keranjang masih kosong, nih! Pilih dulu makanan atau minuman kesukaanmu ya. 🍽️');
        return;
    }

    let message = `Halo Kak, saya mau pesan menu nih:\n*Nomor Meja:* ${tableNo}\n\n`;
    let totalPrice = 0;

    cart.forEach((item, index) => {
        let subtotal = item.price * item.quantity;
        totalPrice += subtotal;
        message += `${index + 1}. ${item.name} (${item.quantity}x) - Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    message += `\n*Total Pembayaran: Rp ${totalPrice.toLocaleString('id-ID')}*\n\nMohon segera diproses ya, makasih banyak! ✨`;

    // Ganti nomor di bawah dengan nomor WhatsApp kasir kafe (awali 62 tanpa angka 0 di depan)
    let waNumber = '6281234567890'; 
    let encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank');
}
