import play, { SpotifyPlaylist, SpotifyTrack } from 'play-dl';

import { ResultAudioSearch, StreamInfo } from '@/sources/source-stream';

import { PlayDlSourceStream } from '../play-dl-source';
import { IStrategy } from './strategy';

export class SpotifyTrackStrategy implements IStrategy {
  constructor(private playDlSourceStream: PlayDlSourceStream) {}

  async getStreamInfo(url: string): Promise<StreamInfo[]> {
    const spotifyInfo = (await play.spotify(url.trim())) as SpotifyTrack;

    console.log({ spotifyInfo });

    const searched = (await this.playDlSourceStream.search(
      `${spotifyInfo.name} - ${spotifyInfo?.artists[0]?.name}`,
      {
        limit: 1,
      }
    )) as ResultAudioSearch;

    return [
      {
        title: spotifyInfo.name,
        url: searched.url,
        artist: spotifyInfo?.artists[0]?.name,
      },
    ];
  }
}

export class SpotifyPlaylistStrategy implements IStrategy {
  async getStreamInfo(url: string): Promise<StreamInfo[]> {
    const playlist = (await play.spotify(url.trim())) as SpotifyPlaylist;

    const tracks = await playlist.all_tracks();

    const spotifyTracks = tracks.map((track) => ({
      title: track.name,
      url: undefined,
      artist: String(track?.artists[0].name) ?? undefined,
    }));

    return spotifyTracks;
  }
}
