export type VerificationStatus = 'verified' | 'unverified' | 'suspicious' | 'debunked' | 'analyzing';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  points: number; // XP
  role: 'user' | 'moderator' | 'admin';
  rankTitle: string;
  badges: Badge[];
  factChecksCount: number;
  scenariosCompletedCount: number;
  quizAccuracy: number;
  createdAt: string;
  bio?: string;
  school?: string;
  className?: string;
  password?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface AiVerificationResult {
  score: number; // 0-100
  status: VerificationStatus;
  summary: string;
  reasoning: string;
  claims: string[];
  supportingEvidence: string[];
  refutingEvidence: string[];
  sources: { title: string; url: string; reliability: 'high' | 'medium' | 'low' }[];
  unverifiedPoints: string[];
  misleadingTerms: string[];
  recommendation: string;
  modelUsed?: string;
  googleSearchQueries?: string[];
  googleGroundingSources?: { title: string; url: string }[];
  googleSearchUrl?: string;
  isGoogleSearchVerified?: boolean;
  directVerdict?: 'ĐÚNG' | 'SAI' | 'CHƯA RÕ' | 'CẢNH BÁO';
  factAnswer?: string; // Đáp án đúng chuẩn xác theo phong cách Google AI Overview
  featuredSourceCard?: {
    title: string;
    organization: string;
    url: string;
    snippet: string;
  };
}

export interface Post {
  id: string;
  userId: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    rankTitle: string;
    isVerifiedUser?: boolean;
  };
  content: string;
  imageUrl?: string;
  sourceUrl?: string;
  verificationStatus: VerificationStatus;
  verificationScore: number;
  aiExplanation: AiVerificationResult;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isReported?: boolean;
  moderationStatus?: 'approved' | 'pending' | 'flagged' | 'hidden';
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

export interface FactCheckRecord {
  id: string;
  userId: string;
  inputText: string;
  inputCategory: 'text' | 'statement' | 'social_post' | 'url' | 'image' | 'code';
  result: AiVerificationResult;
  createdAt: string;
}

export interface CodeInspectionReport {
  isCode: boolean;
  detectedType: 'HTML' | 'JavaScript' | 'Python' | 'JSON' | 'Văn bản' | 'Khác';
  riskLevel: 'an_toan' | 'chu_y' | 'nguy_hiem' | 'rat_nguy_hiem';
  riskScore: number; // 0 - 100 (100 is most dangerous)
  hasSyntaxIssues: boolean;
  hasSuspiciousRedirect: boolean;
  hasDataHarvesting: boolean;
  hasSecretLeak: boolean;
  hasPhishingSignals: boolean;
  issues: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    codeSnippet?: string;
    remedy: string;
  }[];
  explanation: string;
  recommendation: string;
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  icon: string;
  description: string;
  readTime: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Nâng cao';
  points: number;
  content: {
    heading: string;
    body: string;
    tip?: string;
    example?: string;
    warning?: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
  isCompleted?: boolean;
}

export interface ScenarioOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface Scenario {
  id: string;
  title: string;
  category: 'breaking_news' | 'prize_scam' | 'imposter' | 'deepfake' | 'emotional_bait';
  categoryLabel: string;
  urgencyLevel: 'Khẩn cấp' | 'Cảnh báo đỏ' | 'Đánh lừa' | 'Nguy hiểm';
  description: string;
  simulatedMessage: {
    senderName: string;
    senderHandle: string;
    senderAvatar: string;
    timeAgo: string;
    platform: 'Facebook' | 'Zalo' | 'Telegram' | 'SMS' | 'TikTok';
    messageText: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video' | 'link_card';
    metadataTag?: string;
  };
  question: string;
  options: ScenarioOption[];
  expertTip: string;
  pointsReward: number;
  isCompleted?: boolean;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  postId: string;
  postSnippet: string;
  postAuthor: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceType: 'Báo chính thống' | 'Cơ quan Nhà nước' | 'Tổ chức Giáo dục' | 'Chuyên trang Công nghệ' | 'Mạng xã hội';
  date: string;
  url: string;
  credibilityScore: number; // 0-100
  reliability: 'Rất cao' | 'Đáng tin cậy' | 'Cần kiểm chứng' | 'Cảnh báo';
  category: 'news' | 'official' | 'edu' | 'tech' | 'social';
}
