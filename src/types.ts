export type APIResponse = {
  totalItems: number;
  items: APIResponseItem[];
};

export type APIResponseItem = {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    categories: string[];
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
  };
};
