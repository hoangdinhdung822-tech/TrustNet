import { 
  User, Post, Comment, FactCheckRecord, Lesson, Scenario, ReportItem, SearchResultItem 
} from '../types';

const STORAGE_KEYS = {
  USER: 'trustnet_current_user',
  POSTS: 'trustnet_posts',
  COMMENTS: 'trustnet_comments',
  FACT_CHECKS: 'trustnet_fact_checks',
  LESSONS: 'trustnet_lessons',
  SCENARIOS: 'trustnet_scenarios',
  REPORTS: 'trustnet_reports',
  ACCOUNTS: 'trustnet_accounts',
  IS_LOGGED_IN: 'trustnet_is_logged_in',
};

// Initial Accounts Collection
export const INITIAL_ACCOUNTS: User[] = [
  {
    id: 'u-dung-01',
    username: 'hoangdinhdung822',
    name: 'Hoàng Đình Dũng',
    email: 'hoangdinhdung822@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    school: 'Trường THPT Số 1 Phan Đình Phùng',
    className: 'Khối 11 - Đoàn Trường',
    bio: 'Học sinh THPT Số 1 Phan Đình Phùng đam mê an toàn số, công nghệ & AI kiểm chứng tin tức.',
    points: 850,
    role: 'user',
    rankTitle: 'Người kiểm chứng (Fact Checker)',
    badges: [
      {
        id: 'b-fact-checker',
        name: 'Fact Checker',
        icon: '🏅',
        description: 'Đã thực hiện hơn 10 lượt kiểm chứng thông tin chính xác.',
        isUnlocked: true,
        unlockedAt: '2026-09-15'
      },
      {
        id: 'b-cyber-guardian',
        name: 'Cyber Guardian',
        icon: '🛡️',
        description: 'Vượt qua 5 tình huống an ninh mạng với độ chính xác trên 80%.',
        isUnlocked: true,
        unlockedAt: '2026-09-20'
      },
      {
        id: 'b-school-rep',
        name: 'Đại sứ THPT Số 1',
        icon: '🏫',
        description: 'Đại sứ lan tỏa văn hóa kiểm chứng tại THPT Số 1 Phan Đình Phùng.',
        isUnlocked: true,
        unlockedAt: '2026-09-22'
      }
    ],
    factChecksCount: 18,
    scenariosCompletedCount: 9,
    quizAccuracy: 92,
    createdAt: '2026-08-15'
  },
  {
    id: 'u-genz-01',
    username: 'baotram_digital',
    name: 'Bảo Trâm',
    email: 'baotram.tech@trustnet.vn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    school: 'Trường THPT Số 1 Phan Đình Phùng',
    className: 'Lớp 11A2',
    bio: 'Sống có phản biện, đọc có kiểm chứng. Thành viên CLB Truyền thông số.',
    points: 450,
    role: 'user',
    rankTitle: 'Người kiểm chứng',
    badges: [
      {
        id: 'b-fact-checker',
        name: 'Fact Checker',
        icon: '🏅',
        description: 'Đã thực hiện hơn 10 lượt kiểm chứng thông tin chính xác.',
        isUnlocked: true,
        unlockedAt: '2026-09-15'
      },
      {
        id: 'b-cyber-guardian',
        name: 'Cyber Guardian',
        icon: '🛡️',
        description: 'Vượt qua 5 tình huống an ninh mạng với độ chính xác trên 80%.',
        isUnlocked: true,
        unlockedAt: '2026-09-20'
      }
    ],
    factChecksCount: 12,
    scenariosCompletedCount: 7,
    quizAccuracy: 85,
    createdAt: '2026-08-01'
  },
  {
    id: 'u-admin-01',
    username: 'trustnet_admin',
    name: 'Quản Trị Viên TrustNet',
    email: 'admin@trustnet.vn',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
    school: 'Ban Quản trị An toàn Thông tin TrustNet',
    className: 'Admin Desk',
    bio: 'Quản trị viên hệ thống TrustNet - Giám sát tin giả và điều phối an toàn mạng học đường.',
    points: 2500,
    role: 'admin',
    rankTitle: 'Hiệp sĩ an toàn số (Digital Knight)',
    badges: [
      {
        id: 'b-admin-shield',
        name: 'Tổng Quản Trị',
        icon: '👑',
        description: 'Đặc quyền kiểm duyệt và điều hành nền tảng TrustNet.',
        isUnlocked: true,
        unlockedAt: '2026-07-01'
      }
    ],
    factChecksCount: 120,
    scenariosCompletedCount: 25,
    quizAccuracy: 98,
    createdAt: '2026-07-01'
  }
];

// Initial Current User
const DEFAULT_USER: User = INITIAL_ACCOUNTS[0];

