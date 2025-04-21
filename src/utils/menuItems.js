// src/utils/menuItems.js
const menuItems = [
    {
      category: "Salchipapas",
      items: [
        {
          name: "Salchipapa 1999 (Clásica)",
          description: "Una deliciosa mezcla de papas fritas y salchichas clásicas.",
          prices: {
            mediana: 20000,
            grande: 30000
          },
          image: "/images/menu/salchipapa1999.jpg"
        },
        {
          name: "Salchipapa 1961 (Pollo)",
          description: "El sabor tradicional de la salchipapa con pollo jugoso.",
          prices: {
            mediana: 26000,
            grande: 36000
          },
          image: "/images/menu/salchipapa1961_pollo.jpg"
        },
        {
          name: "Salchipapa 1961 (Carne)",
          description: "El sabor tradicional de la salchipapa con carne tierna.",
          prices: {
            mediana: 26000,
            grande: 36000
          },
          image: "/images/menu/salchipapa1961_carne.jpg"
        },
        {
          name: "Ford Falcon (Pollo con Huevitos)",
          description: "Salchipapa con pollo jugoso y huevos frescos.",
          prices: {
            mediana: 32000,
            grande: 42000
          },
          image: "/images/menu/fordfalcon_pollo.jpg"
        },
        {
          name: "Ford Falcon (Carne con Huevitos)",
          description: "Salchipapa con carne tierna y huevos frescos.",
          prices: {
            mediana: 32000,
            grande: 42000
          },
          image: "/images/menu/fordfalcon_carne.jpg"
        },
        {
          name: "Salchipapa 2023 (Tocineta y Maíz)",
          description: "Una combinación deliciosa de papas, tocineta crujiente y maíz.",
          prices: {
            mediana: 30000,
            grande: 40000
          },
          image: "/images/menu/salchipapa2023.jpg"
        },
        {
          name: "Carrito Rojo",
          description: "Nuestra especialidad: papas con una mezcla de sabores únicos.",
          prices: {
            mediana: 35000,
            grande: 45000
          },
          image: "/images/menu/carritorojo.jpg"
        },
        {
          name: "Salchipapa Familiar",
          description: "La versión familiar de nuestra deliciosa salchipapa.",
          prices: {
            grande: 44000
          },
          image: "/images/menu/salchipapafamiliar.jpg"
        },
        {
          name: "Salchipapa Mixta Familiar",
          description: "Una salchipapa mixta, ideal para compartir en familia.",
          prices: {
            grande: 60000
          },
          image: "/images/menu/salchipapamixta.jpg"
        },
        {
          name: "Papas Americanas",
          description: "Deliciosas papas fritas acompañadas de aderezos especiales.",
          prices: {
            grande: 25000
          },
          image: "/images/menu/papasamericanas.jpg"
        },
        {
          name: "Mini Salchipapa",
          description: "Una porción pequeña pero sabrosa de papas fritas con salchicha.",
          prices: {
            personal: 15000
          },
          image: "/images/menu/mini_salchipapa.jpg"
        }
      ]
    },
    {
      category: "Salchipapas Premium",
      items: [
        {
          name: "Salchipapa Premium 1999 (Clásica)",
          description: "Una versión premium de nuestra salchipapa clásica con ingredientes seleccionados.",
          prices: {
            mediana: 33000,
            grande: 43000
          },
          image: "/images/menu/salchipapapremium1999.jpg"
        },
        {
          name: "Salchipapa Premium 1961 (Pollo)",
          description: "Versión premium con pollo jugoso de alta calidad.",
          prices: {
            mediana: 43000,
            grande: 53000
          },
          image: "/images/menu/salchipapapremium1961_pollo.jpg"
        },
        {
          name: "Salchipapa Premium 1961 (Carne)",
          description: "Versión premium con carne tierna de alta calidad.",
          prices: {
            mediana: 43000,
            grande: 53000
          },
          image: "/images/menu/salchipapapremium1961_carne.jpg"
        },
        {
          name: "Salchipapa Premium 2023 (Tocineta y Maíz)",
          description: "Combinación de tocineta y maíz, con la mejor calidad de papas.",
          prices: {
            mediana: 42000,
            grande: 52000
          },
          image: "/images/menu/salchipapapremium2023.jpg"
        },
        {
          name: "Carrito Rojo Premium",
          description: "La versión premium de nuestro Carrito Rojo con más ingredientes y mejor sabor.",
          prices: {
            mediana: 46000,
            grande: 56000
          },
          image: "/images/menu/carritorojopremium.jpg"
        },
        {
          name: "Salchipapa de la Casa",
          description: "Una versión exclusiva de nuestra salchipapa, cargada con sabor.",
          prices: {
            grande: 80000
          },
          image: "/images/menu/salchipapadelacasa.jpg"
        }
      ]
    },
    {
      category: "Hamburguesas",
      items: [
        {
          name: "Hamburguesa Clásica",
          description: "Hamburguesa de carne de res con lechuga, tomate y mayonesa.",
          price: 15000,
          image: "/images/menu/hamburguesaclasica.jpg"
        },
        {
          name: "Hamburguesa de Pollo",
          description: "Hamburguesa con pechuga de pollo jugosa y fresca.",
          price: 15000,
          image: "/images/menu/hamburguesadepollo.jpg"
        },
        {
          name: "Hamburguesa Doble Carne",
          description: "Dos jugosas carnes de res en una hamburguesa enorme.",
          price: 20000,
          image: "/images/menu/hamburguesadoblecarne.jpg"
        },
        {
          name: "Hamburguesa Mixta",
          description: "Combinación de carne de res y pollo, para los que no pueden decidir.",
          price: 20000,
          image: "/images/menu/hamburguesamixta.jpg"
        },
        {
          name: "Hamburguesa Doble Carne Mixta",
          description: "La hamburguesa mixta, pero con el doble de carne, para los más hambrientos.",
          price: 25000,
          image: "/images/menu/hamburguesadoblecarne_mixta.jpg"
        },
        {
          name: "Hamburguesa Cheddar and Bacon",
          description: "Hamburguesa con bacon crujiente y queso cheddar derretido.",
          price: 19000,
          image: "/images/menu/hamburguesachedarandbacon.jpg"
        },
        {
          name: "Hamburguesa Maíz y Tocineta",
          description: "Hamburguesa con una mezcla única de maíz dulce y tocineta crujiente.",
          price: 28000,
          image: "/images/menu/hamburguesamaizytochineta.jpg"
        },
        {
          name: "Hamburguesa Granjera",
          description: "Hamburguesa con ingredientes frescos inspirados en el campo.",
          price: 29000,
          image: "/images/menu/hamburguesagranjera.jpg"
        },
        {
          name: "Hamburguesa Ranchera",
          description: "Hamburguesa con un toque rústico y sabores intensos.",
          price: 29000,
          image: "/images/menu/hamburguesaranchera.jpg"
        },
        {
          name: "Hamburguesa Doble Bacon and Cheddar",
          description: "Doble porción de bacon y queso cheddar en una hamburguesa irresistible.",
          price: 29000,
          image: "/images/menu/hamburguesadoble_baconandcheddar.jpg"
        },
        {
          name: "Hamburguesa La Aletosa",
          description: "Hamburguesa con un sabor audaz y una mezcla especial de salsas.",
          price: 28000,
          image: "/images/menu/hamburguesalaaletosa.jpg"
        },
        {
          name: "Hamburguesa La Taurina",
          description: "Hamburguesa potente y llena de energía con ingredientes robustos.",
          price: 28000,
          image: "/images/menu/hamburguesalataurina.jpg"
        },
        {
          name: "Hamburguesa Árabe de Carne",
          description: "Hamburguesa de carne con especias árabes y salsa especial.",
          price: 17000,
          image: "/images/menu/hamburguesa_arabe_carne.jpg"
        },
        {
          name: "Hamburguesa Árabe de Pollo",
          description: "Hamburguesa de pollo con un toque árabe y salsa cremosa.",
          price: 17000,
          image: "/images/menu/hamburguesa_arabe_pollo.jpg"
        },
        {
          name: "Hamburguesa Árabe Mixta",
          description: "Hamburguesa con carne y pollo en un estilo árabe único.",
          price: 22000,
          image: "/images/menu/hamburguesa_arabe_mixta.jpg"
        }
      ]
    },
    {
      category: "Perros",
      items: [
        {
          name: "Perro Sencillo",
          description: "Hot dog clásico con salchicha y aderezos básicos.",
          prices: {
            mediano: 10000,
            grande: 12000
          },
          image: "/images/menu/perro_sencillo.jpg"
        },
        {
          name: "Perro Pollo",
          description: "Hot dog con salchicha de pollo y salsas deliciosas.",
          prices: {
            mediano: 15000,
            grande: 18000
          },
          image: "/images/menu/perro_pollo.jpg"
        },
        {
          name: "Perro Carne",
          description: "Hot dog con carne desmechada y aderezos especiales.",
          prices: {
            mediano: 15000,
            grande: 18000
          },
          image: "/images/menu/perro_carne.jpg"
        },
        {
          name: "Choriperro",
          description: "Hot dog con chorizo jugoso y un toque picante.",
          price: 14000,
          image: "/images/menu/choriperro.jpg"
        },
        {
          name: "Perro Desgranado de Pollo",
          description: "Hot dog con pollo desmenuzado y una mezcla de sabores.",
          prices: {
            mediano: 20000,
            grande: 23000
          },
          image: "/images/menu/perro_desgranado_pollo.jpg"
        },
        {
          name: "Perro Desgranado de Carne",
          description: "Hot dog con carne desmenuzada y aderezos irresistibles.",
          prices: {
            mediano: 20000,
            grande: 23000
          },
          image: "/images/menu/perro_desgranado_carne.jpg"
        },
        {
          name: "Perro Granjero",
          description: "Hot dog con ingredientes frescos y un toque campestre.",
          price: 30000,
          image: "/images/menu/perro_granjero.jpg"
        },
        {
          name: "Perro Submarino",
          description: "Hot dog cargado de ingredientes que te sumergirán en su sabor.",
          price: 27000,
          image: "/images/menu/perro_submarino.jpg"
        },
        {
          name: "Perro Gringo",
          description: "Hot dog al estilo americano con un toque especial.",
          price: 17000,
          image: "/images/menu/perro_gringo.jpg"
        },
        {
          name: "Perro Bellaco",
          description: "Hot dog atrevido con una combinación única de sabores.",
          price: 25000,
          image: "/images/menu/perro_bellaco.jpg"
        },
        {
          name: "Perro Mixto",
          description: "Hot dog con una mezcla de pollo y carne para los indecisos.",
          prices: {
            mediano: 20000,
            grande: 23000
          },
          image: "/images/menu/perro_mixto.jpg"
        },
        {
          name: "Perro Americano",
          description: "Hot dog con un estilo clásico americano y aderezos deliciosos.",
          price: 14000,
          image: "/images/menu/perro_americano.jpg"
        },
        {
          name: "Perro Árabe Clásico",
          description: "Hot dog con un toque árabe y especias exóticas.",
          price: 12000,
          image: "/images/menu/perro_arabe_clasico.jpg"
        },
        {
          name: "Perro Árabe Carne",
          description: "Hot dog con carne y un sabor árabe auténtico.",
          price: 16000,
          image: "/images/menu/perro_arabe_carne.jpg"
        },
        {
          name: "Perro Árabe Pollo",
          description: "Hot dog con pollo y un toque árabe irresistible.",
          price: 16000,
          image: "/images/menu/perro_arabe_pollo.jpg"
        },
        {
          name: "Perro Árabe Mixto",
          description: "Hot dog con carne y pollo en un estilo árabe único.",
          price: 20000,
          image: "/images/menu/perro_arabe_mixto.jpg"
        }
      ]
    },
    {
      category: "Sandwiches",
      items: [
        {
          name: "Sandwich de Jamón y Queso",
          description: "Sandwich clásico con jamón y queso derretido.",
          price: 6000,
          image: "/images/menu/sandwich_jamon_y_queso.jpg"
        },
        {
          name: "Sandwich de Pollo",
          description: "Sandwich con pollo jugoso y aderezos frescos.",
          price: 13000,
          image: "/images/menu/sandwich_pollo.jpg"
        },
        {
          name: "Sandwich de Carne",
          description: "Sandwich con carne tierna y salsas deliciosas.",
          price: 13000,
          image: "/images/menu/sandwich_carne.jpg"
        },
        {
          name: "Sandwich Mixto",
          description: "Sandwich con una mezcla de pollo y carne para un sabor único.",
          price: 18000,
          image: "/images/menu/sandwich_mixto.jpg"
        },
        {
          name: "Sandwich Desgranado de Pollo",
          description: "Sandwich con pollo desmenuzado y una combinación de sabores.",
          price: 18000,
          image: "/images/menu/sandwich_desgranado_pollo.jpg"
        },
        {
          name: "Sandwich Desgranado de Carne",
          description: "Sandwich con carne desmenuzada y aderezos irresistibles.",
          price: 18000,
          image: "/images/menu/sandwich_desgranado_carne.jpg"
        },
        {
          name: "Sandwich de la Casa",
          description: "Nuestra especialidad en sandwich, cargado de ingredientes exclusivos.",
          price: 28000,
          image: "/images/menu/sandwich_de_la_casa.jpg"
        }
      ]
    },
    {
      category: "Maicitos",
      items: [
        {
          name: "Maicito de Pollo",
          description: "Maíz tierno con pollo jugoso y aderezos especiales.",
          price: 22000,
          image: "/images/menu/maicito_pollo.jpg"
        },
        {
          name: "Maicito de Carne",
          description: "Maíz tierno con carne tierna y salsas deliciosas.",
          price: 22000,
          image: "/images/menu/maicito_carne.jpg"
        },
        {
          name: "Maicito Mixto Personal",
          description: "Maíz con una mezcla de pollo y carne en porción individual.",
          price: 26000,
          image: "/images/menu/maicito_mixto_personal.jpg"
        },
        {
          name: "Maicito Mixto para Dos",
          description: "Maíz mixto con pollo y carne, perfecto para compartir.",
          price: 30000,
          image: "/images/menu/maicito_mixto_para_dos.jpg"
        }
      ]
    },
    {
      category: "Porciones",
      items: [
        {
          name: "Porción de Papa",
          description: "Papas fritas crujientes para acompañar o disfrutar solas.",
          price: 10000,
          image: "/images/menu/porcion_papa.jpg"
        },
        {
          name: "Porción de Papa con Salchicha",
          description: "Papas fritas acompañadas de salchicha para un snack rápido.",
          price: 13000,
          image: "/images/menu/porcion_papa_con_salchicha.jpg"
        }
      ]
    }
  ];
  
  export default menuItems;