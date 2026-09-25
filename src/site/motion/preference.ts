// Préférence de mouvement : partagée par le script inline du <head>, MotionProvider et MotionToggle.
export const MOTION_STORAGE_KEY = "jack0237-motion";
export const MOTION_EVENT = "jack0237:motion";

export type MotionTier = "reduced" | "standard" | "rich";

export function readUserReduce(): boolean {
  try {
    return localStorage.getItem(MOTION_STORAGE_KEY) === "reduce";
  } catch {
    return false;
  }
}

export function writeUserReduce(reduce: boolean) {
  try {
    if (reduce) localStorage.setItem(MOTION_STORAGE_KEY, "reduce");
    else localStorage.removeItem(MOTION_STORAGE_KEY);
  } catch {
    /* stockage indisponible : la préférence vaut pour la visite */
  }
  window.dispatchEvent(new CustomEvent(MOTION_EVENT));
}

type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/** Paliers d'appareils, DESIGN.md 10.4. */
export function computeTier(): MotionTier {
  const nav = navigator as NavigatorExtras;
  const systemReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = Boolean(nav.connection?.saveData);
  const isWide = window.matchMedia("(min-width: 1024px)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const mem = nav.deviceMemory;
  const lowMemMobile = !isWide && typeof mem === "number" && mem < 4;
  if (systemReduce || saveData || lowMemMobile || readUserReduce()) return "reduced";
  const cores = nav.hardwareConcurrency ?? 4;
  if (isWide && finePointer && cores >= 4 && (mem === undefined || mem >= 4)) return "rich";
  return "standard";
}

/**
 * Script inline exécuté avant le premier rendu : pose data-motion="reduced" au plus tôt
 * pour que la mise en page réduite (liste verticale, fil statique) s'applique sans flash.
 */
export const MOTION_BOOT_SCRIPT = `(function(){try{var d=document.documentElement;var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var u=localStorage.getItem('${MOTION_STORAGE_KEY}')==='reduce';var c=navigator.connection;if(r||u||(c&&c.saveData)){d.setAttribute('data-motion','reduced');}}catch(e){}})();`;
