import React from 'react';
import ReactDOM from 'react-dom';
import FilterableProductTable from './product-table.js';

class App extends React.Component {
    render() {
        return (
            <FilterableProductTable />
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
