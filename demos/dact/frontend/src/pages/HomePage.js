// External
import React, { Component } from 'react';
import { Grid, Icon, Image } from 'semantic-ui-react';
import AnalystBox from '@mobikitinc/analystbox';

// Redux
import { connect } from 'react-redux';
import actions from '../redux/actions';

// Internal
import colors from '../utils/colors';
import images from '../utils/images';

// HomePage
class HomePage extends Component {
  componentDidMount() {
    document.addEventListener('scroll', this.handleScroll);
    document.addEventListener('keydown', (event) => this.handleKeyDown(event, true));
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('keydown', (event) => this.handleKeyDown(event, true));
  }

  /*
   * Page Helpers
   */
  redirectToSearch = () => {
    this.props.history.push('search');
  };

  /*
   * Scroll Helpers
   */
  handleScroll = () => {
    const element = document.getElementById('bottom');
    if (element.getBoundingClientRect().bottom <= window.innerHeight) {
      this.redirectToSearch();
    }
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

    if (global && event.keyCode === 40) {
      this.disableKeyDown();
      this.redirectToSearch();
      this.enableKeyDown();
    } else if (!global && event.keyCode === 13) {
      this.disableKeyDown();
      this.redirectToSearch();
      this.enableKeyDown();
    }
  };

  /*
   * AnalystBox Helpers
   */
  onQuestionSelect = ({ questionIndex }) => {
    this.props.actions.shared.onQuestionSelect(questionIndex);
    this.redirectToSearch();
  };

  /*
   * Render
   */
  render() {
    return (
      <Grid centered>
        <div style={{ height: '200px' }} />

        <Grid.Row style={{ marginBottom: '20px' }}>
          <Image src={images.logo} centered style={{ height: '70px' }} />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={7} style={{ minWidth: '400px' }}>
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

        <div id="bottom" style={{ height: '500px' }} />

        <Grid.Row
          centered
          style={{
            position: 'fixed',
            left: '0px',
            bottom: '0px',
            width: '100%',
          }}
        >
          <div
            role="button"
            tabIndex={0}
            onClick={this.redirectToSearch}
            onKeyDown={this.handleKeyDown}
          >
            <Icon name="angle down" size="huge" style={{ color: colors.gray }} />
          </div>
        </Grid.Row>
      </Grid>
    );
  }
}

// Redux
const mapStateToProps = (state) => ({ ...state.pages, ...state.shared });
const mapDispatchToProps = (dispatch) => actions(dispatch, 'pages');

// Export
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
