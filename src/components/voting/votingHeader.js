import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button } from 'react-toolbox/lib/button';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';
import Input from 'react-toolbox/lib/input';
import styles from './voting.css';
import disableStyle from './disableMenu.css';
import VoteDialog from '../voteDialog';

class VotingHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      query: '',
      searchIcon: 'search',
      votesList: [],
    };
  }

  search(name, value) {
    const icon = value.length > 0 ? 'close' : 'search';
    this.setState({
      query: value,
      searchIcon: icon,
    });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (value === this.state.query) {
        this.props.search(value);
      }
    }, 250);
  }

  clearSearch() {
    if (this.state.searchIcon === 'close') {
      this.search('query', '');
    }
  }

  confirmVoteText() {
    let info = 'VOTE';
    const { votes } = this.props;
    const votesList = Object.keys(votes);
    const voted = votesList.filter(item =>
      !votes[item].confirmed && votes[item].unconfirmed).length;
    const unvoted = votesList.filter(item =>
      votes[item].confirmed && !votes[item].unconfirmed).length;
    if (voted > 0 || unvoted > 0) {
      const seprator = (voted > 0 && unvoted > 0) ? ' / ' : ''; // eslint-disable-line
      const votedHtml = voted > 0 ? <span className={styles.voted}>+{voted}</span> : '';
      const unvotedHtml = unvoted > 0 ? <span className={styles.unvoted}>-{unvoted}</span> : '';
      info = <span>VOTE ({votedHtml}{seprator}{unvotedHtml})</span>;
    }
    return info;
  }

  render() {
    const { votes } = this.props;
    const votesList = Object.keys(votes);
    const theme = votesList.length === 0 ? disableStyle : styles;
    const button = <div className={styles.votesMenuButton}>
      <i className='material-icons'>visibility</i>
      <span>my votes ({votesList.length})</span>
    </div>;
    return (
      <header className={`${grid.row} ${grid['between-xs']} hasPaddingRow`}>
        <div className={`${grid['col-xs-3']} ${styles.searchBox}`}>
          <Input type='tel' label='Search' name='query'
            className='search'
            theme={styles}
            value={this.state.query}
            onChange={this.search.bind(this, 'query')}
          />
          <i id="searchIcon" className={`material-icons ${styles.searchIcon}`} onClick={ this.clearSearch.bind(this) }>
            {this.state.searchIcon}
          </i>
        </div>
        <div className={styles.actionBar}>
          <IconMenu theme={theme} icon={button} position='topLeft'
            iconRipple={false} className='my-votes-button'>
            {votesList.map(delegate =>
              <MenuItem
                theme={styles}
                key={delegate}
                caption={delegate}
                icon={(votes[delegate].confirmed === votes[delegate].unconfirmed) ? 'clear' : 'add'}
                onClick={this.props.voteToggled.bind(this, delegate)} />)}
          </IconMenu>
          <Button icon='done' flat
            className='vote-button'
            onClick={() => this.props.setActiveDialog({
              title: 'Vote for delegates',
              childComponent: VoteDialog,
            })}
            label={this.confirmVoteText()} />
        </div>
      </header>
    );
  }
}
export default VotingHeader;
