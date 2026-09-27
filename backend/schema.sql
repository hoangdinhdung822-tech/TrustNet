-- ==============================================================================
-- TRUSTNET DATABASE SCHEMA (PostgreSQL)
-- Concept: Mạng xã hội thông minh kiểm chứng thông tin bằng AI
-- Mục tiêu: "Đừng chỉ tin. Hãy kiểm chứng!"
-- ==============================================================================

-- Bật tiện ích UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG USERS (Người dùng)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Mã hóa bằng bcrypt, không bao giờ lưu plaintext
    name VARCHAR(100) NOT NULL,
    avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    points INTEGER DEFAULT 100, -- Hệ thống XP (100 = Tân binh, 500 = Người kiểm chứng, 1000 = Hiệp sĩ)
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- 2. BẢNG POSTS (Bài đăng mạng xã hội)
CREATE TYPE verification_status_enum AS ENUM (
    'verified',     -- 🟢 Đã kiểm chứng (Có cơ sở)
    'unverified',   -- 🟡 Chưa đủ dữ liệu để xác minh
    'suspicious',   -- 🟠 Có dấu hiệu đáng ngờ
    'debunked',     -- 🔴 Có khả năng sai lệch / Lừa đảo
    'analyzing'     -- 🤖 AI đang phân tích
);

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    source_url TEXT, -- Đường dẫn bài báo hoặc cổng thông tin đối chiếu
    verification_status verification_status_enum DEFAULT 'unverified',
    verification_score INTEGER CHECK (verification_score >= 0 AND verification_score <= 100),
    ai_explanation JSONB, -- Chứa: claims, reasoning, sources, misleading_terms, recommendations
    moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'hidden')),
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_verification_status ON posts(verification_status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- 3. BẢNG COMMENTS (Bình luận & Thảo luận phản biện)
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_post_id ON comments(post_id);

-- 4. BẢNG FACT_CHECKS (Lịch sử tra cứu & kiểm chứng AI độc lập)
CREATE TABLE IF NOT EXISTS fact_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    input_text TEXT NOT NULL,
    input_category VARCHAR(30) DEFAULT 'text', -- text, url, image, code
    result JSONB NOT NULL,
    confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
    explanation TEXT,
    sources JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fact_checks_user_id ON fact_checks(user_id);

-- 5. BẢNG LESSONS (Học viện an toàn số - Digital Safety Academy)
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    icon VARCHAR(20) DEFAULT '🎓',
    description TEXT NOT NULL,
    content JSONB NOT NULL, -- Cấu trúc các section, mẹo, ví dụ thực tế
    difficulty VARCHAR(20) DEFAULT 'Dễ' CHECK (difficulty IN ('Dễ', 'Trung bình', 'Nâng cao')),
    points_reward INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. BẢNG SCENARIOS (Khu vực tình huống mô phỏng - Cyber Scenarios)
CREATE TABLE IF NOT EXISTS scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- breaking_news, prize_scam, imposter, deepfake, emotional_bait
    urgency_level VARCHAR(30) DEFAULT 'Khẩn cấp',
    description TEXT NOT NULL,
    simulated_message JSONB NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Mảng 4 phương án A, B, C, D kèm feedback giải thích
    correct_answer VARCHAR(10) NOT NULL,
    expert_tip TEXT NOT NULL,
    points_reward INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. BẢNG REPORTS (Báo cáo nội dung đáng ngờ & Hàng đợi kiểm duyệt)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id)
);

CREATE INDEX idx_reports_post_id ON reports(post_id);
CREATE INDEX idx_reports_status ON reports(status);

-- 8. BẢNG USER_ACHIEVEMENTS (Huy hiệu & thành tích người dùng)
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_key VARCHAR(50) NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_key)
);
