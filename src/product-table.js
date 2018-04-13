import React from 'react';
import './ProductTable.css';

// function getStocksData() {
//     return
//         fetch('http://localhost:3004/items/')
//         .then((response) => response.json())
//         .then((responseJSON) => {
//             console.info(responseJSON);
//             return responseJSON;
//         })
//         .catch((error) => {
//             console.error(error);
//         });
// }

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleInStockChange = this.handleInStockChange.bind(this);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    }

    handleFilterTextChange(e) {
        this.props.onFilterTextChange(e.target.value);
    }

    handleInStockChange(e) {
        this.props.onInStockChange(e.target.checked);
    }

    render() {
        return (
            <form className="SearchBarForm">
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterText}
                    onChange={this.handleFilterTextChange} />
                <p>
                    <label>
                        <input
                            type="checkbox"
                            checked={this.props.inStockOnly}
                            onChange={this.handleInStockChange} />
                        {' '}
                        Only show products in stock
                    </label>
                </p>
            </form>
        )
    }
}

class ProductCategoryRow extends React.Component {
    render() {
        const category = this.props.category;

        return (
            <tr className="ProductCategoryRow">
                <th colSpan="2">{category}</th>
            </tr>
        )
    }
}

class ProductRow extends React.Component {
    render() {
        const item = this.props.item;
        const spanStyle = {
            color: 'red',
        };
        const name = item.stocked ?
            item.name :
            <span style={spanStyle}>
                {item.name}
            </span>;
        const price = item.stocked ? item.name :
            <span style={spanStyle}>{item.price}</span>

        return (
            <tr className="ProductRow">
                <td>{name}</td>
                <td>{price}</td>
            </tr>
        )
    }
}

class ProductTable extends React.Component {
    render() {
        const rows = [];
        let lastCategory = null;
        const filterText = this.props.filterText;
        const inStockOnly = this.props.inStockOnly;

        this.props.items.forEach((product) => {

            // if product name doesn't match with filterText then return
            if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
                return;
            }

            // if product is not in stock and inStockOnly is enabled
            if (inStockOnly && !product.stocked) {
                return;
            }

            if (product.category !== lastCategory) {
                rows.push(
                    <ProductCategoryRow
                        category={product.category}
                        key={product.category}
                    />
                );
            }
            rows.push(
                <ProductRow
                    item={product}
                    key={product.name}
                />
            );

            lastCategory = product.category;
        });

        const hStyle = {
            // padding: '10px 0px',
            border: '2px blue solid'
        };

        const tStyle = {
            borderCollapse: 'collapse',
            borderSpacing: 0,
            border: '4px red dashed'
        }

        return (
            <table style={tStyle}>
                <thead>
                    <tr>
                        <th style={hStyle}>Name</th>
                        <th style={hStyle}>Price</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        )
    }
}

export default class FilterableProductTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoading: false,
            error: null,
            filterText: '',
            inStockOnly: false
        };

        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleInStockChange = this.handleInStockChange.bind(this);
    }

    handleFilterTextChange(filterText) {
        this.setState({filterText: filterText});
    }

    handleInStockChange(inStockOnly) {
        this.setState({inStockOnly: inStockOnly});
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch('http://localhost:3004/items/')
        .then((response) => response.json())
        .then((responseJSON) => { this.setState({isLoading: false, items: responseJSON}) })
        .catch((error) => { this.setState({error, isLoading: false}) });
    }

    render() {
        const isLoading = this.state.isLoading,
            error = this.state.error;

        if(error) {
            return <p>{error}</p>
        }

        if (isLoading) {
            return <p>Loading...</p>
        }

        return (
            <section>
                <SearchBar
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onInStockChange={this.handleInStockChange}
                    onFilterTextChange={this.handleFilterTextChange} />
                <ProductTable
                    items={this.state.items}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly} />
            </section>
        );
    }
}
