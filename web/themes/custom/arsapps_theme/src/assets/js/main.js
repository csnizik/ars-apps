import Alpine from "@alpinejs/csp";
import focus from "@alpinejs/focus";
import mask from "@alpinejs/mask";
import anchor from "@alpinejs/anchor";

Alpine.plugin(focus);
Alpine.plugin(mask);
Alpine.plugin(anchor);

if (typeof window.Alpine === "undefined") {
  window.Alpine = Alpine;
  Alpine.start();
}