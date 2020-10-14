import { Howl, Howler } from "howler";
import { resolve } from "../webpack.config";
import * as _ from "lodash";

let clickSound: Howl;
let pickupSounds: Howl[] = [];
let dropSounds: Howl[] = [];

export function loadSounds(): Promise<void> {
  return new Promise((resolve) => {
    clickSound = new Howl({
      src: [require("./assets/inventory_click.wav").default],
    });

    let pickupSoundSRC = [
      require("./assets/ui-pickup-leather-1.wav").default,
      require("./assets/ui-pickup-leather-2.wav").default,
      require("./assets/ui-pickup-leather-3.wav").default,
      require("./assets/ui-pickup-leather-4.wav").default,
    ];

    pickupSoundSRC.forEach((src) => {
      pickupSounds.push(
        new Howl({
          src: [src],
          volume: 0.2,
        })
      );
    });

    let dropSoundSRC = [
      require("./assets/ui-pickup-leather-1.wav").default,
      require("./assets/ui-pickup-leather-2.wav").default,
      require("./assets/ui-pickup-leather-3.wav").default,
      require("./assets/ui-pickup-leather-4.wav").default,
    ];

    dropSoundSRC.forEach((src) => {
      dropSounds.push(
        new Howl({
          src: [src],
          volume: 0.2,
        })
      );
    });
    resolve();
  });
}

export function playPickupSound() {
  _.sample(pickupSounds).play();
}

export function playDropSound() {
  _.sample(dropSounds).play();
}

export function playClickSound() {
  clickSound.play();
}
