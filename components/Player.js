import styled from 'styled-components';

const AlbumArtWrapper = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 10px;
  background: none;

  @media (min-width: 510px) {
    background: #ececec;
    width: 500px;
  }

`;

const AlbumArt = styled.img`
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
`;

const SongTitleLoading = styled.span`
  opacity: 0.4;
`;

const SongTitle = styled.span`
  display: block;
  font-size: 18px;
  font-weight: 300;
`;

const Player = ({ nowPlaying }) => (
  <div>
    <SongTitle>{nowPlaying ? nowPlaying.name : <SongTitleLoading>Song Title</SongTitleLoading>}</SongTitle>
    <AlbumArtWrapper><AlbumArt src={nowPlaying.albumArt} /></AlbumArtWrapper>

  </div>
);

export default Player;
