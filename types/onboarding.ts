export type OnboardingStep =
  | 'splash'
  | 'signup'
  | 'verify'
  | 'taste'
  | 'register-book'
  | 'matching';

export interface UserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  genres: string[];
  book: BookData | null;
}

export interface BookData {
  title: string;
  author: string;
  condition: 'A' | 'B' | 'C';
  description: string;
}

export interface MatchedUser {
  name: string;
  avatar: string;
  book: string;
  author: string;
  matchScore: number;
  genres: string[];
  reviewCount: number;
}
