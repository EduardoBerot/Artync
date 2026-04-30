// Inline icon set — kept lean, no library needed.
const Icon = {
  arrow: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  check: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),

  whatsapp: (p) => (
    <svg width={p.size||28} height={p.size||28} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16.003 3C9.374 3 4 8.373 4 15c0 2.13.557 4.213 1.617 6.052L4 29l8.144-1.587A11.96 11.96 0 0 0 16.003 29C22.633 29 28 23.628 28 17c0-7.732-5.367-14-11.997-14zm0 22.18c-1.972 0-3.892-.532-5.566-1.539l-.398-.237-4.83.94.96-4.7-.26-.41A9.18 9.18 0 0 1 6.82 15c0-5.072 4.111-9.18 9.183-9.18 5.07 0 9.18 4.108 9.18 9.18 0 5.07-4.11 9.18-9.18 9.18zm5.31-6.86c-.292-.146-1.728-.852-1.995-.95-.267-.097-.461-.146-.656.146s-.751.95-.92 1.144c-.17.195-.34.219-.63.073-.292-.146-1.232-.453-2.347-1.444-.867-.773-1.452-1.726-1.622-2.018-.17-.292-.018-.45.128-.595.131-.13.292-.34.438-.51.146-.17.195-.292.292-.487.097-.195.049-.365-.024-.51-.073-.146-.656-1.583-.9-2.166-.236-.567-.476-.49-.656-.499l-.56-.01c-.195 0-.51.073-.778.365-.267.292-1.022.998-1.022 2.434s1.046 2.823 1.192 3.018c.146.195 2.058 3.142 4.985 4.41.697.301 1.241.481 1.665.616.7.222 1.337.19 1.84.115.561-.083 1.728-.706 1.971-1.387.243-.682.243-1.266.17-1.387-.073-.122-.267-.195-.56-.34z"/>
    </svg>
  ),

  plus: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  spark: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6L12 2zM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14zM18 14l1 2.7 2.7 1-2.7 1L18 21l-1-2.3-2.7-1 2.7-1L18 14z"/>
    </svg>
  ),
  shield: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/>
    </svg>
  ),
  bolt: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
    </svg>
  ),
  close: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),

  instagram: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  ),
};
window.Icon = Icon;
