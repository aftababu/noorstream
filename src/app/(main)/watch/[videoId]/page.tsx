"use client"; 

import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Truncate from "@/components/layout/Truncate";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";


interface VideoDetails {
  thumbnail: string;
  title: string;
  description: string;
}

const Page = () => {
  const videoId = "W1McvE4a910"; 
  const apiKey = "AIzaSyA5mtwoRgsvKhZE8x9MwRuD3F7CWDSR0Rc"; 

  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos`,
          {
            params: {
              part: "snippet",
              id: videoId,
              key: apiKey,
            },
          }
        );

        const data = response.data.items[0].snippet;
        console.log(data);
        setVideoDetails({
          thumbnail: data.thumbnails.maxres.url, // Highest resolution thumbnail
          title: data.title,
          description: data.description,
        });
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    fetchVideoDetails();
  }, [videoId, apiKey]);

  // Fetch comments with infinite loading
  const fetchComments = async ({ pageParam = "" }) => {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/commentThreads`,
      {
        params: {
          part: "snippet",
          videoId: videoId,
          key: apiKey,
          maxResults: 10, // Fetch 10 comments per page
          pageToken: pageParam, // Use pageToken for pagination
        },
      }
    );

    return response.data;
  };

 const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,

} = useInfiniteQuery({
  queryKey: ["comments", videoId], 
  queryFn: fetchComments,
  initialPageParam: undefined, 
  getNextPageParam: (lastPage) => lastPage.nextPageToken,
  enabled: !!videoId,
});
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Watch Video Page</h1>
      <p className="mb-4">Welcome to the watch video page!</p>

      {/* Video Player */}
      <div className="w-full aspect-video max-w-4xl mx-auto mb-8 player">
        {/* <ReactPlayer
          url={`https://www.youtube.com/watch?v=${videoId}`}
          controls={true}
          playing={true}
          muted={true}
          width="100%"
          height="100%"
          // onPause={}
          config={{
            youtube: {
              playerVars: {
                preload: true,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                // fs: 0,
                // cc_load_policy: 0,
                // iv_load_policy: 3,
                autoplay: 1,
                controls: 1,
              },
            },
          }}

        /> */}
        <MediaPlayer
          title="Sprite Fight"
          src={`https://www.youtube.com/watch?v=${videoId}`}

        >
          <MediaProvider />
          <DefaultVideoLayout
            thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
            icons={defaultLayoutIcons}
          />
        </MediaPlayer>
      </div>

      {/* Video Details */}
      {videoDetails && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-2">{videoDetails.title}</h2>
          {/* <p className="text-gray-700">{videoDetails.description}</p> */}
          <Truncate
            text={videoDetails.description}
            maxWords={20}
            className="text-gray-700"
            dangerous={false}
          />
        </div>
      )}

      {/* Comments */}
      <div className="max-w-4xl mx-auto mt-8">
        <h3 className="text-lg font-bold mb-4">Comments</h3>
        {status === "loading" && (
          // loading skeleton
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 w-1/2"></div>
            <div className="h-8 bg-gray-200 w-3/4"></div>
            <div className="h-8 bg-gray-200 w-5/6"></div>
          </div>
        )}
        {status === "error" && <p>Error loading comments.</p>}
        {status === "success" && (
          <>
            {data.pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.items.map((item) => (
                  <div key={item.id} className="mb-4">
                    <p className="font-semibold">
                      {item.snippet.topLevelComment.snippet.authorDisplayName}
                    </p>
                    <p className="text-gray-700">
                      <Truncate
                        text={item.snippet.topLevelComment.snippet.textDisplay}
                        maxWords={20}
                        className={""}
                        dangerous={true}
                      />
                      {/* {item.snippet.topLevelComment.snippet.textDisplay} */}
                    </p>
                  </div>
                ))}
              </React.Fragment>
            ))}
            {isFetchingNextPage && <p>Loading more comments...</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
