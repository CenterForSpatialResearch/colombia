

L.VectorGrid.Slicer = L.VectorGrid.extend({

	options: {
		vectorTileLayerName: 'sliced',
		extent: 4096,	// Default for geojson-vt
		maxZoom: 14  	// Default for geojson-vt
	},

	initialize: function(geojson, options) {
		L.VectorGrid.prototype.initialize.call(this, options);

		// Slice the geojson/topojson via a web worker
		var workerCode = `
			include('geojson-vt-dev.js')
			include('topojson.js')

			var slicers = {};
			var options;

			onmessage = function (e) {
				if (e.data[0] === 'slice') {
					// Given a blob of GeoJSON and some topojson/geojson-vt options, do the slicing.
					var geojson = e.data[1];
					options     = e.data[2];

					if (geojson.type && geojson.type === 'Topology') {
						for (var layerName in geojson.objects) {
							slicers[layerName] = self.geojsonvt(
								self.topojson.feature(geojson, geojson.objects[layerName])
							, options);
						}
					} else {
						slicers[options.vectorTileLayerName] = self.geojsonvt(geojson, options);
					}

				} else if (e.data[0] === 'get') {
					// Gets the vector tile for the given coordinates, sends it back as a message
					var coords = e.data[1];

					var tileLayers = {};
					for (var layerName in slicers) {
						var slicedTileLayer = slicers[layerName].getTile(coords.z, coords.x, coords.y);

						if (slicedTileLayer) {
							var vectorTileLayer = {
								features: [],
								extent: options.extent,
								name: options.vectorTileLayerName,
								length: slicedTileLayer.features.length
							}

							for (var i in slicedTileLayer.features) {
								var feat = {
									geometry: slicedTileLayer.features[i].geometry,
									properties: slicedTileLayer.features[i].tags,
									type: slicedTileLayer.features[i].type	// 1 = point, 2 = line, 3 = polygon
								}
								vectorTileLayer.features.push(feat);
							}
							tileLayers[layerName] = vectorTileLayer;
						}
					}
					postMessage({ layers: tileLayers, coords: coords });
				}
			}
		`;

		// Create a shallow copy of this.options, excluding things that might
		// be functions - we only care about topojson/geojsonvt options
		var options = {};
		for (var i in this.options) {
			if (i !== 'rendererFactory' &&
				i !== 'vectorTileLayerStyles' &&
				typeof (this.options[i] !== 'function')
			) {
				options[i] = this.options[i];
			}
		}

		this._worker = new Worker(window.URL.createObjectURL(new Blob([workerCode])));

		// Send initial data to worker.
		this._worker.postMessage(['slice', geojson, options]);

	},


	_getVectorTilePromise: function(coords) {

		var _this = this;

		var p = new Promise( function waitForWorker(res) {
			_this._worker.addEventListener('message', function recv(m) {
				if (m.data.coords &&
				    m.data.coords.x === coords.x &&
				    m.data.coords.y === coords.y &&
				    m.data.coords.z === coords.z ) {

					res(m.data);
					_this._worker.removeEventListener('message', recv);
				}
			});
		});

		this._worker.postMessage(['get', coords]);

		return p;
	},

});


L.vectorGrid.slicer = function (geojson, options) {
	return new L.VectorGrid.Slicer(geojson, options);
};

