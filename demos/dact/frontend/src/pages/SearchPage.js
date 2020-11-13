// External
import React, { Component } from 'react';
import { Grid, Image } from 'semantic-ui-react';
import AnalystBox from 'analystbox';

// Redux
import { connect } from 'react-redux';
import actions from '../redux/actions';

// Internal
import DataTable from '../components/DataTable';
import images from '../utils/images';

// SearchPage
class SearchPage extends Component {
  async componentDidMount() {
    document.addEventListener('keydown', (event) => this.handleKeyDown(event, true));
  }

  componentWillUnmount() {
    document.addEventListener('keydown', (event) => this.handleKeyDown(event, true));
  }

  /*
   * Page Helpers
   */
  redirectToHome = () => {
    this.props.history.push('/');
  };

  /*
   * KeyDown Helpers
   */
  enableKeyDown = () => {
    this.props.actions.setCanKeyDown(true);
  };

  disableKeyDown = () => {
    this.props.actions.setCanKeyDown(false);
  };

  handleKeyDown = (event, global = false) => {
    if (!this.props.canKeyDown) {
      return;
    }

    if (global && event.keyCode === 38) {
      this.disableKeyDown();
      this.redirectToHome();
      this.enableKeyDown();
    } else if (!global && event.keyCode === 13) {
      this.disableKeyDown();
      this.redirectToHome();
      this.enableKeyDown();
    }
  };

  /*
   * AnalystBox Helpers
   */
  onQuestionSelect = ({ questionIndex }) => {
    this.props.actions.shared.onQuestionSelect(questionIndex);
  };

  /*
   * Render
   */
  render() {
    const { innerWidth, innerHeight } = window;

    return (
      <Grid>
        <div style={{ height: '20px' }} />

        <Grid.Row verticalAlign="middle">
          <Grid.Column width={2} style={{ minWidth: '150px' }}>
            <div
              style={{ minWidth: '100px' }}
              role="button"
              tabIndex={0}
              onClick={this.redirectToHome}
              onKeyDown={this.handleKeyDown}
            >
              <Image src={images.logo} centered style={{ height: '25px' }} />
            </div>
          </Grid.Column>
          <Grid.Column width={7} style={{ marginLeft: '-20px', minWidth: '400px' }}>
            <AnalystBox
              base={{
                onFocus: this.disableKeyDown,
                onBlur: this.enableKeyDown,
              }}
              questions={this.props.questions}
              keywords={this.props.keywords}
              onQuestionSelect={this.onQuestionSelect}
              searchOptions={{
                engines: { triePrefixSearch: { shouldCache: false }, linearSubstringSearch: {} },
              }}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row centered>
          <DataTable height={innerHeight - 150} width={innerWidth - 100} />
        </Grid.Row>
      </Grid>
    );
  }
}

// Redux
const mapStateToProps = (state) => ({ ...state.pages, ...state.shared });
const mapDispatchToProps = (dispatch) => actions(dispatch, 'pages');

// Export
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
