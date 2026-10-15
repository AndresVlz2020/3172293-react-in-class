import laptop from "@/assets/images/card-laptop.png";
import monitotr from "@/assets/images/card-monitor.png";
import mouse from "@/assets/images/card-mouse.png";
import teclado from "@/assets/images/card-teclado.png";

export const products = [
    {
        id: 1,
        title: "Laptop profesional",
        price: 3500000,
        description: "Laptop de alto rendimiento para desarrollo y diseño",
        image: laptop,
        category: "perifericos"
    },
    {
        id: 2,
        title: "Monitor 27 pulgadas",
        price: 1200000,
        description: "Monitor IPS para programación y edición",
        image: monitotr,
        category: "perifericos"
    },
    {
        id: 3,
        title: "Mouse",
        price: 80000,
        description: "Mouse ergonómico, la mejor caldiad y precio",
        image: mouse,
        category: "perifericos"
    },
    {
        id: 4,
        title: "Teclado Gamer",
        price: 50000,
        description: "Teclado mecánico con iluminación RGB",
        image: teclado,
        category: "perifericos"
    }
];