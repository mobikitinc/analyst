// External
import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

// Redux
import { connect } from 'react-redux';
import actions from './redux/actions';

// Internal
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';

// App
class App extends Component {
  async componentDidMount() {
    await this.props.actions.shared.getQsts();
    await this.props.actions.shared.getKeywords();
    await this.props.actions.table.getData();
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" render={(routeProps) => <HomePage {...routeProps} />} />
          <Route exact path="/search" render={(routeProps) => <SearchPage {...routeProps} />} />
        </Switch>
      </Router>
    );
  }
}

// Redux
const mapStateToProps = (state) => ({ ...state });
const mapDispatchToProps = (dispatch) => actions(dispatch);

// Export
export default connect(mapStateToProps, mapDispatchToProps)(App);
