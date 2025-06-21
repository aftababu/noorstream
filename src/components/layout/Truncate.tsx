"use client"; // Mark this component as a Client Component

import React, { useState } from "react";

const Truncate = ({ text, maxWords, className, dangerous, description }: {
  text: string;
  maxWords: number;
  className?: string;
  dangerous?: boolean;
  description?: string;
}) => {
  const [isTruncated, setIsTruncated] = useState(true);

  // Split text into words
  const words = text.trim().split(" "); // Fixed the trim() method call
  const shouldTruncate = words.length > maxWords; // Check if truncation is needed
  const truncatedText = shouldTruncate
    ? words.slice(0, maxWords).join(" ") + "..."
    : text;

  // Toggle truncation
  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };



  // Function to parse text and convert URLs and timestamps into clickable elements
  const parseText = (text) => {
    // Convert URLs to <a> tags
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let parsedText = text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: oklch(0.623 0.214 259.815); text-decoration: underline;">${url}</a>`;
    });

    // Convert timestamps to clickable buttons
    const timestampRegex = /(\d{1,2}:\d{2})/g;
    parsedText = parsedText.replace(timestampRegex, (timestamp) => {
      return `<button onclick="handleTimestampClick('${timestamp}')" style="color: oklch(0.623 0.214 259.815); text-decoration: underline; background: none; border: none; cursor: pointer;">${timestamp}</button>`;
    });

    return parsedText;
  };

  // Function to handle timestamp clicks
  const handleTimestampClick = (timestamp) => {
    const [minutes, seconds] = timestamp.split(":").map(Number);
    const timeInSeconds = minutes * 60 + seconds;
    // Seek to the specified time in the video
    // You need to implement this logic based on your video player
    console.log(`Seek to ${timeInSeconds} seconds`);
  };



  const parsedText = parseText(isTruncated && shouldTruncate ? truncatedText : text);


  return (
    <div className={className+" truncate"}>
      {dangerous ? (
        <div
          dangerouslySetInnerHTML={{
            __html:( isTruncated && shouldTruncate) ? truncatedText : text ,
          }}
        />
      ) : (
        <div
        dangerouslySetInnerHTML={{
          __html:parsedText,
        }}
      />
      )}
      {shouldTruncate && (
        <button
          onClick={toggleTruncate}
          className="text-blue-500 hover:underline font-semibold"
        >
          {isTruncated ? "Show more" : "Show less"}
        </button>
      )}
    </div>
  );
};

export default Truncate;