import Link from 'next/link';
import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Player from '../components/Player';
import { getHashParams } from '../lib/getHash';
import { readCookie } from '../lib/readCookie';

const spotifyApi = new SpotifyWebApi();

const removeHash = () => {
  history.pushState('', document.title, window.location.pathname
    + window.location.search);
};

class home extends Component {
  static async getInitialProps({ query }) {
    return { token: query.token };
  }

  state = {
    nowPlaying: '',
    loggedIn: false,
  }

  componentDidMount() {
    const { token } = this.props;
    if (token) {
      spotifyApi.setAccessToken(token);
      removeHash();
      this.getNowPlaying();
      setInterval(() => this.getNowPlaying(), 15000);
      this.setState({
        loggedIn: true,
      });
    }
  }

  getNowPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            albumArt: response.item.album.images[0].url,
          },
        });
      });
  };


  render() {
    const { loggedIn, nowPlaying } = this.state;

    return (
      <>
        <Player nowPlaying={nowPlaying} />
        {!loggedIn ? <div style={{ display: 'block' }}><Link href="/login"><a>Log in</a></Link></div> : null}
      </>
    );
  }
}

export default home;
