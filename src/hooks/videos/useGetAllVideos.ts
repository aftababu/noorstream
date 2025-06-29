import { getAllVideos } from "@/actions/videos/videosAction";
import { useQuery } from "@tanstack/react-query";

// Define your video type for better type safety
type Video = {
  id: string;
  title: string;
  thumbnail: string | null;
  sourceType: string;
  viewCount: number;
  createdAt: string;
  url: string;
  // Add other fields from your schema as needed
  collections: any[];
  addedBy: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

type ApiResponse = {
  data: Video[];
};

export const useGetAllVideos = (page: number, limit: number, searchQuery = "") => {
  const isPageValid = page > 0 && Number.isInteger(page);
  const isLimitValid = limit > 0 && Number.isInteger(limit);
  const enabled = isPageValid && isLimitValid;

 const queryKey = ["videos", page, limit, searchQuery];
  const dataQuery = useQuery<ApiResponse>({
    queryKey,
    queryFn: async () => await getAllVideos(page, limit, searchQuery),
    enabled,
  });
  return dataQuery;
};