export interface Review {
  id: string;
  userId?: string; // Optional for AI generated ones
  reviewerName: string;
  rating: number; // 0-5
  text: string;
  date: string;
  avatarColor: string;
  likes: number;
}

export interface User {
  id: string;
  username: string;
  avatarColor: string;
  dateJoined: string;
}

export interface CafeDetails {
  id?: string; // ID if saved in DB
  name: string;
  location: string;
  yearEstablished: string;
  description: string;
  tags: string[];
  reviews: Review[];
  averageRating: number;
  posterPrompt: string;
}

export interface GeneratedImageResponse {
  imageUrl: string;
}

export enum LoadingState {
  IDLE,
  GENERATING_TEXT,
  GENERATING_IMAGE,
  COMPLETE,
  ERROR
}