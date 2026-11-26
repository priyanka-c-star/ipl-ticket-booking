// ==========================================
// 1. Reusable Toast Notification Function
// ==========================================
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;

    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#0a192f';
    toast.style.color = '#d4af37';
    toast.style.padding = '15px 25px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    toast.style.zIndex = '9999';
    toast.style.fontWeight = 'bold';
    toast.style.fontFamily = 'system-ui, sans-serif';
    toast.style.fontSize = '0.95rem';
    toast.style.pointerEvents = 'none';
    toast.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ==========================================
// 2. Smooth Scrolling for "Book" Buttons
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const bookButtons = document.querySelectorAll('#matches table button, .book-btn, button[data-scroll="book"]');

    bookButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const bookingSection = document.getElementById('book-ticket')
                                || document.getElementById('booking-form-section');
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                showToast('📢 Redirecting to Booking Form...');
            } else {
                showToast('📢 Please fill out the form below.');
            }
        });
    });
});

// ==========================================
// 3. Activity 7 — Live Booking Summary
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

    if (!matchSelect || !standSelect || !qtyInput || !outMatch || !outStand || !outPrice || !outQty || !outTotal) {
        return;
    }

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

    let toastTimer = null;
    function announceUpdate() {
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            const { hasMatch, hasStand, total } = updateSummary();
            if (hasMatch && hasStand) {
                showToast(`✅ Summary updated — Total: ${formatINR(total)}`);
            }
        }, 400);
    }

    matchSelect.addEventListener('change', announceUpdate);
    standSelect.addEventListener('change', announceUpdate);
    qtyInput.addEventListener('input',  announceUpdate);
    qtyInput.addEventListener('change', announceUpdate);
    qtyInput.addEventListener('blur', () => {
        qtyInput.value = getQuantity();
        updateSummary();
    });

    updateSummary();
});