// Initial Posts
const INITIAL_POSTS: Post[] = [
  {
    id: 'post-01',
    userId: 'u-official-01',
    author: {
      id: 'u-official-01',
      name: 'Cổng Thông Tin Bộ Giáo Dục',
      username: 'moet_official',
      avatar: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80',
      rankTitle: 'Tổ chức Kiểm chứng Uy tín',
      isVerifiedUser: true
    },
    content: 'Chính thức: Bộ GD&ĐT công bố quy chế thi tốt nghiệp THPT mới với nhiều đổi mới kỹ thuật số và tăng cường bảo mật đề thi bằng mã hóa đa tầng. Học sinh các trường THPT có thể tra cứu lịch thi và đề thi minh họa tại cổng chính thức.',
    sourceUrl: 'https://moet.gov.vn/quy-che-thi-moi-2026',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    verificationStatus: 'verified',
    verificationScore: 95,
    aiExplanation: {
      score: 95,
      status: 'verified',
      summary: 'Thông tin chính thống, khớp 100% với văn bản quy phạm pháp luật của Bộ GD&ĐT.',
      reasoning: 'Nguồn phát hành từ cổng thông tin .gov.vn được bảo hộ pháp lý. Không có yếu tố cắt xén giật gân.',
      claims: [
        'Bộ GD&ĐT công bố quy chế thi tốt nghiệp THPT mới',
        'Có đề thi minh họa và lịch thi chính thức trên cổng moet.gov.vn'
      ],
      supportingEvidence: [
        'Thông cáo báo chí số 142/TC-BGDĐT ngày 20/09/2026.',
        'Đã được xác nhận bởi các cơ quan báo đài quốc gia (VTV, TTXVN).'
      ],
      refutingEvidence: [],
      sources: [
        { title: 'Cổng thông tin Bộ Giáo Dục và Đào Tạo', url: 'https://moet.gov.vn', reliability: 'high' }
      ],
      unverifiedPoints: [],
      misleadingTerms: [],
      recommendation: 'Học sinh lớp 12 nên lưu lại và truy cập trực tiếp website Bộ để tải tài liệu chính xác.'
    },
    likesCount: 142,
    commentsCount: 28,
    sharesCount: 56,
    isLiked: false,
    isSaved: true,
    createdAt: '2 giờ trước'
  },
  {
    id: 'post-02',
    userId: 'u-user-22',
    author: {
      id: 'u-user-22',
      name: 'Hoàng Minh Quân',
      username: 'minhquan_vlog',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      rankTitle: 'Người dùng mới',
      isVerifiedUser: false
    },
    content: 'Cảnh báo mọi người: Uống nước chanh sả gừng nóng lúc sáng sớm chữa khỏi 100% mọi loại biến thể cúm mùa và virus mới mà không cần tới bệnh viện! Nhà thuốc đang giấu bí quyết này để bán thuốc tây đắt tiền, chia sẻ ngay cho người thân biết nhé mọi người!',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    verificationStatus: 'suspicious',
    verificationScore: 32,
    aiExplanation: {
      score: 32,
      status: 'suspicious',
      summary: 'Thông tin có dấu hiệu giật gân, thiếu căn cứ y khoa và kích động tâm lý tẩy chay điều trị chính thống.',
      reasoning: 'Bài viết khẳng định "chữa khỏi 100%" - đây là dấu hiệu điển hình của ngụy khoa học (pseudoscience). Không có bất kỳ công trình thử nghiệm lâm sàng nào chứng minh chanh sả gừng diệt được hoàn toàn virus.',
      claims: [
        'Chanh sả gừng chữa khỏi 100% mọi biến thể cúm không cần thuốc',
        'Các hãng dược đang giấu thông tin'
      ],
      supportingEvidence: [
        'Chanh sả gừng có tính ấm, bổ sung vitamin C giúp tăng sức đề kháng nhẹ cho cơ thể.'
      ],
      refutingEvidence: [
        'Tổ chức Y tế Thế giới (WHO) và Bộ Y tế Việt Nam khẳng định chưa có thực phẩm tự nhiên nào diệt được hoàn toàn virus trong máu.',
        'Tự ý bỏ thuốc tây hoặc trì hoãn đến bệnh viện khi sốt cao có thể dẫn đến biến chứng suy hô hấp nguy hiểm.'
      ],
      sources: [
        { title: 'Tổ chức Y tế Thế giới (WHO) - Fact Check Y Tế', url: 'https://who.int', reliability: 'high' },
        { title: 'Cục Quản lý Khám, Chữa bệnh (Bộ Y tế)', url: 'https://kcb.vn', reliability: 'high' }
      ],
      unverifiedPoints: [
        'Lời tuyên bố "nhà thuốc đang giấu bí quyết" là thuyết âm mưu không có chứng cứ.'
      ],
      misleadingTerms: ['chữa khỏi 100%', 'bí quyết bị giấu kín', 'chia sẻ ngay'],
      recommendation: '⚠️ Đừng vội chia sẻ! Hãy đi khám bác sĩ khi có triệu chứng sốt hoặc ho kéo dài.'
    },
    likesCount: 19,
    commentsCount: 45,
    sharesCount: 4,
    isLiked: false,
    isSaved: false,
    createdAt: '4 giờ trước'
  },
  {
    id: 'post-03',
    userId: 'u-user-scam',
    author: {
      id: 'u-user-scam',
      name: 'Tri Ân Khách Hàng Online',
      username: 'trian_mungsinhnhat',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rankTitle: 'Tài khoản đang bị hạn chế',
      isVerifiedUser: false
    },
    content: '🎉 CHÚC MỪNG BẠN ĐÃ TRÚNG THƯỞNG! Nhân dịp kỷ niệm thành lập, gửi tặng ngẫu nhiên thẻ mua sắm trị giá 5.000.000đ cho 50 bạn nhanh tay nhất. Nhấp ngay vào link: http://tang-voucher-shopee-mung-sinh-nhat.xyz/claim để nhập số điện thoại và nhận mã quà tặng ngay hôm nay!',
    verificationStatus: 'debunked',
    verificationScore: 8,
    aiExplanation: {
      score: 8,
      status: 'debunked',
      summary: '🚨 CẢNH BÁO LỪA ĐẢO NGUY HIỂM: Phát hiện thủ đoạn Phishing chiếm đoạt tài khoản.',
      reasoning: 'Tên miền .xyz lạ, mạo danh thương hiệu thương mại điện tử lớn. Dẫn dắt người dùng nhập số điện thoại và mã OTP để chiếm đoạt ví điện tử/tài khoản ngân hàng.',
      claims: [
        'Tặng thẻ mua sắm 5.000.000đ ngẫu nhiên',
        'Cần bấm vào link .xyz để nhận'
      ],
      supportingEvidence: [],
      refutingEvidence: [
        'Đại diện Shopee xác nhận mọi chương trình quà tặng chỉ tổ chức trên ứng dụng chính thức hoặc tên miền shopee.vn.',
        'Cảnh báo từ Cục An toàn thông tin: Tên miền chứa từ khóa thương hiệu kèm đuôi .xyz, .top là 99% website giả mạo.'
      ],
      sources: [
        { title: 'Cổng Không Gian Mạng Quốc Gia (NCSC)', url: 'https://khonggianmang.vn', reliability: 'high' }
      ],
      unverifiedPoints: [],
      misleadingTerms: ['trúng thưởng', 'nhấp ngay vào link', 'nhận mã quà tặng'],
      recommendation: '🚫 KHÔNG click vào link! Báo cáo ngay cho ban quản trị để ngăn chặn phát tán.'
    },
    likesCount: 3,
    commentsCount: 62,
    sharesCount: 1,
    isLiked: false,
    isSaved: false,
    createdAt: '6 giờ trước'
  },
  {
    id: 'post-04',
    userId: 'u-user-eco',
    author: {
      id: 'u-user-eco',
      name: 'Thanh Trúc - Tech Insider',
      username: 'truc_tech',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      rankTitle: 'Người kiểm chứng',
      isVerifiedUser: true
    },
    content: 'Có thông tin rò rỉ rằng các hãng pin thể rắn (solid-state battery) sẽ bắt đầu thương mại hóa cho xe máy điện vào đầu năm sau, giúp sạc đầy trong 10 phút và đi được 300km. Mình đang tìm tài liệu từ các viện nghiên cứu để kiểm tra lại.',
    sourceUrl: 'https://trustnet.vn/research/batteries-2026',
    verificationStatus: 'unverified',
    verificationScore: 65,
    aiExplanation: {
      score: 65,
      status: 'unverified',
      summary: 'Thông tin có cơ sở khoa học nhưng giai đoạn thương mại hóa đại trà cần thêm chứng nhận sản xuất.',
      reasoning: 'Công nghệ pin thể rắn đã có nguyên mẫu phòng thí nghiệm thành công, tuy nhiên chi phí dây chuyền sản xuất quy mô lớn vẫn đang được các tập đoàn thử nghiệm.',
      claims: [
        'Pin thể rắn thương mại hóa cho xe máy điện năm sau',
        'Sạc đầy trong 10 phút, quãng đường 300km'
      ],
      supportingEvidence: [
        'Báo cáo từ Hiệp hội Kỹ sư Ô tô (SAE) ghi nhận tiến bộ đột phá về chất điện phân gốm nano.'
      ],
      refutingEvidence: [
        'Chưa có hãng sản xuất xe máy nào tại Việt Nam công bố hợp đồng thương mại chính thức cho quý 1 năm sau.'
      ],
      sources: [
        { title: 'Tạp chí Khoa học & Công nghệ Việt Nam', url: 'https://vjst.vn', reliability: 'high' }
      ],
      unverifiedPoints: [
        'Thời điểm mở bán chính thức tại thị trường Đông Nam Á.'
      ],
      misleadingTerms: [],
      recommendation: '🟡 Theo dõi thông cáo từ các nhà sản xuất xe điện chính thức trước khi đặt cọc.'
    },
    likesCount: 88,
    commentsCount: 16,
    sharesCount: 12,
    isLiked: true,
    isSaved: false,
    createdAt: '12 giờ trước'
  }
];

