const fs = require('fs');

let distritos = fs.readFileSync('./distritosCompuestos.json');
let ganadores = fs.readFileSync('./SeccionesCensales+PartidoGanador.json');

distritos = JSON.parse(distritos);
ganadores = JSON.parse(ganadores);

distritos.features = distritos.features.map((feat) => {
  const res = ganadores.features.find((featGanador) => featGanador.properties.ID === feat.properties.ID);

  if (!res) {
      return feat;
  }

  feat.properties.PartidoGanador = res.properties.PartidoGanador;

  return feat;
});

fs.writeFileSync('./distritosGanadores.json', JSON.stringify(distritos, null, 2));
