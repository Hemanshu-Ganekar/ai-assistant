export type Grade = 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type AptitudeLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  name: string;
  grade: Grade;
  aptitude: AptitudeLevel;
  joinedAt: number;
  onboarded?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  chapters: Chapter[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

export interface NoteUpload {
  id: string;
  title: string;
  subject: string;
  timestamp: number;
  content: string;
  status: 'analyzing' | 'ready';
  summary?: string;
}

export interface GeneratedPaper {
  id: string;
  subject: string;
  chapter: string;
  difficulty: string;
  questions: string[];
  timestamp: number;
  status: 'generated' | 'completed' | 'checked';
  score?: number;
  feedback?: string;
}