// Initial Comments
const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    postId: 'post-01',
    userId: 'u-user-4',
    author: {
      name: 'Nguyễn Tấn Đạt',
      username: 'dat_nguyen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    content: 'Cảm ơn TrustNet đã gắn nhãn Đã kiểm chứng! Nhiều trang mạng xã hội đăng tin đổi môn thi làm mình hoang mang mãi.',
    createdAt: '1 giờ trước'
  },
  {
    id: 'c-2',
    postId: 'post-02',
    userId: 'u-genz-01',
    author: {
      name: 'Bảo Trâm',
      username: 'baotram_digital',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    content: 'Mọi người nhớ bấm xem giải thích của AI nhé. Đừng tin ba cái bài thuốc thần dược trên mạng, rất hại dạ dày.',
    createdAt: '3 giờ trước'
  }
];

// 5 Digital Safety Academy Lessons
const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Nghệ Thuật Bóc Mẽ Tin Giả (Fake News Detection)',
    topic: 'Kỹ năng xác minh nguồn',
    icon: '🕵️‍♂️',
    description: 'Nắm vững quy tắc vàng 5 ngón tay: Kiểm tra tác giả, tên miền, ngày đăng, so sánh chéo và đọc kỹ trước khi bấm share.',
    readTime: '3 phút',
    difficulty: 'Dễ',
    points: 100,
    content: [
      {
        heading: '1. Không bao giờ chỉ dừng lại ở tiêu đề (Clickbait)',
        body: 'Hơn 60% người dùng mạng xã hội chia sẻ bài viết chỉ sau khi đọc tít giật gân. Các trang tin rác thường đặt tiêu đề cường điệu để câu tương tác, trong khi nội dung bên trong lại hoàn toàn khác hoặc trích dẫn sai sự thật.',
        tip: 'Mẹo: Luôn click vào đọc ít nhất 3 đoạn đầu và kiểm tra xem tiêu đề có bằng chứng cụ thể bên dưới hay không.'
      },
      {
        heading: '2. Kỹ thuật đảo ngược hình ảnh (Reverse Image Search)',
        body: 'Nhiều kẻ tạo tin giả lấy ảnh từ một vụ hỏa hoạn ở nước ngoài từ 5 năm trước rồi gán ghép thành sự việc xảy ra sáng nay tại Hà Nội.',
        example: 'Sử dụng Google Images hoặc Google Lens để tìm ảnh gốc và ngày xuất bản đầu tiên của tấm hình.'
      },
      {
        heading: '3. Kiểm tra tên miền và ngày xuất bản',
        body: 'Chú ý các tên miền nhái tinh vi như vnexpress-24h.com, tuoitre-news.cc thay vì các trang chính thống có đuôi .vn chuẩn xác.',
        warning: 'Cảnh báo: Luôn nhìn thanh địa chỉ URL của trình duyệt trước khi tin nội dung.'
      }
    ],
    quiz: {
      question: 'Bạn thấy một bài đăng với tiêu đề "Khẩn cấp: Uống giấm táo trị khỏi hoàn toàn bệnh ung thư sau 3 ngày!". Hành động nào thể hiện tư duy an toàn số đúng đắn nhất?',
      options: [
        'A. Chia sẻ ngay vào nhóm gia đình để cảnh báo người thân',
        'B. Bấm nút thích và để lại bình luận xin công thức chi tiết',
        'C. Đọc kỹ nội dung, kiểm tra nguồn y khoa chính thống (Bộ Y tế/WHO) và đối chiếu với AI Fact Check',
        'D. Chụp màn hình gửi cho tất cả bạn bè trong danh bạ'
      ],
      answerIndex: 2,
      explanation: 'Chính xác! Các khẳng định y khoa thần kỳ không có căn cứ từ Bộ Y tế hoặc WHO thường là tin giả nguy hiểm. Cần kiểm tra chéo và đối soát trước khi có bất kỳ hành động nào.'
    },
    isCompleted: true
  },
  {
    id: 'lesson-2',
    title: 'Giải Mã Cạm Bẫy Phishing & Lừa Đảo Trực Tuyến',
    topic: 'An toàn phòng ngừa lừa đảo',
    icon: '🎣',
    description: 'Cách nhận diện email mạo danh ngân hàng, tin nhắn trúng thưởng giả mạo và các link độc chiếm đoạt tài khoản.',
    readTime: '4 phút',
    difficulty: 'Trung bình',
    points: 120,
    content: [
      {
        heading: '1. Bản chất của tấn công Phishing (Lừa câu cá)',
        body: 'Kẻ xấu giả dạng làm người có thẩm quyền (ngân hàng, công an, thầy cô giáo, sàn thương mại điện tử) để tạo cảm xúc cấp bách hoặc lòng tham, ép nạn nhân hành động ngay lập tức.',
        tip: 'Quy tắc: Ngân hàng và công an KHÔNG BAO GIỜ yêu cầu bạn đọc mã OTP hoặc chuyển tiền vào tài khoản cá nhân để "phục vụ điều tra".'
      },
      {
        heading: '2. Phân tích đường link đáng ngờ',
        body: 'Kẻ lừa đảo sử dụng các ký tự gần giống (homograph attack) như thay chữ "o" bằng số "0", hoặc dùng tên miền phụ: vietcombank.login-security.xyz (bản chất tên miền là login-security.xyz).',
        example: 'Đường link thật: https://www.vietcombank.com.vn | Đường link giả: http://vietcombank.portal-security.com'
      }
    ],
    quiz: {
      question: 'Một tin nhắn SMS có brandname giống ngân hàng của bạn gửi đến: "Tài khoản của bạn sẽ bị đóng băng sau 30 phút nếu không bấm vào link http://msb.xacthuc-247.com". Bạn nên làm gì?',
      options: [
        'A. Vội vàng ấn vào link và nhập mật khẩu Internet Banking để không bị khóa',
        'B. Bỏ qua tin nhắn, tuyệt đối không ấn vào link và gọi thẳng tới hotline tổng đài in trên thẻ ATM để xác minh',
        'C. Nhập mã OTP vào trang web để lấy lại tài khoản',
        'D. Gửi link này cho bạn bè hỏi xem họ có bị khóa giống mình không'
      ],
      answerIndex: 1,
      explanation: 'Xuất sắc! Đây là hình thức giả mạo SMS Brandname bằng trạm BTS giả. Hotline in trực tiếp sau thẻ ATM là kênh liên lạc duy nhất đáng tin cậy.'
    },
    isCompleted: false
  },
  {
    id: 'lesson-3',
    title: 'Pháo Đài Mật Khẩu & Xác Thực Hai Lớp (2FA)',
    topic: 'Bảo mật tài khoản',
    icon: '🔐',
    description: 'Xây dựng mật khẩu không thể phá vỡ và thiết lập ứng dụng Authenticator bảo vệ tuyệt đối mạng xã hội.',
    readTime: '3 phút',
    difficulty: 'Dễ',
    points: 100,
    content: [
      {
        heading: '1. Tại sao mật khẩu "123456" hay ngày sinh vẫn bị hack trong 1 giây?',
        body: 'Kẻ tấn công sử dụng kỹ thuật Brute-force và danh sách từ điển hàng tỷ mật khẩu bị rò rỉ. Nếu bạn dùng một mật khẩu cho cả Facebook, TikTok, email trường học, khi một trang bị lộ thì bạn mất tất cả.',
        tip: 'Nên dùng cụm mật khẩu (Passphrase) gồm 4 từ ngẫu nhiên có dấu hoặc ký tự đặc biệt, ví dụ: "BanhMi-KemTrung-2026@SieuNgon".'
      },
      {
        heading: '2. Bật 2FA bằng App thay vì SMS',
        body: 'Mã OTP qua tin nhắn SMS có thể bị đánh cắp bằng thủ đoạn tráo SIM (SIM swap). Hãy ưu tiên dùng Google Authenticator hoặc Microsoft Authenticator.',
        example: 'Ứng dụng sinh mã TOTP 6 số tự động đổi mỗi 30 giây ngay cả khi không có mạng.'
      }
    ],
    quiz: {
      question: 'Phương thức xác thực 2 yếu tố (2FA) nào sau đây an toàn và khó bị can thiệp nhất đối với tài khoản cá nhân?',
      options: [
        'A. Gửi mã OTP qua cuộc gọi điện thoại thông thường',
        'B. Gửi mã qua tin nhắn SMS',
        'C. Sử dụng ứng dụng xác thực chuyên dụng (Google/Microsoft Authenticator) hoặc khóa bảo mật phần cứng',
        'D. Ghi nhớ mã bí mật ra một tờ giấy dán trên màn hình'
      ],
      answerIndex: 2,
      explanation: 'Chính xác! Ứng dụng Authenticator tạo mã cục bộ theo chuẩn thuật toán mã hóa TOTP, không bị ảnh hưởng bởi sóng điện thoại hay tấn công tráo SIM.'
    },
    isCompleted: false
  },
  {
    id: 'lesson-4',
    title: 'Dấu Chân Kỹ Thuật Số & Bảo Vệ Dữ Liệu Cá Nhân',
    topic: 'Quyền riêng tư trực tuyến',
    icon: '🛡️',
    description: 'Kiểm soát những gì bạn đăng: Tại sao bức ảnh vé máy bay hay góc học tập có thể trở thành vũ khí chống lại bạn.',
    readTime: '4 phút',
    difficulty: 'Trung bình',
    points: 120,
    content: [
      {
        heading: '1. Nguy hiểm từ việc "Check-in" quá chi tiết',
        body: 'Chụp hình căn cước công dân, thẻ sinh viên, hoặc vé máy bay có mã vạch barcode có thể làm lộ họ tên, số hộ chiếu, ngày sinh và hành trình đi lại cho kẻ xấu lợi dụng lừa đảo người thân ở nhà.',
        warning: 'Tuyệt đối không khoe mã vạch, mã QR trên vé sự kiện hoặc CCCD lên mạng xã hội.'
      },
      {
        heading: '2. Dọn dẹp quyền ứng dụng (App Permissions)',
        body: 'Một ứng dụng đèn pin hay chỉnh sửa ảnh selfie không có lý do gì để đòi quyền đọc danh bạ điện thoại, đọc tin nhắn SMS hay định vị vị trí 24/7.',
        tip: 'Hãy vào Cài đặt điện thoại và thu hồi các quyền truy cập vô lý ngay lập tức.'
      }
    ],
    quiz: {
      question: 'Bạn vừa đỗ kỳ thi quan trọng và muốn đăng ảnh lên mạng xã hội để ăn mừng. Bạn nên xử lý tấm ảnh phiếu điểm/CCCD như thế nào?',
      options: [
        'A. Đăng nguyên bản không che để mọi người thấy tính xác thực',
        'B. Che toàn bộ số định danh cá nhân, mã QR/Barcode, ngày sinh, địa chỉ nhà trước khi chia sẻ',
        'C. Gửi ảnh gốc vào các nhóm công khai để xin lời khuyên',
        'D. Đổi ảnh đại diện bằng hình chụp mặt trước và mặt sau CCCD'
      ],
      answerIndex: 1,
      explanation: 'Rất chuẩn! Việc che giấu (redact) các dữ liệu định danh như số CCCD, mã QR và địa chỉ nhà ngăn chặn triệt để hành vi đánh cắp danh tính để mở thẻ tín dụng ảo hoặc lừa đảo mạo danh.'
    },
    isCompleted: false
  },
  {
    id: 'lesson-5',
    title: 'Vén Màn Deepfake & Trí Tuệ Nhân Tạo Giả Mạo',
    topic: 'Công nghệ AI & Nhận thức thế hệ mới',
    icon: '🤖',
    description: 'Cách phát hiện hình ảnh do AI vẽ, video hoán đổi khuôn mặt và giọng nói nhái của người thân gọi video call.',
    readTime: '5 phút',
    difficulty: 'Nâng cao',
    points: 150,
    content: [
      {
        heading: '1. Dấu hiệu nhận biết video Deepfake gọi video lừa tiền',
        body: 'Kẻ lừa đảo thường thực hiện cuộc gọi video rất ngắn (vài giây), viện cớ "sóng yếu, mạng chập chờn" rồi cúp máy để nhắn tin xin chuyển tiền gấp.',
        tip: 'Khi có người thân gọi video xin tiền khẩn cấp: Hãy yêu cầu họ quay nghiêng mặt sang hai bên hoặc đưa bàn tay qua mặt. Deepfake AI sẽ bị lỗi biến dạng (glitch) ở phần viền khuôn mặt.'
      },
      {
        heading: '2. Nhận biết ảnh do AI tạo ra (AI-generated)',
        body: 'Soi kỹ các chi tiết phức tạp: Khớp ngón tay (thường bị 6 ngón hoặc biến dạng), bóng đổ không nhất quán với nguồn sáng, văn bản nền bị méo mó vô nghĩa, và vành tai không tự nhiên.',
        example: 'Chú ý tròng mắt: Kính mắt của người do AI tạo thường có gọng hai bên không đối xứng hoặc ánh phản chiếu trong mắt kỳ lạ.'
      }
    ],
    quiz: {
      question: 'Khi nhận được video call từ tài khoản mẹ bạn nói đang gặp tai nạn cần chuyển tiền gấp, nhưng hình ảnh giật cục và chỉ nói 5 giây rồi tắt. Bạn nên làm gì?',
      options: [
        'A. Chuyển tiền ngay lập tức vì sợ mẹ gặp nguy hiểm',
        'B. Đăng lên Facebook hỏi ý kiến mọi người',
        'C. Giữ bình tĩnh, KHÔNG chuyển tiền. Gọi trực tiếp số điện thoại viễn thông thông thường (SIM) của mẹ hoặc người thân khác để kiểm tra',
        'D. Nhắn tin vào tài khoản đó xin số tài khoản lạ để chuyển'
      ],
      answerIndex: 2,
      explanation: 'Xuất sắc! Cuộc gọi video call ngắn vài giây kèm lý do khẩn cấp là chiêu bài Deepfake kinh điển. Luôn dùng kênh liên lạc thứ hai độc lập (gọi điện thoại trực tiếp qua mạng viễn thông) để xác minh.'
    },
    isCompleted: false
  }
];

