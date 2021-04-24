import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import Link from 'next/Link';
import Image from 'next/image';
import { Api } from '../api/axios';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from '../styles/home.module.scss';
import { usePlayer } from '../contexts/player-context';
import Head from 'next/head';
type Episode = {
  id: string,
  title: string,
  members: string,
  publishedAt: string,
  published_at: string,
  thumbnail: string,
  description: string,
  durationTimeString: string,
  duration: number,
  url: string
}
type HomeProps = {
  LatestEpisodes: Episode[],
  AllEpisodes: Episode[]
} 

export default function Home({LatestEpisodes, AllEpisodes}: HomeProps) {
  const { playList } = usePlayer();
  const episodeList = [...LatestEpisodes, ...AllEpisodes];
  return (
    <div className={styles.HomePage}>
      <Head>
        <title>
          HomePage
        </title>
      </Head>
      <section className={styles.LatestEpisodes}>
        <h2>
          Últimos lançamentos
        </h2>
        <ul>
          {LatestEpisodes.map((episode, index) =>{
            return(
              <li key={episode.id}>
                <div className={styles.imageDiv}>
                  <Image 
                    width={192} 
                    height={192} 
                    src={episode.thumbnail} 
                    alt={episode.title} 
                    objectFit="cover"
                  />
                </div>
                <div className={styles.episodeDetails} >
                  <Link href={`/episode/${episode.id}`}>
                    <a>
                      {episode.title}
                    </a>
                  </Link>
                  <p>
                    {episode.members}
                  </p>
                  <span>
                    {episode.publishedAt}
                  </span>
                  <span>
                    {episode.durationTimeString}
                  </span>
                </div>
                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Play" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.AllEpisodes}>
        <h2>
          Todos os episódios
        </h2>
        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {AllEpisodes.map((episode: Episode, index) => {
              return(
                <tr key={episode.id}>
                  <td style={{width: 72}}>
                    <Image 
                      width={120} 
                      height={120} 
                      src={episode.thumbnail} 
                      alt={episode.title} 
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episode/${episode.id}`}>
                      <a>
                        {episode.title}
                      </a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width: 100}}>{episode.publishedAt}</td>
                  <td>{episode.durationTimeString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + LatestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Play" />
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
  const { data } = await Api.get('episodes',{
    params:{
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });
  const episodes = data.map( (episode) =>{
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      durationTimeString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
      duration: Number(episode.file.duration),
    }
  });
  const LatestEpisodes = episodes.slice(0, 2);
  const AllEpisodes = episodes.slice(2, episodes.length);
  return{
    props:{
      LatestEpisodes,
      AllEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
