import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import Head from "next/head";
import { useState } from "react";
import Link from "next/link";

// Define the type for props
interface PrankPageProps {
  username: string;
  prank: {
    visits: number;
    thumbnailUrl?: string;
  };
  user:{
    visits:number
  }
}

export default function PrankPage({ username, prank,user }: PrankPageProps) {
  const [isPlaying, setIsPlaying] = useState(false);

 

  return (
    <>
      <Head>
        <title>{username} leaked a private video!</title>
        <meta property="og:title" content={`${username} leaked a private video!`} />
        <meta property="og:image" content={prank.thumbnailUrl || "/default-thumbnail.jpg"} />
        <meta property="og:description" content="Click to view this shocking video!" />
        <meta property="og:type" content="video.other" />
      </Head>

      <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center">
        <h1 className="text-2xl font-bold">{username} فضيحة </h1>
        
        {!isPlaying ? (
          <div className="mt-4 items-center justify-center cursor-pointer" onClick={() => setIsPlaying(true)}>
            <button className="top-1/2 my-4 justify-center left-1/2 bg-red-600 text-white px-4 py-2 rounded-lg">
              ▶ مشاهدة المقطع
            </button>
          </div>
        ) : (
          <video src="vedioprank.mp4" poster="/tham.jpg" controls className="mt-4 w-96" autoPlay loop playsInline></video>
        )}

        👀 {user.visits+1} عدد المشاهدات 
        {isPlaying &&
        <Link href="/" className="text-blue-600 font-bold">
أنشئ مقلب فضيحة بالضغط هنا     </Link>}
        <h1 className="text-xs text-gray-600">
          {prank.visits}
        </h1>
      </div>
    </>
  );
}

// Define the getServerSideProps function with proper typing
export const getServerSideProps: GetServerSideProps<PrankPageProps> = async ({ params }) => {
  if (!params?.username || typeof params.username !== "string") {
    return { notFound: true };
  }
  

  const user = await prisma.user.findUnique({ where: { username: params.username } });

  if (!user) return { notFound: true };

  const prank = await prisma.prank.update({
    where: { id: user.prankId },
    data: { visits: { increment: 1 } }, // Increase visit count
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { visits: { increment: 1 } }, // Increase visit count
  });

  return { props: { username: user.username, prank ,user} };
};