// 5 Cyber Scenarios as specified in prompt
const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 'scen-1',
    title: 'Tình huống 1: Tin Nóng Khẩn Cấp Về Dịch Bệnh',
    category: 'breaking_news',
    categoryLabel: 'Tin nóng khẩn cấp',
    urgencyLevel: 'Khẩn cấp',
    description: 'Bạn đang lướt mạng xã hội vào đêm muộn thì bắt gặp một bài đăng giật gân có hàng ngàn lượt chia sẻ trong ít phút.',
    simulatedMessage: {
      senderName: 'Nhóm Thông Tin Đô Thị 24/7',
      senderHandle: '@tinnhanh_dothi',
      senderAvatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=200&q=80',
      timeAgo: '12 phút trước',
      platform: 'Facebook',
      messageText: '🚨 KHẨN CẤP! Vừa phát hiện một loại virus lạ cực độc lây qua đường hô hấp đang lan rộng ở các quận trung tâm, các bệnh viện đang quá tải. Mọi người phải chia sẻ bài viết này ngay cho gia đình để kịp tích trữ lương thực trước khi phong tỏa ngày mai!!',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=600&q=80',
      metadataTag: '🔥 8.4k Lượt chia sẻ'
    },
    question: 'Trong tình huống này, phản xạ đúng đắn nhất của một công dân số thông minh là gì?',
    options: [
      {
        id: 'opt-a',
        text: 'A. Chia sẻ ngay vào nhóm gia đình để mọi người đi siêu thị mua đồ tích trữ kịp thời.',
        isCorrect: false,
        feedback: 'Sai lầm nguy hiểm: Chia sẻ tin tức chưa kiểm chứng gây hoang mang dư luận xã hội và có thể kích động tình trạng khan hiếm hàng hóa giả tạo.'
      },
      {
        id: 'opt-b',
        text: 'B. Bình luận hỏi thêm chủ bài viết xem có nguồn tin từ đâu không.',
        isCorrect: false,
        feedback: 'Chưa tối ưu: Việc bình luận trên các bài đăng tin rác vô tình giúp thuật toán đẩy bài viết đó tiếp cận nhiều người hơn.'
      },
      {
        id: 'opt-c',
        text: 'C. Kiểm tra nguồn chính thức (Bộ Y tế, Cổng thông tin Chính phủ) và kiểm tra ngày đăng cũng như đối soát chéo trên TrustNet.',
        isCorrect: true,
        feedback: 'Tuyệt vời! Lựa chọn C chuẩn xác vì trước khi chia sẻ thông tin khẩn cấp, bạn bắt buộc phải kiểm tra thông báo từ các cơ quan có thẩm quyền và báo chí chính ngạch.'
      },
      {
        id: 'opt-d',
        text: 'D. Chụp màn hình gửi cho tất cả bạn bè thân thiết hỏi "cái này thật không mày?".',
        isCorrect: false,
        feedback: 'Chưa đúng: Việc lan truyền ảnh chụp màn hình cũng tương đương với việc phát tán tin đồn khi bạn bè bạn tiếp tục chia sẻ tiếp.'
      }
    ],
    expertTip: 'Ghi nhớ nguyên tắc: "Tin càng giật gân, càng phải bình tĩnh kiểm tra nguồn chính thống".',
    pointsReward: 50,
    isCompleted: true
  },
  {
    id: 'scen-2',
    title: 'Tình huống 2: Tin Nhắn Trúng Thưởng 50.000.000 VNĐ',
    category: 'prize_scam',
    categoryLabel: 'Lừa đảo trúng thưởng',
    urgencyLevel: 'Cảnh báo đỏ',
    description: 'Bạn nhận được một tin nhắn SMS hoặc thông báo ứng dụng với nội dung nhận phần thưởng giá trị cao bất ngờ.',
    simulatedMessage: {
      senderName: 'Hệ Thống Quay Thưởng May Mắn 2026',
      senderHandle: 'SMS Brandname: TRI-AN-VIP',
      senderAvatar: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=200&q=80',
      timeAgo: 'Vừa xong',
      platform: 'SMS',
      messageText: 'Chúc mừng số thuê bao 090xxxxxxx! Bạn đã may mắn trúng giải Đặc biệt trị giá 50.000.000 VNĐ trong sự kiện tri ân. Nhấn vào liên kết: http://nhanthuong-50trieu.gift-claim.xyz để điền thông tin tài khoản nhận tiền trong vòng 2 giờ!',
      mediaType: 'link_card',
      metadataTag: '⚠️ Tên miền không chứng thực'
    },
    question: 'Hành động bảo vệ bản thân an toàn và chính xác nhất là gì?',
    options: [
      {
        id: 'opt-2a',
        text: 'A. Bấm vào link ngay vì sợ hết hạn 2 giờ, sau đó chỉ điền số tài khoản chứ không nhập mật khẩu.',
        isCorrect: false,
        feedback: 'Rất rủi ro: Chỉ cần click vào link lạ, thiết bị của bạn có thể bị dính mã độc đánh cắp cookie hoặc theo dõi bàn phím.'
      },
      {
        id: 'opt-2b',
        text: 'B. Nhận diện dấu hiệu lừa đảo: không tham gia quay số thì không bao giờ trúng thưởng; không bấm link lạ và chặn/báo cáo số điện thoại.',
        isCorrect: true,
        feedback: 'Chính xác 100%! Không có bữa trưa nào miễn phí. Đây là chiêu trò Phishing đánh cắp tiền trong tài khoản bằng cách yêu cầu phí nhận thưởng hoặc lấy mã OTP.'
      },
      {
        id: 'opt-2c',
        text: 'C. Nhập thông tin của một người bạn ghét vào link để thử xem có được nhận tiền thật không.',
        isCorrect: false,
        feedback: 'Hành vi này vi phạm đạo đức và quy định pháp luật về bảo vệ dữ liệu cá nhân của người khác.'
      },
      {
        id: 'opt-2d',
        text: 'D. Nhắn tin lại hỏi ban tổ chức xem có thể nhận bằng tiền mặt được không.',
        isCorrect: false,
        feedback: 'Kẻ lừa đảo sẽ tiếp tục đưa bạn vào kịch bản đóng tiền cọc hoặc nộp thuế trúng thưởng trước khi biến mất.'
      }
    ],
    expertTip: 'Không bao giờ có chuyện trúng thưởng tiền tỷ từ một chương trình bạn chưa từng đăng ký tham gia.',
    pointsReward: 50,
    isCompleted: false
  },
  {
    id: 'scen-3',
    title: 'Tình huống 3: Mạo Danh Người Nổi Tiếng Mượn Tiền Gấp',
    category: 'imposter',
    categoryLabel: 'Tài khoản mạo danh',
    urgencyLevel: 'Đánh lừa',
    description: 'Một tài khoản có ảnh đại diện và tên giống hệt một ca sĩ hoặc streamer bạn yêu thích nhắn tin trực tiếp.',
    simulatedMessage: {
      senderName: 'Sơn Tùng M-TP (Tài Khoản Phụ)',
      senderHandle: '@sontung_private_official',
      senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      timeAgo: '15 phút trước',
      platform: 'TikTok',
      messageText: 'Chào em, anh là Tùng đây. Tài khoản chính của anh đang bị kiểm toán tạm khóa một ngày. Anh đang cần chuyển khoản gấp 5 triệu cho quản lý tổ chức concert nhưng thẻ anh bị lỗi. Em giúp anh ứng trước được không, tối nay anh chuyển trả lại em 10 triệu và tặng vé VIP concert?',
      metadataTag: '💬 Tin nhắn chờ từ người lạ'
    },
    question: 'Những dấu hiệu đáng ngờ nào tố cáo đây là kẻ mạo danh?',
    options: [
      {
        id: 'opt-3a',
        text: 'A. Tài khoản không có tích xanh chính chủ, tạo cớ kịch tính, hứa hẹn trả lãi cao và yêu cầu chuyển tiền vào tài khoản cá nhân.',
        isCorrect: true,
        feedback: 'Hoàn toàn chính xác! Người nổi tiếng có ekip và nguồn tài chính riêng, không bao giờ nhắn tin mượn tiền người hâm mộ qua mạng.'
      },
      {
        id: 'opt-3b',
        text: 'B. Tài khoản này thật vì có ảnh đại diện giống hệt và biết tên ca sĩ.',
        isCorrect: false,
        feedback: 'Bất kỳ ai cũng có thể tải ảnh trên Google về làm avatar trong vòng 3 giây.'
      },
      {
        id: 'opt-3c',
        text: 'C. Chuyển trước 1 triệu thôi để thử lòng idol.',
        isCorrect: false,
        feedback: 'Dù chỉ 100k thì bạn cũng đã bị lừa và tiếp tay cho tội phạm lừa đảo trực tuyến.'
      },
      {
        id: 'opt-3d',
        text: 'D. Xin chụp ảnh căn cước công dân của họ rồi mới chuyển.',
        isCorrect: false,
        feedback: 'Kẻ gian thường sử dụng CCCD giả hoặc CCCD nhặt được để lừa nạn nhân tin tưởng.'
      }
    ],
    expertTip: 'Quy tắc vàng: Bất kỳ tin nhắn nào nhắc đến việc chuyển tiền gấp từ người lạ đều là lừa đảo.',
    pointsReward: 50,
    isCompleted: false
  },
  {
    id: 'scen-4',
    title: 'Tình huống 4: Bẫy Deepfake - Bạn Có Tin Không?',
    category: 'deepfake',
    categoryLabel: 'Video Deepfake AI',
    urgencyLevel: 'Nguy hiểm',
    description: 'Một đoạn video lan truyền trên mạng quay cảnh một hiệu trưởng trường học nổi tiếng có phát ngôn gây phẫn nộ với học sinh.',
    simulatedMessage: {
      senderName: 'Hội Học Sinh Bức Xúc',
      senderHandle: '@bocphot_hocduong',
      senderAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80',
      timeAgo: '1 giờ trước',
      platform: 'TikTok',
      messageText: 'Clip nóng: Thầy hiệu trưởng phát biểu xúc phạm học sinh trong cuộc họp kín! Các bạn share mạnh để bộ ngành vào cuộc đòi công bằng nào!!',
      mediaType: 'video',
      mediaUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
      metadataTag: '👁️ 500k Views • Âm thanh bị làm méo'
    },
    question: 'Khi quan sát video này để xác định có phải Deepfake hay không, bạn nên chú ý điều gì?',
    options: [
      {
        id: 'opt-4a',
        text: 'A. Xem khẩu hình miệng có khớp tự nhiên với âm thanh không, kiểm tra viền khuôn mặt, bóng đổ ánh sáng và tìm văn bản phát ngôn chính thức từ nhà trường.',
        isCorrect: true,
        feedback: 'Xuất sắc! Video Deepfake thường để lại tì vết ở chuyển động bờ môi không tự nhiên, răng bị mờ nhòe và viền da xung quanh cổ bị giật rung.'
      },
      {
        id: 'opt-4b',
        text: 'B. Vì có hình ảnh và giọng nói rõ ràng nên chắc chắn là thật 100%.',
        isCorrect: false,
        feedback: 'Với công nghệ Voice Cloning và Face Swap năm 2026, AI có thể mô phỏng bất kỳ giọng nói nào chỉ với 3 giây mẫu âm thanh.'
      },
      {
        id: 'opt-4c',
        text: 'C. Đăng video lên trang cá nhân và kêu gọi bạn bè vào ném đá tẩy chay ngôi trường.',
        isCorrect: false,
        feedback: 'Hành vi phát tán thông tin vu khống sai lệch do AI tạo ra có thể bị xử lý hình sự về tội xúc phạm danh dự nhân phẩm.'
      },
      {
        id: 'opt-4d',
        text: 'D. Nếu có nhiều người like thì video đó phải là thật.',
        isCorrect: false,
        feedback: 'Số lượng view và like có thể dễ dàng bị can thiệp bởi mạng lưới bot ảo (farm click).'
      }
    ],
    expertTip: 'Hãy quan sát chớp mắt và vùng tiếp giáp giữa mặt và tai: AI thường gặp khó khăn trong việc render độ phản xạ ánh sáng tự nhiên.',
    pointsReward: 50,
    isCompleted: false
  },
  {
    id: 'scen-5',
    title: 'Tình huống 5: Thao Túng Cảm Xúc & Kích Động Thù Hằn',
    category: 'emotional_bait',
    categoryLabel: 'Nội dung kích động',
    urgencyLevel: 'Cảnh báo đỏ',
    description: 'Một bài viết dùng từ ngữ nặng nề, xúc phạm một nhóm người hoặc vùng miền nhằm khơi dậy sự phẫn nộ trong cộng đồng mạng.',
    simulatedMessage: {
      senderName: 'Góc Nhìn Cực Đoan',
      senderHandle: '@gocnhin_gocngoai',
      senderAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
      timeAgo: '45 phút trước',
      platform: 'Facebook',
      messageText: 'Lại là người ở khu vực đó! Đúng là bản tính xấu xí không bao giờ thay đổi, đi đến đâu làm nhục quốc thể đến đó. Tất cả những ai quê ở đấy đều không đáng tin, mọi người tẩy chay ngay!',
      metadataTag: '🔥 1.2k Bình luận tranh cãi nảy lửa'
    },
    question: 'Trước nội dung thao túng cảm xúc này, quy trình tư duy đúng đắn là gì?',
    options: [
      {
        id: 'opt-5a',
        text: 'A. Nhận diện mình đang bị kích thích cảm xúc tức giận, không tham gia chửi bới, phân tích bằng chứng khách quan và bấm Báo cáo (Report) nội dung thù ghét.',
        isCorrect: true,
        feedback: 'Rất chín chắn! Kẻ tạo nội dung câu view thường dùng chiến thuật "Outrage Baiting" (bẫy phẫn nộ) để kiếm tương tác. Bình tĩnh và report là vũ khí sắc bén nhất.'
      },
      {
        id: 'opt-5b',
        text: 'B. Vào bình luận chửi lại bằng ngôn từ cay độc hơn để bảo vệ quan điểm của mình.',
        isCorrect: false,
        feedback: 'Điều này chỉ làm môi trường mạng độc hại hơn và giúp bài viết tăng lượng tương tác thuật toán.'
      },
      {
        id: 'opt-5c',
        text: 'C. Chia sẻ bài viết với dòng trạng thái bức xúc để bạn bè cùng ghét chung.',
        isCorrect: false,
        feedback: 'Bạn đã rơi vào bẫy khuếch đại sự thù ghét của những kẻ thao túng thuật toán.'
      },
      {
        id: 'opt-5d',
        text: 'D. Thu thập thông tin cá nhân của chủ bài viết để công khai dọa dẫm (Doxxing).',
        isCorrect: false,
        feedback: 'Hành vi Doxxing là bất hợp pháp và gây nguy hiểm đến an ninh cá nhân.'
      }
    ],
    expertTip: 'Khái niệm "Outrage Economy": Các trang tin rác kiếm tiền từ chính sự tức giận của bạn. Đừng để cảm xúc của mình bị khai thác.',
    pointsReward: 50,
    isCompleted: false
  }
];

