import React from 'react';
import Select from 'react-select';

const options = [
    { value: 'bronx', label: 'BRONX' },
    { value: 'brooklyn', label: 'BROOKLYN' },
    { value: 'queens', label: 'QUEENS' }
  ]
class motor extends React.Component{
    state = {
        selectedOption: null,
        borough: []
      };
      handleChange = (selectedOption) => {
        this.setState({ selectedOption, }, () =>
          console.log(`Option selected:`, this.state.selectedOption.label)

        );
      };

currentBorough = (event) =>{
  let url;
if((this.state.selectedOption === null))
{
   url = `https://data.cityofnewyork.us/resource/h9gi-nx95.json`;
}
else{
   url = `https://data.cityofnewyork.us/resource/h9gi-nx95.json?borough=${this.state.selectedOption.label}`;  
}

console.log(typeof(this.state.selectedOption))
let options = {
  method: 'GET',
  query: {borough: 'BROOKLYN'},
  headers: {'X-App-Token': 'xpFnBGBIZmWJ2mf0v43C7muyB'}
};

fetch(url, options)
  .then(res => res.json())
  .then(json => {
    this.setState({borough: json})
    console.log(this.state.borough)})
  .catch(err => console.error('error:' + err));
}
      render() {
        const { selectedOption } = this.state;
    
        return (
            <div>
          <Select
            value={selectedOption}
            onChange={this.handleChange}
            options={options}
          />
          <button className="btn btn-primary" onClick={this.currentBorough}>Enter</button>
          {/* <div>{this.state.borough.map(info => info.[199].borough}</div> */}
          </div>
    );
}
}
export default motor;