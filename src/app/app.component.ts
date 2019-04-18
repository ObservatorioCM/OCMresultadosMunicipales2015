import { Component, OnInit } from '@angular/core';
import {
  map,
  Map,
  Control,
  tileLayer,
  ControlOptions,
  DomUtil,
  GeoJSON,
  geoJSON,
  Browser
} from 'leaflet';
import Swal from 'sweetalert2';

// import {setMouseDelay, getScreenSize, moveMouse} from 'robotjs';

import distritos from '../assets/data/distritosGanadores.json';
import gradesPartidos from '../assets/data/gradesPartidos.json';
import { GeoJsonObject } from 'geojson';

interface Partido {
  name: string;
  icon: string;
}

@Component({
  selector: 'ocm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  map: Map;
  geoJson: GeoJSON;
  legend: Control;
  TablaDatos: Control;
  TablaDatosDiv: HTMLDivElement;
  feature: object;

  selectedPartido = '';
  partidos: Partido[] = [
    { name: 'PP', icon: '../assets/icons-/IcoPP.png' },
    { name: 'PSOE', icon: '../assets/icons-/IcoPSOE.png' },
    { name: 'GANEMOS', icon: '../assets/icons-/IcoGanemos.png' },
    { name: 'CIUDADANOS', icon: '../assets/icons-/IcoCiudadanos.png' },
    { name: 'IU', icon: '../assets/icons-/IcoIU.png' },
    { name: 'PA', icon: '../assets/icons-/IcoPA.png' },
    { name: 'UPyD', icon: '../assets/icons-/IcoUPyD.png' },
    { name: 'IPJ', icon: '../assets/icons-/IcoIPJ.png' },
    { name: 'FCJ', icon: '../assets/icons-/IcoForoCiudadanoJerez.png' },
    { name: 'PCPE', icon: '../assets/icons-/IcoPCPE.png' },
    { name: 'Abstención', icon: '../assets/icons-/IcoAbstencion.png' },
    { name: 'Primero', icon: '../assets/icons-/Primero.png' },
    { name: 'Gráfico', icon: '../assets/icons-/IcoGrafico.png' },
    { name: 'Ayuda', icon: '../assets/icons-/ayuda2.png' }
  ];

  // Configuración del mapa base.
  tileLayerConfig = {
    maxZoom: 17,
    minZoom: 10,
    attribution:
      'Map data &copy; <a href="http://openstreetmap.org"> OpenStreetMap</a> Contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.light'
  };

  // Configuración Card donde se muestra el logo.
  logoControlConfig: ControlOptions & { opacity: number } = {
    position: 'topleft',
    opacity: 0.1
  };

  // constructor() {
  //  }

  ngOnInit() {
    // Inhabilita botón derecho del ratón.
    window.oncontextmenu = () => {
      Swal.fire({
        title: 'Click derecho deshabilitado.',
        animation: true,
        customClass: 'animated'
      });
      return false;
    };

    this.map = map('map', {
      center: [36.686881, -6.142603],
      zoomControl: false,
      zoom: 14,
      maxBounds: [
        // Esquina superior izquierda hasta donde permitira mover.
        [36.534027, -6.332731],
        // Esquina inferior derecha.
        [36.819779, -5.40752]
      ]
    });

    new Control.Zoom(
      { position: 'topright' }
      ).addTo(this.map);

    tileLayer(
      'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      this.tileLayerConfig
    ).addTo(this.map);

    // Card logoOCM
    const logoOCM = new Control(this.logoControlConfig);
    logoOCM.onAdd = () => {
      const div = DomUtil.create('div', 'info');
      div.innerHTML +=
        '<img src="assets/icons-/LogoOCM+.png" alt="Logo OCM" class="rounded mx-auto d-block" height="50" width="150">';
      return div;
    };
    logoOCM.addTo(this.map);

    // Muestra la ayuda al iniciar la pagina.
    Swal.fire({
      imageUrl: 'assets/ayuda/Ayuda.png',
      imageWidth: 400,
      imageHeight: 400,
      imageAlt: 'Ayuda',
      animation: true
    });
  }

  // Que hacer cuando se pulsa cada botón del menu.
  onClickPartido(partido: string) {
    this.selectedPartido = partido;

    if (this.geoJson) {
      this.geoJson.remove();
    }

    if (this.legend) {
      this.legend.remove();
    }

    if (this.TablaDatosDiv) {
      this.TablaDatosDiv.remove();
    }

    // Card TablaDatos.
    this.TablaDatos = new Control();
    this.TablaDatos.onAdd = () => {
      this.TablaDatosDiv = DomUtil.create('div', 'info') as HTMLDivElement;
      // this.updateTablaDatos();
      return this.TablaDatosDiv;
    };
    this.TablaDatos.addTo(this.map);

    switch (this.selectedPartido) {
      case 'Primero':
        // Poligonos desde el fichero geojson.
        this.geoJson = geoJSON(distritos as GeoJsonObject, {
          style: this.style2(),
          onEachFeature: this.onEachFeature
        }).addTo(this.map);

        // Card Intervalos partido ganador.
        this.legend = new Control({ position: 'bottomright' });
        this.legend.onAdd = () => {
          const div = DomUtil.create('div', 'info legend');
          div.innerHTML +=
            '<i class="intervals-icons" style="background:blue;"></i> PP<br><br>' +
            '<i class="intervals-icons" style="background:red;"></i> PSOE<br><br>' +
            '<i class="intervals-icons" style="background:green;"></i> Ganemos<br>';
          return div;
        };
        this.legend.addTo(this.map);
        break;

      case 'Gráfico':
      Swal.fire({
        imageUrl: 'assets/icons-/Grafico.png',
        imageWidth: 800,
        imageHeight: 500,
        imageAlt: 'Ayuda',
        animation: true
      });
      break;

      case 'Ayuda':
      Swal.fire({
        // title: 'Ayuda',
        // text: 'Modal with a custom image.',
        imageUrl: 'assets/ayuda/Ayuda.png',
        imageWidth: 400,
        imageHeight: 400,
        imageAlt: 'Ayuda',
        animation: true
      });
      break;

      default:
    // Poligonos desde el fichero geojson.
    this.geoJson = geoJSON(distritos as GeoJsonObject, {
          style: this.style(partido),
          onEachFeature: this.onEachFeature
        }).addTo(this.map);



    // Card Intervalos.
    this.legend = new Control({ position: 'bottomright' });
    this.legend.onAdd = () => {
          const div = DomUtil.create('div', 'info legend');
          const grades = gradesPartidos[partido];
          for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
              '<i class="intervals-icons" style="background:' +
              this.getColor(gradesPartidos[partido])(grades[i] + 1) +
              '"></i> ' +
              grades[i] +
              (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          }
          return div;
        };
    this.legend.addTo(this.map);
    }
  }

  style(partido) {
      return feature => ({
      fillColor: this.getColor(gradesPartidos[partido])(
        feature.properties[partido]
      ),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.6
    });
  }

  style2() {
    return feature => ({
      fillColor:  this.getColor2(feature.properties['PartidoGanador']),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.6
    });
    }

  getColor(gradesPartido) {
    return d => {
      return d > gradesPartido[10]
        ? '#71292b'
        : d > gradesPartido[9]
        ? '#832e31'
        : d > gradesPartido[8]
        ? '#953437'
        : d > gradesPartido[7]
        ? '#a6393d'
        : d > gradesPartido[6]
        ? '#b83f42'
        : d > gradesPartido[5]
        ? '#c24c4f'
        : d > gradesPartido[4]
        ? '#c95c60'
        : d > gradesPartido[3]
        ? '#cf6d70'
        : d > gradesPartido[2]
        ? '#d57e81'
        : d > gradesPartido[1]
        ? '#db9092'
        : '#e1a1a3';
    };
  }

  getColor2(PartidoGanador) {
    if (PartidoGanador === 'PP') {
      const d = 'blue';
      return d;
    } else if (PartidoGanador === 'PSOE') {
      const d = 'red';
      return d;
    } else if (PartidoGanador === 'Ganemos') {
      const d = 'green';
      return d;
    }
  }

  onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
      click: this.zoomToFeature
    });
  }

  highlightFeature = e => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.5
    });

    if (!Browser.ie && !Browser.edge) {
      layer.bringToFront();
    }

    this.updateTablaDatos(layer.feature.properties);
    // console.log(layer.feature.properties);
    this.sortTable();
   }

  resetHighlight = e => {
    this.geoJson.resetStyle(e.target);
  }

  zoomToFeature = e => {
    this.map.fitBounds(e.target.getBounds());
    // this.mueveRaton();
  }

  sortTable() {
    let table;
    let rows;
    let switching;
    let i;
    let x;
    let y;
    let shouldSwitch;

    table = document.getElementById('idTablaDatos');
    // console.log(typeof document.getElementById('idTablaDatos'));
    switching = true;
    while (switching) {                                        // Make a loop that will continue until no switching has been done:
      switching = false;                                       // start by saying: no switching is done:
      rows = table.rows;
      // tslint:disable-next-line:max-line-length
      for (i = 1; i < (rows.length - 1); i++) {               // Loop through all table rows (except the first, which contains table headers):
        shouldSwitch = false;                                 // start by saying there should be no switching:
        // tslint:disable-next-line:max-line-length
        x = rows[i].getElementsByTagName('td')[1];            // Get the two elements you want to compare, one from current row and one from the next:
        y = rows[i + 1].getElementsByTagName('td')[1];
        if (rows[i].getElementsByTagName('td')[0].innerHTML ===  this.selectedPartido + ':') {
          rows[i].getElementsByTagName('td')[0].style.fontWeight = 'bold';
          rows[i].getElementsByTagName('td')[1].style.fontWeight = 'bold';
          rows[i].getElementsByTagName('td')[0].style.color = 'red';
          rows[i].getElementsByTagName('td')[1].style.color = 'red';
        }

        if (Number(x.innerHTML) < Number(y.innerHTML)) {       // check if the two rows should switch place:
          shouldSwitch = true;                                 // if so, mark as a switch and break the loop:
          break;
        }
      }
      if (shouldSwitch) {
        // tslint:disable-next-line:max-line-length
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]); // If a switch has been marked, make the switch and mark that a switch has been done:
        switching = true;
      }
    }
    if (table.rows[table.rows.length - 1].getElementsByTagName('td')[0].innerHTML ===  this.selectedPartido + ':') {
      table.rows[table.rows.length - 1].getElementsByTagName('td')[0].style.fontWeight = 'bold';
      table.rows[table.rows.length - 1].getElementsByTagName('td')[1].style.fontWeight = 'bold';
      table.rows[table.rows.length - 1].getElementsByTagName('td')[0].style.color = 'red';
      table.rows[table.rows.length - 1].getElementsByTagName('td')[1].style.color = 'red';
    }
  }

   // Si tiene datos usa lo indicado despues de ?, si no tiene datos usa lo que hay despues de : en este caso ''
   updateTablaDatos(props?) {
    this.TablaDatosDiv.style.visibility = 'visible';
    this.TablaDatosDiv.innerHTML =
      '<h5 style="margin-block-start: 0px; margin-block-end: 0px;"><b><center>DATOS.</center></b></h5>' +
      (props
        ? '<h5 style="margin-block-start: 0px; margin-block-end: 0px;"><center><b>' + props.ID + '</center></b></h56>' +
          `<table id="idTablaDatos" >
            <tr>
              <td>Censados:</td>
              <td id="numero" align="right">${props.censados}</td>
            </tr>
            <tr>
              <td>Abstención:</td>
              <td  id="numero" align="right">${props.Abstencion}</td>
            </tr>
            <tr>
              <td>PP:</td>
              <td  id="numero" align="right">${props.PP}</td>
            </tr>
            <tr>
              <td>PSOE:</td>
              <td  id="numero" align="right">${props.PSOE}</td>
            </tr>
            <tr>
              <td>GANEMOS:</td>
              <td  id="numero" align="right">${props.GANEMOS}</td>
            </tr>
            <tr>
              <td>CIUDADANOS:</td>
              <td  id="numero" align="right">${props.CIUDADANOS}</td>
            </tr>
            <tr>
              <td>IU:</td>
              <td  id="numero" align="right">${props.IU}</td>
            </tr>
            <tr>
              <td>FCJ:</td>
              <td  id="numero" align="right">${props.FCJ}</td>
            </tr>
            <tr>
              <td>PA:</td>
              <td  id="numero" align="right">${props.PA}</td>
            </tr>
            <tr>
              <td>UPyD:</td>
              <td  id="numero" align="right">${props.UPyD}</td>
            </tr>
            <tr>
              <td>IPJ:</td>
              <td  id="numero" align="right">${props.IPJ}</td>
            </tr>
            <tr>
              <td>PCPE:</td>
              <td  id="numero" align="right">${props.PCPE}</td>
            </tr>
          </table>`
        : '');
  }


  // mueveRaton(){
  //   setMouseDelay(2);

  //   var twoPI = Math.PI * 2.0;
  //   var screenSize = getScreenSize();
  //   var height = (screenSize.height / 2) - 10;
  //   var width = screenSize.width;

  //   for (var x = 0; x < width; x++)
  //   {
  //       let y = height * Math.sin((twoPI * x) / width) + height;
  //       moveMouse(x, y);
  //   }
  // }

}