// Initial Search Index
const INITIAL_SEARCH_RESULTS: SearchResultItem[] = [
  {
    id: 's-1',
    title: 'Cổng Thông tin Điện tử Chính phủ: Thông cáo báo chí về chính sách mới',
    summary: 'Cập nhật nhanh chóng, chính xác toàn bộ nghị định, quyết định của Thủ tướng Chính phủ và các bộ ngành liên quan đến đời sống xã hội.',
    source: 'Cổng TTĐT Chính phủ',
    sourceType: 'Cơ quan Nhà nước',
    date: '27/09/2026',
    url: 'https://chinhphu.vn',
    credibilityScore: 99,
    reliability: 'Rất cao',
    category: 'official'
  },
  {
    id: 's-2',
    title: 'Bộ Y tế khuyến cáo về phòng chống dịch bệnh theo mùa và tiêm chủng',
    summary: 'Cung cấp hướng dẫn điều trị chuẩn y khoa, phác đồ dinh dưỡng và đính chính các thông tin thuốc nam không rõ nguồn gốc trên mạng xã hội.',
    source: 'Bộ Y tế Việt Nam',
    sourceType: 'Cơ quan Nhà nước',
    date: '26/09/2026',
    url: 'https://moh.gov.vn',
    credibilityScore: 98,
    reliability: 'Rất cao',
    category: 'official'
  },
  {
    id: 's-3',
    title: 'Trung tâm Xử lý Tin giả Việt Nam (VAFC): Danh sách các website lừa đảo mới bị chặn',
    summary: 'Công bố hơn 150 tên miền giả mạo ngân hàng, sàn giao dịch tiền ảo bất hợp pháp và cảnh báo các chiến dịch tin giả có tổ chức.',
    source: 'VAFC (Bộ TT&TT)',
    sourceType: 'Chuyên trang Công nghệ',
    date: '25/09/2026',
    url: 'http://tingia.gov.vn',
    credibilityScore: 96,
    reliability: 'Rất cao',
    category: 'tech'
  },
  {
    id: 's-4',
    title: 'Tuổi Trẻ Online: Kiểm chứng thông tin - Mục Nói Lại Cho Rõ',
    summary: 'Chuyên mục điều tra độc lập của báo Tuổi Trẻ, xác minh các tin đồn chấn động trên mạng xã hội và đưa ra bằng chứng thực tế.',
    source: 'Báo Tuổi Trẻ',
    sourceType: 'Báo chính thống',
    date: '24/09/2026',
    url: 'https://tuoitre.vn/noi-lai-cho-ro.htm',
    credibilityScore: 92,
    reliability: 'Đáng tin cậy',
    category: 'news'
  },
  {
    id: 's-5',
    title: 'Tạp chí Khoa học Phổ thông: Thực hư công nghệ pin thể rắn và xe điện thế hệ mới',
    summary: 'Phân tích các bài báo nghiên cứu của Viện Công nghệ MIT và đánh giá khả năng thương mại hóa thực tế của pin sạc nhanh.',
    source: 'Tạp chí KHPT',
    sourceType: 'Tổ chức Giáo dục',
    date: '20/09/2026',
    url: 'https://khoahocphothong.vn',
    credibilityScore: 88,
    reliability: 'Đáng tin cậy',
    category: 'edu'
  }
];

