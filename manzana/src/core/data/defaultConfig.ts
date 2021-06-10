export let defaultCOnfig = {
  directories: {
    resource: "resources",
  },
  file: {
    extDefault: "webp",
    imageSize: "800",
  },
  queries: {
    recentsEvents: 10,
  },
  priceCredits: [
    {
      price: 50,
      symbol: "PEN",
      description: "Moneda Peruana",
    },
  ],

  defaultCredits: {
    info: {
      labels: [
        { label: "{credits}", description: "Creditos aplicados" },
        { label: "{name}", description: "Nombres del usuario" },
        { label: "{lastName}", description: "Apellidos del usuario" },
      ],
      description:
        "Creditos aplicados por defecto al usuario al ingresar a la plataforma",
    },
    data: [
      {
        reason: "Creditos de Bienvenida",
        credits: 10,
      },
    ],
  },
  messages: {
    creditsAdded: {
      info: {
        labels: [{ label: "{credits}", description: "Creditos aprobados" }],
        description:
          "Mensaje que aparece, cuando se aprueban los creditos solicitudes",
      },
      message: "Se han agreado {credits} creditos a su cuenta",
    },
  },
};
