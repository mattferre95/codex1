import Head from 'next/head';
import { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}
export default function Layout({ title, children }: Props) {
  return (
    <div className="min-h-screen p-4">
      <Head>
        <title>{title} - FNEK</title>
      </Head>
      <main className="max-w-2xl mx-auto">{children}</main>
    </div>
  );
}
