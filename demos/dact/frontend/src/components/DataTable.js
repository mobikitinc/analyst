// External
import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

// Redux
import { connect } from 'react-redux';
import actions from '../redux/actions';

// DataTable
class DataTable extends Component {
  constructor(props) {
    super(props);

    this.gridApi = null;
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  render() {
    const {
      height, width, isLoading, rows, columns, sqls, qstIndex,
    } = this.props;

    if (this.gridApi) {
      if (isLoading) {
        this.gridApi.showLoadingOverlay();
      } else if (rows.length === 0) {
        this.gridApi.showNoRowsOverlay();
      } else {
        this.gridApi.hideOverlay();
      }
    }

    return (
      <div className="ag-theme-balham" style={{ height, width }}>
        <AgGridReact
          columnDefs={[
            {
              headerName: sqls[qstIndex],
              children: columns,
            },
          ]}
          rowData={rows}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          onGridReady={this.onGridReady}
        />
      </div>
    );
  }
}

// Redux
const mapStateToProps = (state) => ({ ...state.table, ...state.shared });
const mapDispatchToProps = (dispatch) => actions(dispatch, 'table');

// Export
export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
