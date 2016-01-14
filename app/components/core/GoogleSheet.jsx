var React          = require('react'),
    tabletop       = require('tabletop'),
    LensOvalButton = require('../ui/LensOvalButton.jsx'),
    url            = require('url');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: ""
    }
  },
  handleInputChange: function(e) {
    this.setState({
      value: e.target.value
    });
  },
  handleKeyDown: function (e) {
    if (e.keyCode == 13) {
      this.getGoogleSheetData(this.state.value);
    }
  },
  getGoogleSheetData: function(key) {
    tabletop.init({
      key: this.getKeyFromInput(key),
      callback: this.processData,
      simpleSheet: true,
      parseNumbers: true
    })
    this.props.saveCustomOption('value', key);
  },
  getKeyFromInput: function(key) {
    // Try to get from full url otherwise try to use the key as is
    // typical format https://docs.google.com/spreadsheets/d/2WbmbAW5Gruj_anSgweXOKEO0H6iNF2M0NTimom_jRh8/edit#gid=0 
    // return what's between /d/ and /edit/.*
    return url.parse(key).path.match(/(\/d\/)(.*)(\/)/)[2] || key;
  },
  processData: function(data) {
    //Transform into array of arrays
    var columns         = [],
        transformedData = [],
        x               = 0;

    for(x = 0; x < data.length; x++) {
      var tempColumnData = [],
          column         = null;

      for (column in data[x]) {
        if(columns.indexOf(column) == -1){
          columns.push(column);
        }
        tempColumnData.push(data[x][column]);
      }
      transformedData.push(tempColumnData);
    }
    columns = columns.map(function(column){
      return [typeof data[0][column], column];
    });
    // At the end of processing data always call updateTransformFunction with a
    // closure that update columns and returns the transformed data
    this.props.updateTransformFunction(this.transformData(columns, transformedData));
  },
  transformData: function(columns, data) {
    // Make any updates to columns here and pass on data transform function
    // Use a closure to transfer data
    // What happens if this is a very large set of data
    this.props.updateDataSchema(columns);
    return function() {
      return data;
    }
  },
  componentDidMount: function() {
    if(Object.keys(this.props.customOptions) !== 0) {
      this.setState( this.props.customOptions)
    }
  },
  render: function() {
    // Styling for non UI components is inline
    var inputStyle = {
      border:'none',
      background:'transparent',
      outline:'none',
      display:'inline-block',
      height:'35px',
      width:'250px',
      verticalAlign:'top',
      borderBottom:'1px solid #E1E1E1'
    };
    return (
      <div className='google-sheet'>
        Enter the ID of a published Google Spreadsheet
        <div>
        </div>
        <div style={{margin:20}}>
          <input className='google-sheet'
            type='text'
            value={this.state.value}
            placeholder="ENTER SHEET URL"
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            style={inputStyle}
          />
          <LensOvalButton key='submit-new-component'
            margin='0px 0px 0px 10px'
            action={this.getGoogleSheetData}
            actionPayload={this.state.value}
            content='GET DATA' />
        </div>
        <div><a href='#'>Need Help?</a></div>
      </div>
    )
  }
});

