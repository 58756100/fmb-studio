// Every image the three reels use, in one place. Paths are relative to kit/remotion/public.
// To swap in a new ChatGPT cutout, drop the PNG into kit/remotion/public/img/obj and change the path here.
export const IMG = {
  // C1
  supra: "img/car-01.png",
  shoebox: "img/obj/shoebox.png",
  receipt: "img/obj/receipt-01.png",
  receiptsScatter: "img/obj/receipts-scatter.png",
  handPhone: "img/obj/hand-holding-phone.png",
  turboKit: "img/part-01.png",
  coilovers: "img/part-02.png",
  brakes: "img/part-06.png",
  intake: "img/part-04.png",
  turboBay: "img/obj/vacuum-line-photo.png",
  lift: "img/obj/car-lift.png",
  // G2
  e30: "img/car-08.png",
  jenAvatar: "img/obj/avatar-badge.png",
  grid: ["img/car-15.png", "img/car-17.png", "img/car-10.png", "img/car-16.png"], // red GR86, white Integra, yellow Civic, white Corvette
  beauty: ["img/car-07.png", "img/car-18.png", "img/car-16.png", "img/car-04.png", "img/car-09.png"], // NSX, Corvette, Mustang, then 2 more
  engine: "img/obj/engine-block.png",
  harness: "img/part-05.png",
  mounts: "img/part-07.png",
  // P1
  boxOpen: "img/obj/shipping-box-open.png",
  boxClosed: "img/obj/shipping-box-closed.png",
  stars: "img/obj/review-stars.png",
} as const;

// Fictional brand names on the parts rows (the scripts left them as {brand}). Change here.
export const BRANDS = {
  turbo: "Arden",
  coilovers: "Northline",
  brakes: "Halden",
  intake: "Vesk",
  mounts: "Brightwork",
  harness: "Loomline",
  clutch: "Tensa",
  korvane: "Korvane",
} as const;
