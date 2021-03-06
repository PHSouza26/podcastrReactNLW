// SPA <-- Single Page Application
// SSR <-- Server-Side Rendering
// SSG <-- Static Site Generation

import { useContext, useEffect } from "react"
import { GetStaticProps } from "next"
import { api } from "../services/api";
import { format, parseISO } from 'date-fns';
import en from 'date-fns/locale/en-US';
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from './home.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { PlayerContextProvider, PlayerContext } from "../contexts/PlayerContext";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  description: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;

}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = useContext(PlayerContext);

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Latest Episodes</h2>

        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li style={{ width: 588 }} key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover" />

                <div className={styles.episodeDetails}>
                  <Link href={`/episode/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src='/play-green.svg' alt='tocarEpisodio' />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>All Episodes</h2>

        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Members</th>
            <th>Data</th>
            <th>Duration</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 120 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit='cover'
                    />
                  </td>
                  <td>
                    <Link href={`/episode/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 120 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type='button' onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                      <img src='/play-green.svg' alt='tocaep'></img>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: en }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8
  }
}