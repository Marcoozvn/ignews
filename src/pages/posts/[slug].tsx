import Head from 'next/head';
import format from "date-fns/format";
import { ptBR } from "date-fns/locale";
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';

import styles from './post.module.scss';
import { htmlSerializer } from '../../utils/prismicSerializer';
import { useEffect } from 'react';

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function Post({ post }: PostProps) {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const { slug } = params;

  //@ts-ignore
  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false
      }
    }
  }
  
  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content, (string) => string, htmlSerializer),
    updatedAt: format(new Date(response.last_publication_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  return {
    props: {
      post
    }
  }
}