// Initial Admin Reports
const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-01',
    reporterId: 'u-genz-01',
    reporterName: 'Bảo Trâm',
    postId: 'post-03',
    postSnippet: '🎉 CHÚC MỪNG BẠN ĐÃ TRÚNG THƯỞNG! Nhấp ngay vào link: http://tang-voucher-shopee...',
    postAuthor: 'Tri Ân Khách Hàng Online',
    reason: 'Đường link lừa đảo mạo danh ngân hàng và Shopee, có dấu hiệu đánh cắp OTP.',
    status: 'pending',
    createdAt: '30 phút trước'
  },
  {
    id: 'rep-02',
    reporterId: 'u-user-22',
    reporterName: 'Hoàng Minh Quân',
    postId: 'post-02',
    postSnippet: 'Uống nước chanh sả gừng nóng lúc sáng sớm chữa khỏi 100%...',
    postAuthor: 'Hoàng Minh Quân',
    reason: 'Thông tin y tế sai lệch gây nguy hiểm cho người già và trẻ nhỏ.',
    status: 'pending',
    createdAt: '1 giờ trước'
  }
];

/**
 * Service quản lý CSDL LocalStorage mô phỏng
 */
export class DatabaseService {
  // Lấy tất cả tài khoản
  public static getAllAccounts(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
    try {
      const accounts: User[] = JSON.parse(raw);
      let changed = false;
      for (const initAcc of INITIAL_ACCOUNTS) {
        if (!accounts.some(a => a.id === initAcc.id || a.username === initAcc.username)) {
          accounts.unshift(initAcc);
          changed = true;
        }
      }
      if (changed) {
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      }
      return accounts;
    } catch {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
  }

  // Kiểm tra trạng thái đã đăng nhập hay chưa
  public static isLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  }

