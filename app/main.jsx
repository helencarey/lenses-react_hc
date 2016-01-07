var React = require('react');
var ReactDOM = require('react-dom');
var LensComposer = require('./components/LensComposer.jsx');
var lensComponentModel = require('./models/lensComponentModel.js');
var $ = require('jquery');

var loadInitialComponents = function(cb) {
  var initialComponents = [];
  $.get('/api/components?type=custom', null, function(data) {
    initialComponents = data.map(function(cmp) {
      return new lensComponentModel(cmp.name, cmp.type);
    });
  cb(initialComponents);
  });
};
//Main render function to attach React component to the dom

ReactDOM.render(<LensComposer loadInitialComponents={loadInitialComponents} />, app);

