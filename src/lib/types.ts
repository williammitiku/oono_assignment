export interface StoryItem {
  _id: string;
  storyId: string;
  slug: string;
  background: string;
  backgroundType: "VIDEO" | "IMAGE" | "EMBED";
  thumbnail: string;
  duration: number;
  collectionOrder: Record<string, number>;
  coverImage?: string;
  storyDimension?: { width: number; height: number };
}

export interface Collection {
  _id: string;
  collectionId: string;
  brand?: string;
  name: string;
  slug: string;
  code: string;
  thumbnail: string;
  cover: string;
  stories: StoryItem[];
  totalStories: number;
  isLockedCollection?: boolean;
  topicId?: string;
  topics?: string[];
}

export interface CollectionsResponse {
  success: boolean;
  data: Collection[];
}

export interface TopicCollectionRef {
  _id: string;
  collectionId: string;
  name?: string;
  slug?: string;
}

export interface Topic {
  _id: string;
  topicId?: string;
  name: string;
  slug?: string;
  image?: string | null;
  description?: string | null;
  link?: string;
  collections: TopicCollectionRef[];
  order?: number;
}

export interface TopicsResponse {
  success?: boolean;
  data: Topic[];
}
