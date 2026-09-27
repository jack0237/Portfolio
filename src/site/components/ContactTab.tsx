"use client";

import { useEffect, useState } from "react";
import { CONTACT_MAILTO } from "@/lib/site";

// Onglet braise vertical, desktop uniquement (CSS). Règle « un seul élément braise
// à l'écran » : masqué quand la scène finale (#contact) est visible. Pas de téléphone.
export function ContactTab({ label }: { label: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("contact");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  // <aside> nommé : l'onglet appartient à un landmark (axe « region », QA F08).
  return (
    <aside className="contact-aside" aria-label={label}>
      <a
        className="contact-tab"
        href={CONTACT_MAILTO}
        data-hidden={hidden ? "true" : "false"}
        aria-hidden={hidden ? "true" : undefined}
        tabIndex={hidden ? -1 : undefined}
      >
        {label}
      </a>
    </aside>
  );
}