  // Cập nhật trạng thái đăng nhập
  public static setLoggedIn(status: boolean): void {
    if (status) {
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    }
  }

  // Chuyển đổi tài khoản (Switch User / Login as)
  public static switchAccount(userId: string): User {
    const accounts = this.getAllAccounts();
    const found = accounts.find(a => a.id === userId);
    if (found) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(found));
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      return found;
    }
    return this.getCurrentUser();
  }

  // Đăng nhập bằng username, email hoặc tên (hỗ trợ mật khẩu tùy chọn)
  public static login(identifier: string, password?: string): User {
    const accounts = this.getAllAccounts();
    const clean = identifier.trim().toLowerCase().replace('@', '');
    const found = accounts.find(a => 
      a.username.toLowerCase() === clean || 
      a.name.toLowerCase() === clean ||
      a.email.toLowerCase() === clean
    );
    if (found) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(found));
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      return found;
    }
    // Nếu chưa có trong danh sách, tự động tạo tài khoản học sinh mới
    return this.registerUser({
      name: identifier.trim(),
      username: clean || 'user_' + Date.now().toString().slice(-4),
      email: `${clean || 'user'}@trustnet.vn`,
      school: 'Trường THPT Số 1 Phan Đình Phùng',
      password: password
    });
  }

  // Đăng ký tài khoản mới
  public static registerUser(data: Partial<User>): User {
    const accounts = this.getAllAccounts();
    const cleanUsername = data.username ? data.username.trim().replace('@', '').toLowerCase() : 'user_' + Date.now().toString().slice(-4);
    const newUser: User = {
      id: 'u-' + Date.now(),
      username: cleanUsername,
      name: data.name?.trim() || 'Người dùng mới',
      email: data.email || `${cleanUsername}@trustnet.vn`,
      avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      school: data.school || 'Trường THPT Số 1 Phan Đình Phùng',
      className: data.className || 'Học sinh',
      bio: data.bio || 'Thành viên mới tham gia mạng xã hội kiểm chứng TrustNet.',
      points: 150,
      role: 'user',
      rankTitle: 'Tân binh khởi đầu',
      badges: [
        {
          id: 'b-welcome',
          name: 'Gia nhập TrustNet',
          icon: '🎉',
          description: 'Chào mừng bạn đến với mạng xã hội kiểm chứng thông tin.',
          isUnlocked: true,
          unlockedAt: new Date().toISOString().split('T')[0]
        }
      ],
      factChecksCount: 0,
      scenariosCompletedCount: 0,
      quizAccuracy: 100,
      createdAt: new Date().toISOString().split('T')[0],
      password: data.password
    };

    const updated = [newUser, ...accounts.filter(a => a.username !== newUser.username)];
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    return newUser;
  }

  // Cập nhật thông tin cá nhân (Edit Profile)
  public static updateUserProfile(updatedFields: Partial<User>): User {
    const current = this.getCurrentUser();
    const updated: User = {
      ...current,
      ...updatedFields
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));

    // Đồng bộ lại vào danh sách accounts
    const accounts = this.getAllAccounts();
    const updatedAccounts = accounts.map(a => a.id === updated.id ? updated : a);
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updatedAccounts));

    return updated;
  }

  // Đăng xuất (xóa cờ đăng nhập và trả về tài khoản mặc định)
  public static logout(): User {
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    const accounts = this.getAllAccounts();
    const fallback = accounts[0] || DEFAULT_USER;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(fallback));
    return fallback;
  }

  // Lấy User
  public static getCurrentUser(): User {
    // Migration: nếu chưa nâng cấp v2 hoặc tài khoản cũ lưu Bảo Trâm thì chuyển sang Hoàng Đình Dũng
    if (!localStorage.getItem('trustnet_user_v2')) {
      localStorage.setItem('trustnet_user_v2', 'true');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
  }

  // Cập nhật điểm và huy hiệu cho User
  public static addPoints(pointsToAdd: number, reason: string): User {
    const user = this.getCurrentUser();
    user.points += pointsToAdd;

    // Cập nhật Rank Title theo mốc điểm
    if (user.points >= 1000) {
      user.rankTitle = 'Hiệp sĩ an toàn số (Digital Knight)';
      const badge = user.badges.find(b => b.id === 'b-digital-citizen');
      if (badge && !badge.isUnlocked) {
        badge.isUnlocked = true;
        badge.unlockedAt = new Date().toISOString().split('T')[0];
      }
    } else if (user.points >= 500) {
      user.rankTitle = 'Người kiểm chứng (Fact Checker)';
    } else {
      user.rankTitle = 'Người dùng mới';
    }

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  }

  // Lấy Posts
  public static getPosts(): Post[] {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return JSON.parse(raw);
  }

  // Thêm Post mới
  public static createPost(newPost: Post): Post[] {
    const posts = this.getPosts();
    const updated = [newPost, ...posts];
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
    this.addPoints(25, 'Đăng bài có kiểm chứng AI');
    return updated;
  }

  // Toggle Like Post
  public static toggleLike(postId: string): Post[] {
    const posts = this.getPosts();
    const updated = posts.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
        };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
    return updated;
  }

  // Lấy bình luận của post
  public static getComments(postId: string): Comment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const all: Comment[] = raw ? JSON.parse(raw) : INITIAL_COMMENTS;
    return all.filter(c => c.postId === postId);
  }

  // Thêm bình luận
  public static addComment(postId: string, content: string): Comment {
    const user = this.getCurrentUser();
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const all: Comment[] = raw ? JSON.parse(raw) : INITIAL_COMMENTS;
    const newComment: Comment = {
      id: 'c-' + Date.now(),
      postId,
      userId: user.id,
      author: {
        name: user.name,
        username: user.username,
        avatar: user.avatar
      },
      content,
      createdAt: 'Vừa xong'
    };
    all.push(newComment);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(all));

    // Update commentsCount trên post
    const posts = this.getPosts();
    const updatedPosts = posts.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts));

    return newComment;
  }

  // Lấy danh sách Scenarios
  public static getScenarios(): Scenario[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SCENARIOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(INITIAL_SCENARIOS));
      return INITIAL_SCENARIOS;
    }
    return JSON.parse(raw);
  }

  // Hoàn thành scenario
  public static completeScenario(scenarioId: string): Scenario[] {
    const list = this.getScenarios();
    const updated = list.map(s => s.id === scenarioId ? { ...s, isCompleted: true } : s);
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(updated));
    
    // Tăng XP cho user
    const target = list.find(s => s.id === scenarioId);
    if (target) {
      this.addPoints(target.pointsReward, `Hoàn thành tình huống: ${target.title}`);
      const user = this.getCurrentUser();
      user.scenariosCompletedCount += 1;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
    return updated;
  }

  // Lấy danh sách Lessons
  public static getLessons(): Lesson[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(INITIAL_LESSONS));
      return INITIAL_LESSONS;
    }
    return JSON.parse(raw);
  }

  // Hoàn thành lesson
  public static completeLesson(lessonId: string): Lesson[] {
    const list = this.getLessons();
    const updated = list.map(l => l.id === lessonId ? { ...l, isCompleted: true } : l);
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(updated));

    const target = list.find(l => l.id === lessonId);
    if (target) {
      this.addPoints(target.points, `Hoàn thành bài học: ${target.title}`);
    }
    return updated;
  }

  // Lấy Reports (Admin)
  public static getReports(): ReportItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(raw);
  }

  // Báo cáo bài viết
  public static createReport(postId: string, postSnippet: string, postAuthor: string, reason: string): ReportItem {
    const user = this.getCurrentUser();
    const reports = this.getReports();
    const newReport: ReportItem = {
      id: 'rep-' + Date.now(),
      reporterId: user.id,
      reporterName: user.name,
      postId,
      postSnippet,
      postAuthor,
      reason,
      status: 'pending',
      createdAt: 'Vừa xong'
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    this.addPoints(10, 'Báo cáo nội dung đáng ngờ cho cộng đồng');
    return newReport;
  }

  // Admin cập nhật trạng thái report
  public static updateReportStatus(reportId: string, status: ReportItem['status']): ReportItem[] {
    const reports = this.getReports();
    const updated = reports.map(r => r.id === reportId ? { ...r, status } : r);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
    return updated;
  }

  // Lấy Search data
  public static getSearchResults(keyword?: string, category?: string): SearchResultItem[] {
    let results = INITIAL_SEARCH_RESULTS;
    if (category && category !== 'all') {
      results = results.filter(r => r.category === category);
    }
    if (keyword && keyword.trim().length > 0) {
      const q = keyword.toLowerCase().trim();
      results = results.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.summary.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q)
      );
    }
    return results;
  }

  // Lịch sử Fact-Check cá nhân
  public static getFactCheckHistory(): FactCheckRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FACT_CHECKS);
    if (!raw) return [];
    return JSON.parse(raw);
  }

  public static saveFactCheckRecord(record: FactCheckRecord): void {
    const list = this.getFactCheckHistory();
    list.unshift(record);
    localStorage.setItem(STORAGE_KEYS.FACT_CHECKS, JSON.stringify(list));

    const user = this.getCurrentUser();
    user.factChecksCount += 1;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    this.addPoints(15, 'Kiểm chứng thông tin mới');
  }
}
