// assets/js/site-components.js
// <site-header base="../" current="privacy"></site-header>

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const base = this.getAttribute('base') || './';
    const current = (this.getAttribute('current') || '').toLowerCase();

    // ЕДИНЫЙ критический стиль (совпадает с фолбэком на страницах)
    const css = `
      :host{ display:block }
      .sh{
        max-width: var(--layout-max, 980px);
        margin-inline: auto;
        padding-inline: var(--layout-x, 20px);
      }
      .grid-rail{
        display:grid;
        grid-template-columns: 1fr minmax(var(--rail-width,210px), max-content);
        align-items:start; gap:0 24px; padding-top:1rem;
      }
      nav ul{ margin:0; padding:0; list-style:none }
      nav li::marker{ content:none }

      .brand{
        font-size: clamp(24px, 3.2vw, 40px);
        line-height:1.1; letter-spacing:-.01em; font-weight:800;
        color: var(--accent, #0a84ff); text-decoration:none;
      }
      .nav-right{
        grid-column:2; justify-self:start;
        display:flex; gap:1rem; align-items:center;
        white-space: nowrap;           /* не даём переноситься */
      }
      .nav-right a{
        display:inline-block; line-height:1.1; font-weight:600;
        color: var(--accent, #0a84ff); text-decoration:none;
      }
      .nav-right a:hover{ text-decoration: underline }
      .nav-right a[aria-current="page"]{ text-underline-offset:2px }

      @media (max-width:640px){
        .grid-rail{
          grid-template-columns: 1fr minmax(var(--rail-width,180px), max-content);
        }
        .nav-right{ justify-self:center }
      }
    `;
    if (!this.querySelector('style[data-sh]')) {
      const style = document.createElement('style');
      style.setAttribute('data-sh','');
      style.textContent = css;
      this.prepend(style);
    }

    // Фолбэк уже может быть на странице — используем его; иначе создадим
    let wrapper = this.querySelector('.sh');
    if (!wrapper) {
      this.insertAdjacentHTML('beforeend', `
        <div class="sh">
          <nav class="grid-rail">
            <ul><li><a class="brand" href="${base}">Invoicify</a></li></ul>
            <ul class="nav-right">
              <li><a data-key="faq" href="${base}faq.html">FAQ</a></li>
              <li><a data-key="privacy" href="${base}privacy/privacy.html">Privacy</a></li>
              <li><a data-key="terms" href="${base}terms.html">Terms</a></li>
            </ul>
          </nav>
        </div>
      `);
      wrapper = this.querySelector('.sh');
    } else {
      const nav = wrapper.querySelector('nav');
      nav.querySelector('.brand')?.setAttribute('href', base);
      nav.querySelector('[data-key="faq"]')?.setAttribute('href', `${base}faq.html`);
      nav.querySelector('[data-key="privacy"]')?.setAttribute('href', `${base}privacy/privacy.html`);
      nav.querySelector('[data-key="terms"]')?.setAttribute('href', `${base}terms.html`);
    }

    // Подсветка активного пункта
    this.querySelectorAll('[aria-current]').forEach(a => a.removeAttribute('aria-current'));
    if (current) this.querySelector(`[data-key="${current}"]`)?.setAttribute('aria-current','page');
  }
}
customElements.define('site-header', SiteHeader);