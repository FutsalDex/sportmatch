export const PROVINCIAS_ESPANA = [
  "A Coruña", "Álava/Araba", "Albacete", "Alicante/Alacant", "Almería", "Asturias", "Ávila", "Badajoz", 
  "Balears, Illes", "Barcelona", "Bizkaia", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón/Castelló", 
  "Ciudad Real", "Córdoba", "Cuenca", "Gipuzkoa", "Girona", "Granada", "Guadalajara", "Huelva", "Huesca", 
  "Jaén", "Las Palmas", "León", "Lleida", "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Ourense", 
  "Palencia", "Pontevedra", "Rioja, La", "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla", 
  "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Zamora", "Zaragoza"
];

export const DISTRITOS_PORTUGAL = [
  "Lisboa", "Porto", "Coimbra", "Braga", "Faro", "Aveiro", "Leiria", "Santarém", "Viseu", "Setúbal", 
  "Évora", "Beja", "Castelo Branco", "Guarda", "Portalegre", "Vila Real", "Bragança", "Viana do Castelo", 
  "Madeira", "Açores"
];

export const PARROQUIAS_ANDORRA = [
  "Andorra la Vella", "Canillo", "Encamp", "Escaldes-Engordany", "La Massana", "Ordino", "Sant Julià de Lòria"
];

export const COUNTRIES = ["España", "Portugal", "Andorra"];

export const GET_LOCATION_LIST = (country: string) => {
  switch (country) {
    case 'España': return PROVINCIAS_ESPANA;
    case 'Portugal': return DISTRITOS_PORTUGAL;
    case 'Andorra': return PARROQUIAS_ANDORRA;
    default: return PROVINCIAS_ESPANA;
  }
};

export const GET_LOCATION_LABEL = (country: string) => {
  switch (country) {
    case 'España': return "PROVINCIA";
    case 'Portugal': return "DISTRITO";
    case 'Andorra': return "PARROQUIA";
    default: return "PROVINCIA";
  }
};

export const POSICIONES_FUTBOL = {
  "Portería": [
    { value: "POR", label: "POR: Portero" }
  ],
  "Defensa": [
    { value: "LD", label: "LD: Lateral Derecho" },
    { value: "LI", label: "LI: Lateral Izquierdo" },
    { value: "DFC", label: "DFC: Defensa Central" },
    { value: "CAD", label: "CAD: Carrilero Derecho" },
    { value: "CAI", label: "CAI: Carrilero Izquierdo" }
  ],
  "Mediocampo": [
    { value: "MCD", label: "MCD: Mediocentro Defensivo" },
    { value: "MC", label: "MC: Mediocentro" },
    { value: "MCO", label: "MCO: Mediocentro Ofensivo" },
    { value: "MD", label: "MD: Interior Derecho" },
    { value: "MI", label: "MI: Interior Izquierdo" }
  ],
  "Delantera": [
    { value: "ED", label: "ED: Extremo Derecho" },
    { value: "EI", label: "EI: Extremo Izquierdo" },
    { value: "SD", label: "SD: Segundo Delantero" },
    { value: "DC", label: "DC: Delantero Centro" }
  ]
};

export const POSICIONES_FUTSAL = [
  { value: "POR", label: "POR: Portero" },
  { value: "CIE", label: "CIE: Cierre" },
  { value: "ALA", label: "ALA: Ala" },
  { value: "PIV", label: "PIV: Pívot" }
];

export const COMPETICIONES_FUTBOL_ES = [
  "Primera Federación (1ª RFEF)",
  "Segunda Federación (2ª RFEF)",
  "Tercera Federación (3ª RFEF)",
  "División de Honor",
  "Preferente",
  "Elite",
  "Primera Regional",
  "Segunda Regional",
  "Tercera Regional"
];

export const CATEGORIAS_EDAD = [
  "Senior",
  "Juvenil",
  "Cadete",
  "Infantil",
  "Alevín",
  "Prebenjamín"
];
