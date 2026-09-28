const IMG = "https://static.prod-images.emergentagent.com/jobs/e857de67-4c7c-47bf-b5cb-e190c2c87968/images";

export const HERO_IMAGE = `${IMG}/4f6f193d144b786ad9d3348d982ea889676170433fd07fea556c65215e64590c.jpeg`;
export const ABOUT_IMAGE = `${IMG}/9b2fca7175d50c8becfda0f1cc57d7153d129e159ca436560e7736284e79f4a3.jpeg`;

export const SIZE_GUIDE = [
  { size: "XS", chest: "104 cm", length: "68 cm", sleeve: "59 cm", recommended: "160-170 cm / 55-65 kg" },
  { size: "S", chest: "108 cm", length: "70 cm", sleeve: "60 cm", recommended: "168-175 cm / 65-72 kg" },
  { size: "M", chest: "114 cm", length: "72 cm", sleeve: "61 cm", recommended: "173-182 cm / 72-80 kg" },
  { size: "L", chest: "120 cm", length: "74 cm", sleeve: "62 cm", recommended: "178-188 cm / 80-88 kg" },
  { size: "XL", chest: "126 cm", length: "76 cm", sleeve: "63 cm", recommended: "182-192 cm / 88-96 kg" },
  { size: "XXL", chest: "132 cm", length: "78 cm", sleeve: "64 cm", recommended: "185-198 cm / >95 kg" },
];

export const products = [
  {
    slug: "sudadera-rh11-heavyweight",
    name: "Sudadera RH11 Heavyweight Hood",
    shortName: "Heavyweight Hood",
    category: "Sudadera",
    price: 89.0,
    currency: "EUR",
    badge: "EDICIÓN LIMITADA · 420 GSM",
    images: [
      `${IMG}/f872cb450e55e9a3d9e3792c953dc20edeb26b31920bf176afd1b4aafce393aa.jpeg`,
      `${IMG}/68b9f6f009dbe163cb88c805c691240df41d2ba4fa24fca6bee0e7ffd333c394.jpeg`,
      `${IMG}/9eb44872feaaeb3c6d1883a9d360f5e120884721ee839e025856e872db29d925.jpeg`,
      `${IMG}/a60d933d3bd0ac15e6643097bd4ce38ec6a2f310af71e4081b9b34aa99ae4c33.jpeg`,
    ],
    short_description:
      "Capucha envolvente sin cordones visibles, bolsillo canguro oculto y corte oversize atlético fabricado en algodón denso peinado.",
    full_description:
      "La sudadera definitiva de entrenamiento y calle. Diseñada con un peso estructural de 420 GSM que mantiene su caída limpia sesión tras sesión. Doble puño elástico, interior afelpado térmico de tacto sedoso y remates termosellados.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Negro Obsidiana", hex: "#0A0A0A" },
      { name: "Gris Carbón", hex: "#27272A" },
      { name: "Rojo Umbra", hex: "#5A0B13" },
    ],
    specs: {
      gramaje: "420 GSM French Terry",
      composicion: "100% Algodón Peinado Orgánico",
      origen: "Confeccionado en Portugal / Tintado en España",
      lavado: "Lavar en frío a 30°C. No usar secadora. Planchar del revés.",
    },
  },
  {
    slug: "camiseta-rh11-tactical-tee",
    name: "Camiseta RH11 Tactical Boxy Tee",
    shortName: "Tactical Boxy Tee",
    category: "Camiseta",
    price: 45.0,
    currency: "EUR",
    badge: "ALTA DENSIDAD · 240 GSM",
    images: [
      `${IMG}/d29fdccd2ede37089fc8da74e9978ced543996d01ea629c08cfa99192b0ce53c.jpeg`,
      `${IMG}/6d781ac8e8fac1e6c26e51f3599f998480527cb4b245cbf7bc3178551dd4e6be.jpeg`,
      `${IMG}/fcbd81115afd011492de8011fb2c8a54042a310da10b331e5bf742196ab33408.jpeg`,
      `${IMG}/688517d3399a6d052356eff5a4d7a20065fd370f4620a015bf6a9cf7c105f7e5.jpeg`,
    ],
    short_description:
      "Cuello cerrado de 3 cm reforzado, hombro caído y acabado texturizado matte. La base perfecta para tu día a día de alto rendimiento.",
    full_description:
      "Construida para resistir el roce y mantener un porte intachable. El grosor de 240 GSM proporciona una silueta limpia sin transparencias. Transpirable, con costuras planas anti-rozaduras para levantamientos y uso diario.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Negro Obsidiana", hex: "#0A0A0A" },
      { name: "Gris Grafito", hex: "#27272A" },
    ],
    specs: {
      gramaje: "240 GSM Single Jersey",
      composicion: "100% Algodón Peinado Premium",
      origen: "Confeccionado en Portugal",
      lavado: "Lavar en frío a 30°C. Secado al aire recomendado.",
    },
  },
];

export const getProduct = (slug) => products.find((p) => p.slug === slug);
export const otherProduct = (slug) => products.find((p) => p.slug !== slug);

export const formatPrice = (v) => `${v.toFixed(2).replace(".", ",")} €`;
