export type APIResponse = {
  totalItems: number;
  items?: Book[];
};

export type Book = {
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
