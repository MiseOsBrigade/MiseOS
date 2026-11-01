import { defineAvalElement } from "@pixel-point/aval-element";

defineAvalElement();

const player = document.querySelector("#collectible");
const stateButtons = document.querySelectorAll("[data-state]");

for (const button of stateButtons) {
  button.addEventListener("click", async () => {
    const state = button.getAttribute("data-state");

    if (!state || !player || typeof player.setState !== "function") {
      return;
    }

    try {
      await player.setState(state);
    } catch (error) {
      console.error(`Unable to activate collectible state: ${state}`, error);
    }
  });
}
