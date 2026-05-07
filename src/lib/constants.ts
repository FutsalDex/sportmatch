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
