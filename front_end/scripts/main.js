/* =========================
   CYBERDUCK — slider simple
========================= */
(() => {
  const slides = Array.from(document.querySelectorAll("[data-slide]"));
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const dotsWrap = document.getElementById("dots");

  if (!slides.length || !prevBtn || !nextBtn || !dotsWrap) return;

  let index = 0;

  const setActive = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle("is-active", idx === index));
    Array.from(dotsWrap.children).forEach((d, idx) => d.classList.toggle("is-active", idx === index));
  };

  // dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot" + (i === 0 ? " is-active" : "");
    dot.ariaLabel = `Ir al slide ${i + 1}`;
    dot.addEventListener("click", () => setActive(i));
    dotsWrap.appendChild(dot);
  });

  prevBtn.addEventListener("click", () => setActive(index - 1));
  nextBtn.addEventListener("click", () => setActive(index + 1));

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced) {
    setInterval(() => setActive(index + 1), 6500);
  }
})();

/* Product modal behavior: open modal when clicking a product, populate fields, allow close */
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const modal = document.getElementById('productModal');
    const backdrop = document.getElementById('productModalBackdrop');
    const closeBtn = document.getElementById('productModalClose');
    const titleEl = document.getElementById('productTitle');
    const priceEl = document.getElementById('productPrice');
    const descEl = document.getElementById('productDescription');
    const imageEl = document.getElementById('productModalImage');

    function gatherProductData(product){
      const name = product.dataset.title || (product.querySelector('.gallery__name') && product.querySelector('.gallery__name').textContent) || 'Producto';
      const price = product.dataset.price || (product.querySelector('.gallery__price') && product.querySelector('.gallery__price').textContent) || '—';
      const desc = product.dataset.description || (product.querySelector('.gallery__meta') && product.querySelector('.gallery__meta').textContent) || '';
      let image = '';
      const innerImage = product.querySelector('.gallery__image');
      if(innerImage){
        const style = getComputedStyle(innerImage);
        image = (style.backgroundImage && style.backgroundImage !== 'none') ? style.backgroundImage : (style.background || '');
      }
      return {name, price, desc, image};
    }

    function goToProductPage(product){
      const data = gatherProductData(product);
      try{ localStorage.setItem('cyberduck:selectedProduct', JSON.stringify(data)); }catch(e){ /* ignore */ }
      window.location.href = './product.html';
    }

    // Ensure floating cart UI exists (inject into body) so it works on all pages
    function ensureCartUI(){
      if(document.getElementById('cartButton')) return;
      const container = document.createElement('div');
      container.className = 'cart cart-floating';
      container.innerHTML = `
        <button id="cartButton" class="iconbtn cart-btn" type="button" aria-label="Carrito">🛒<span id="cartCount" class="cart-badge" aria-hidden="true">0</span></button>
        <div id="cartDropdown" class="cart-dropdown" hidden>
          <div class="cart-dropdown__head">
            <strong>Carrito</strong>
            <button id="cartClear" class="btn">Vaciar</button>
          </div>
          <div id="cartItems" class="cart-items"></div>
          <div class="cart-dropdown__foot">
            <div id="cartTotal" class="cart-total">Total: —</div>
            <a id="cartCheckout" class="btn btn--primary" href="#">Pagar →</a>
          </div>
        </div>
      `;
      document.body.appendChild(container);
    }

    ensureCartUI();
    // make checkout link go to checkout page
    const cartCheckoutLink = document.getElementById('cartCheckout');
    if(cartCheckoutLink){ cartCheckoutLink.setAttribute('href', './checkout.html'); }

    // Attach direct listeners to known product elements for reliability
    const items = Array.from(document.querySelectorAll('.gallery__item, .card'));
    items.forEach(item => item.addEventListener('click', function(e){
      e.preventDefault();
      goToProductPage(item);
    }));

    // Fallback: delegated listener for any other trigger
    document.addEventListener('click', function(e){
      const trigger = e.target.closest('[data-product-trigger]');
      if(trigger){
        e.preventDefault();
        goToProductPage(trigger);
      }
    });
  
    /* Cart: simple cart UI and localStorage-backed data */
    const CART_KEY = 'cyberduck:cart';
    function readCart(){
      try{ const raw = localStorage.getItem(CART_KEY); return raw ? JSON.parse(raw) : []; }catch(e){ return []; }
    }
    function writeCart(cart){ try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }catch(e){}
    }

    function formatPrice(p){ return p; }

    function renderCart(){
      const btn = document.getElementById('cartButton');
      const countEl = document.getElementById('cartCount');
      const dropdown = document.getElementById('cartDropdown');
      const itemsWrap = document.getElementById('cartItems');
      const totalEl = document.getElementById('cartTotal');
      if(!btn || !countEl || !dropdown || !itemsWrap || !totalEl) return;

      const cart = readCart();
      countEl.textContent = String(cart.length || 0);

      // Enable/disable checkout link depending on cart contents (do this before early return)
      const checkoutLink = document.getElementById('cartCheckout');
      if(checkoutLink){
        if(!cart.length){
          checkoutLink.classList.add('is-disabled');
          checkoutLink.setAttribute('aria-disabled', 'true');
          checkoutLink.setAttribute('href', '#');
        } else {
          checkoutLink.classList.remove('is-disabled');
          checkoutLink.removeAttribute('aria-disabled');
          checkoutLink.setAttribute('href', './checkout.html');
        }
      }

      itemsWrap.innerHTML = '';
      if(!cart.length){
        itemsWrap.innerHTML = '<div class="cart-empty">No hay productos en el carrito</div>';
        totalEl.textContent = 'Total: —';
        return;
      }

      let total = 0;
      cart.forEach((it, idx) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';

        const thumb = document.createElement('div');
        thumb.className = 'cart-item__thumb';
        if(it.image){ thumb.style.backgroundImage = it.image.indexOf('url(') === 0 ? it.image : `url(${it.image})`; }

        const meta = document.createElement('div'); meta.className = 'cart-item__meta';
        const name = document.createElement('div'); name.className = 'cart-item__name'; name.textContent = it.name || 'Producto';
        const price = document.createElement('div'); price.className = 'cart-item__price'; price.textContent = it.price || '';

        meta.appendChild(name); meta.appendChild(price);

          const rm = document.createElement('button'); rm.className = 'cart-item__remove'; rm.type = 'button'; rm.innerHTML = '✕';
          rm.addEventListener('click', function(e){
            e.stopPropagation();
            cart.splice(idx,1);
            writeCart(cart);
            renderCart();
            // keep dropdown open after removing
            const dd = document.getElementById('cartDropdown'); if(dd) dd.hidden = false;
            try{ window.dispatchEvent(new Event('cyberduck:cart-updated')); }catch(err){}
          });

        itemEl.appendChild(thumb); itemEl.appendChild(meta); itemEl.appendChild(rm);
        itemsWrap.appendChild(itemEl);

        // Try to parse numeric price for total (best-effort)
        const num = (it.price || '').replace(/[^0-9.,]/g,'').replace(',', '.');
        const val = parseFloat(num) || 0;
        total += val;
      });

      totalEl.textContent = 'Total: ' + (total ? formatPrice(total) : '—');

      
    }

    // Listen for explicit cart-updated events (fired after cart change in-page)
    window.addEventListener('cyberduck:cart-updated', function(){
      renderCart();
      // pulse animation for visual feedback
      const btn = document.getElementById('cartButton');
      if(btn){
        btn.classList.add('is-pulse');
        setTimeout(() => btn.classList.remove('is-pulse'), 480);
      }
    });

    document.addEventListener('click', function(e){
      const cartBtn = e.target.closest('#cartButton');
      if(cartBtn){
        const dd = document.getElementById('cartDropdown');
        if(dd){ dd.hidden = !dd.hidden; if(!dd.hidden) renderCart(); }
      } else {
        // click outside closes cart
        const dd = document.getElementById('cartDropdown');
        if(dd && !e.target.closest('.cart')) dd.hidden = true;
      }
    });

    // Clear cart
    const clearBtn = document.getElementById('cartClear');
    if(clearBtn){ clearBtn.addEventListener('click', function(){ writeCart([]); renderCart(); }); }

    // Initial render
    renderCart();
  });
})();

