import styled from 'styled-components';

const AlbumArtLoading = styled.div`
  width: 100%;
  min-height: 500px;
  max-width: 500px;
  border-radius: 10px;
  background: grey;
`;

const SongTitleLoading = styled.span`
  display: block;
  font-size: 18px;
  font-weight: 300;
  opacity: 0.2;
`;

const Loading = () => (
  <div>
    <SongTitleLoading>Lorem Ipsum</SongTitleLoading>
    <AlbumArtLoading />
  </div>
);

export default Loading;
