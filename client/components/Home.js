import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import directoryQuery from '../queries/directory';

class Home extends Component {
  renderHome() {
    const { loading, directory } = this.props.data;

    if (loading) {
      return null;
    }

    return (
      <table className="highlight responsive-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Stock</th>
            <th>Company</th>
            <th>Closing Price</th>
            <th>Date Listed</th>
            <th>Country</th>
          </tr>
        </thead>

        <tbody>
          {
            directory.map(({ RecordID, SymbolinINETSymbology, SecurityName, CompanyName, PreviousOfficialClosingPrice, FirstDateListed, CountryofIncorporation }) => {
              PreviousOfficialClosingPrice = parseInt(PreviousOfficialClosingPrice, 10).toFixed(2);

              return (
                <tr key={RecordID}>
                  <td>{SymbolinINETSymbology}</td>
                  <td>{SecurityName}</td>
                  <td>{CompanyName}</td>
                  <td>{PreviousOfficialClosingPrice}</td>
                  <td>{FirstDateListed}</td>
                  <td>{CountryofIncorporation}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div>
        {this.renderHome()}
      </div>
    );
  }
}

export default graphql(directoryQuery)(Home);
