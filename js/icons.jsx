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
    <svg width={p.size||28} height={p.size||28} viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93a7.898 7.898 0 0 0-2.327-5.607zm-5.607 12.2a6.6 6.6 0 0 1-3.384-.934l-.267-.16-2.497.654.666-2.433-.174-.25a6.556 6.556 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592a6.6 6.6 0 0 1-3.384-.934zm3.633-4.938c-.197-.098-1.17-.578-1.353-.646-.182-.066-.315-.098-.447.099-.133.197-.513.646-.63.775-.115.132-.23.148-.428.05-.197-.1-.836-.308-1.592-.984-.59-.525-.987-1.176-1.102-1.373-.116-.198-.012-.305.087-.403.088-.088.197-.23.296-.346.1-.116.132-.198.197-.33.066-.132.033-.248-.017-.346-.05-.099-.445-1.076-.61-1.47-.16-.389-.323-.335-.445-.34-.115-.007-.247-.007-.379-.007a.729.729 0 0 0-.526.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.132 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.91.13 1.253.08.383-.058 1.171-.48 1.338-.943.164-.462.164-.858.115-.943-.05-.082-.182-.132-.38-.23z"/>
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
