// ==========================================
// 1. Toast Notification
// ==========================================
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Set initial toast styles for the animation
const toastStyleEl = document.createElement('style');
toastStyleEl.textContent = `.toast { opacity: 0; transform: translateY(20px); }`;
document.head.appendChild(toastStyleEl);

// ==========================================
// 2. Activity 7 — Live Booking Summary
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const matchSelect = document.getElementById('select-match');
    const standSelect = document.getElementById('stand-category');
    const qtyInput    = document.getElementById('num-tickets');

    const outMatch = document.getElementById('summary-match');
    const outStand = document.getElementById('summary-stand');
    const outPrice = document.getElementById('summary-price');
    const outQty   = document.getElementById('summary-qty');
    const outTotal = document.getElementById('summary-total');

    if (!matchSelect || !standSelect || !qtyInput || !outMatch || !outStand || !outPrice || !outQty || !outTotal) return;

    function getBasePrice() {
        const opt = matchSelect.options[matchSelect.selectedIndex];
        const p = parseFloat(opt?.dataset?.price);
        return Number.isFinite(p) ? p : 0;
    }

    function getStandMultiplier() {
        const opt = standSelect.options[standSelect.selectedIndex];
        const m = parseFloat(opt?.dataset?.multiplier);
        return Number.isFinite(m) ? m : 1;
    }

    function getQuantity() {
        let q = parseInt(qtyInput.value, 10);
        if (!Number.isFinite(q) || q < 1) q = 1;
        if (q > 10) q = 10;
        return q;
    }

    function formatINR(n) {
        return '₹' + n.toLocaleString('en-IN', {
            minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
            maximumFractionDigits: 2
        });
    }

    function updateSummary() {
        const hasMatch = matchSelect.value !== '';
        const hasStand = standSelect.value !== '';
        const matchText = hasMatch ? matchSelect.options[matchSelect.selectedIndex].text.trim() : '—';
        const standText = hasStand ? standSelect.options[standSelect.selectedIndex].text.trim() : '—';
        const pricePerTicket = getBasePrice() * getStandMultiplier();
        const qty = getQuantity();
        const total = pricePerTicket * qty;

        outMatch.textContent = matchText;
        outStand.textContent = standText;
        outPrice.textContent = (hasMatch && hasStand) ? formatINR(pricePerTicket) : '₹0';
        outQty.textContent   = qty;
        outTotal.textContent = formatINR(total);

        if (qtyInput.value !== String(qty)) qtyInput.value = qty;
        return { hasMatch, hasStand, total };
    }

    let timer = null;
    function announce() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const { hasMatch, hasStand, total } = updateSummary();
            if (hasMatch && hasStand) showToast(`✅ Summary updated — Total: ${formatINR(total)}`);
        }, 400);
    }

    matchSelect.addEventListener('change', announce);
    standSelect.addEventListener('change', announce);
    qtyInput.addEventListener('input', announce);
    qtyInput.addEventListener('change', announce);
    qtyInput.addEventListener('blur', () => {
        qtyInput.value = getQuantity();
        updateSummary();
    });

    updateSummary();
});

// ==========================================
// 3. Activity 8 — Hamburger Menu (Mobile)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu after clicking a link (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
});

// ==========================================
// 4. Activity 8 — Team Filter
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const filterSelect = document.getElementById('team-filter');
    const matchCards   = document.querySelectorAll('.match-card');
    if (!filterSelect || !matchCards.length) return;

    filterSelect.addEventListener('change', () => {
        const team = filterSelect.value;

        matchCards.forEach(card => {
            const teams = card.dataset.teams.split(' ');
            if (team === 'all' || teams.includes(team)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        showToast(team === 'all' ? '📋 Showing all matches' : `🔍 Filtered by ${team}`);
    });
});

// ==========================================
// 5. Activity 8 — Grid / List View Toggle
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const gridBtn = document.getElementById('view-grid');
    const listBtn = document.getElementById('view-list');
    const matchContainer = document.getElementById('match-cards');
    if (!gridBtn || !listBtn || !matchContainer) return;

    gridBtn.addEventListener('click', () => {
        matchContainer.classList.remove('list-view');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        showToast('▦ Grid view');
    });

    listBtn.addEventListener('click', () => {
        matchContainer.classList.add('list-view');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        showToast('☰ List view');
    });
});

// ==========================================
// 6. Smooth scroll — Book buttons (Activity 5)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const bookButtons = document.querySelectorAll('.book-btn, #matches table button');
    bookButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const section = document.getElementById('book-ticket');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                showToast('📢 Redirecting to Booking Form...');
            }
        });
    });
});