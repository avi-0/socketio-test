import convert from "color-convert";
import random from "random";

export function colorFromId(id: string): string {
    const rng = random.clone(id);
    const hue = rng.float(0, 360);

    return "#" + convert.hsl.hex([hue, 100, 35])
}