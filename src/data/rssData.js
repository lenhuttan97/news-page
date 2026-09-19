const PROXY = '/api/rss';

export const HOME_FEEDS = [
  { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/tin-moi-nhat.rss', color: 'blue' },
  { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/tin-noi-bat.rss', color: 'blue' },
  { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/home.rss', color: 'orange' },
  { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/home.rss', color: 'green' },
  { source: 'Lao Động', rss_url: 'https://laodong.vn/rss', color: 'red' },
  { source: 'Thể Thao 247', rss_url: 'https://thethao247.vn/trang-chu.rss', color: 'red' },
  { source: '24h.com', rss_url: 'https://cdn.24h.com.vn/upload/rss/trangchu24h.rss', color: 'blue' },
];

export const CATEGORY_FEEDS = {
  'tin-tuc': [
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/tin-moi-nhat.rss', color: 'blue' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/home.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/home.rss', color: 'green' },
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/thoi-su.rss', color: 'blue' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/thoi-su.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/thoi-su.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/chinh-tri.rss', color: 'green' },
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/the-gioi.rss', color: 'blue' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/the-gioi.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/the-gioi.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/thoi-su/quoc-phong.rss', color: 'green' },
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/phap-luat.rss', color: 'blue' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/phap-luat.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/thoi-su/phap-luat.rss', color: 'green' },
    { source: '24h.com', rss_url: 'https://cdn.24h.com.vn/upload/rss/tintuctrongngay.rss', color: 'red' },
  ],
  'kinh-te': [
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/kinh-doanh.rss', color: 'blue' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/kinh-doanh.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/kinh-te.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/kinh-te/ngan-hang.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/kinh-te/chung-khoan.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/kinh-te/doanh-nghiep.rss', color: 'green' },
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/bat-dong-san.rss', color: 'blue' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/kinh-te/dia-oc.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/thoi-su/lao-dong-viec-lam.rss', color: 'green' },
    { source: '24h.com', rss_url: 'https://cdn.24h.com.vn/upload/rss/taichinhbatdongsan.rss', color: 'red' },
  ],
  'giao-duc': [
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/giao-duc.rss', color: 'blue' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/giao-duc.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/giao-duc.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/giao-duc/tuyen-sinh.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/giao-duc/chon-nghe-chon-truong.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/giao-duc/du-hoc.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/giao-duc/nha-truong.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/giao-duc/phu-huynh.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/giao-duc/tra-cuu-diem-thi.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/giao-duc/on-thi-tot-nghiep.rss', color: 'green' },
    { source: '24h.com', rss_url: 'https://cdn.24h.com.vn/upload/rss/giaoducduhoc.rss', color: 'red' },
  ],
  'cong-nghe': [
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/khoa-hoc.rss', color: 'blue' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/nhip-song-so.rss', color: 'orange' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/khoa-hoc.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/cong-nghe.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/cong-nghe/tin-tuc-cong-nghe.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/cong-nghe/blockchain.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/cong-nghe/san-pham.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/cong-nghe/xu-huong-chuyen-doi-so.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/cong-nghe/thu-thuat.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/cong-nghe/game.rss', color: 'green' },
    { source: '24h.com', rss_url: 'https://cdn.24h.com.vn/upload/rss/congnghethongtin.rss', color: 'red' },
  ],
  'the-thao': [
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/the-thao.rss', color: 'blue' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/the-thao.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/the-thao.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/the-thao/bong-da-viet-nam.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/the-thao/bong-da-quoc-te.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/the-thao/bong-da-thanh-nien-sinh-vien.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/the-thao/cac-mon-khac.rss', color: 'green' },
    { source: 'Thể Thao 247', rss_url: 'https://thethao247.vn/bong-da.rss', color: 'red' },
    { source: 'Thể Thao 247', rss_url: 'https://thethao247.vn/the-thao-24h.rss', color: 'red' },
    { source: '24h.com', rss_url: 'https://cdn.24h.com.vn/upload/rss/bongda.rss', color: 'red' },
  ],
  'suc-khoe': [
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/suc-khoe.rss', color: 'blue' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/suc-khoe.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/suc-khoe.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/suc-khoe/y-te-thong-minh.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/thoi-su/thanh-tuu-y-khoa.rss', color: 'green' },
    { source: '24h.com', rss_url: 'https://cdn.24h.com.vn/upload/rss/suckhoedoisong.rss', color: 'red' },
  ],
  'doi-song': [
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/gia-dinh.rss', color: 'blue' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/nhip-song-tre.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/doi-song.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/doi-song/gia-dinh.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/gioi-tre.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/gioi-tre/khoi-nghiep.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/gioi-tre/co-hoi-nghe-nghiep.rss', color: 'green' },
    { source: '24h.com', rss_url: 'https://cdn.24h.com.vn/upload/rss/bantrecuocsong.rss', color: 'red' },
  ],
  'van-hoa': [
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/giai-tri.rss', color: 'blue' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/giai-tri.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/giai-tri.rss', color: 'green' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/van-hoa.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/van-hoa.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/giai-tri/phim.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/giai-tri/truyen-hinh.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/van-hoa/sach-hay.rss', color: 'green' },
    { source: '24h.com', rss_url: 'https://cdn.24h.com.vn/upload/rss/phim.rss', color: 'red' },
  ],
  'du-lich': [
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/du-lich.rss', color: 'blue' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/du-lich.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/du-lich.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/du-lich/kham-pha.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/du-lich/cau-chuyen-du-lich.rss', color: 'green' },
    { source: '24h.com', rss_url: 'https://cdn.24h.com.vn/upload/rss/dulich.rss', color: 'red' },
  ],
  xe: [
    { source: 'VnExpress', rss_url: 'https://vnexpress.net/rss/oto-xe-may.rss', color: 'blue' },
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/xe.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/xe.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/xe/thi-truong.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/xe/xe-xanh.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/xe/danh-gia-xe.rss', color: 'green' },
    { source: '24h.com', rss_url: 'https://cdn.24h.com.vn/upload/rss/oto.rss', color: 'red' },
  ],
  'quoc-phong': [
    { source: 'QĐND', rss_url: 'https://www.qdnd.vn/rss', color: 'purple' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/chinh-tri.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/thoi-su/quoc-phong.rss', color: 'green' },
  ],
  video: [
    { source: 'Tuổi Trẻ', rss_url: 'https://tuoitre.vn/video.rss', color: 'orange' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/video.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/podcast.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/podcast/genz.rss', color: 'green' },
    { source: 'Thanh Niên', rss_url: 'https://thanhnien.vn/rss/podcast/showbiz.rss', color: 'green' },
  ],
};

export const NEWS_CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'tin-tuc', label: 'Tin tức' },
  { id: 'kinh-te', label: 'Kinh tế' },
  { id: 'giao-duc', label: 'Giáo dục' },
  { id: 'cong-nghe', label: 'Công nghệ' },
  { id: 'the-thao', label: 'Thể thao' },
  { id: 'suc-khoe', label: 'Sức khỏe' },
  { id: 'doi-song', label: 'Đời sống' },
  { id: 'van-hoa', label: 'Văn hóa & Giải trí' },
  { id: 'du-lich', label: 'Du lịch' },
  { id: 'xe', label: 'Xe' },
  { id: 'quoc-phong', label: 'Quốc phòng – An ninh' },
  { id: 'video', label: 'Video / Podcast' },
];

function dateToNumber(item) {
  const time = new Date(item.pubDate).getTime();
  return Number.isNaN(time) ? 0 : time;
}

async function fetchFeedList(feeds, forcedCategory) {
  const settled = await Promise.all(
    feeds.map(async (feed) => {
      try {
        const res = await fetch(`${PROXY}?url=${encodeURIComponent(feed.rss_url)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return parseRSSXML(await res.text(), feed.source, feed.color, forcedCategory);
      } catch (error) {
        console.warn(`Failed to fetch ${feed.source} ${feed.rss_url}:`, error);
        return [];
      }
    }),
  );
  const seenIds = new Set();
  const seenLinks = new Set();
  return settled
    .flat()
    .filter((item) => {
      if (!item.id || !item.link) return false;
      if (seenIds.has(item.id) || seenLinks.has(item.link)) return false;
      seenIds.add(item.id);
      seenLinks.add(item.link);
      return true;
    })
    .sort((a, b) => dateToNumber(b) - dateToNumber(a));
}

export async function fetchHomeNews() {
  return fetchFeedList(HOME_FEEDS);
}

export async function fetchCategoryNews(categoryId) {
  const feeds = CATEGORY_FEEDS[categoryId];
  if (!feeds) return [];
  return fetchFeedList(feeds, categoryId);
}

export async function fetchRSSData() {
  return fetchHomeNews();
}

function parseRSSXML(xmlText, source, color, forcedCategory) {
  const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid XML');
  const items = [];
  Array.from(doc.getElementsByTagName('item')).forEach((node) => {
    const title = node.querySelector('title')?.textContent || '';
    const link = node.querySelector('link')?.textContent || '';
    const descriptionHtml = node.querySelector('description')?.textContent || '';
    const pubDate = node.querySelector('pubDate')?.textContent || '';
    const image =
      node.querySelector('enclosure')?.getAttribute('url') ||
      node.querySelector('media\\:thumbnail, media\\:content')?.getAttribute('url') ||
      extractImgFromHtml(descriptionHtml) ||
      '';
    if (title && link) {
      items.push({
        id: `${source}-${link}`,
        title,
        description: stripHTML(descriptionHtml),
        link,
        pubDate,
        image,
        source,
        color,
        category: forcedCategory || categorizeNews(title),
      });
    }
  });
  return items;
}

function extractImgFromHtml(html) {
  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(html || '');
  return match ? match[1] : '';
}

function stripHTML(html) {
  const temp = document.createElement('div')
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ''
}

const CATEGORY_KEYWORDS = [
  {
    id: 'the-thao',
    keywords: ['thể thao', 'bóng đá', 'cầu thủ', 'huấn luyện viên', 'vô địch', 'trận đấu', 'thi đấu', 'đội tuyển', 'olympic', 'seagames', 'vleague', 'tennis', 'bóng chuyền', 'đua xe'],
  },
  {
    id: 'xe',
    keywords: ['ô tô', 'xe máy', 'xe điện', 'oto', 'mô tô', 'xe tải', 'đánh giá xe', 'bảng giá xe'],
  },
  {
    id: 'cong-nghe',
    keywords: ['công nghệ', 'khoa học', 'trí tuệ nhân tạo', 'blockchain', 'chuyển đổi số', 'số hóa', 'internet', 'điện thoại', 'smartphone', 'phần mềm', 'ứng dụng', 'game', 'laptop'],
  },
  {
    id: 'du-lich',
    keywords: ['du lịch', 'khám phá', 'điểm đến', 'khách sạn', 'khu nghỉ dưỡng', 'tour'],
  },
  {
    id: 'suc-khoe',
    keywords: ['sức khỏe', 'y tế', 'bệnh viện', 'bác sĩ', 'bệnh nhân', 'vaccine', 'dinh dưỡng', 'thuốc', 'y khoa', 'dược'],
  },
  {
    id: 'giao-duc',
    keywords: ['giáo dục', 'tuyển sinh', 'du học', 'kỳ thi', 'thi tốt nghiệp', 'đề thi', 'thí sinh', 'giáo viên', 'học sinh', 'sinh viên', 'đại học', 'trường học'],
  },
  {
    id: 'van-hoa',
    keywords: ['văn hóa', 'giải trí', 'phim', 'sách', 'âm nhạc', 'ca sĩ', 'diễn viên', 'nghệ sĩ', 'điện ảnh', 'truyền hình', 'showbiz', 'concert'],
  },
  {
    id: 'kinh-te',
    keywords: ['kinh doanh', 'chứng khoán', 'ngân hàng', 'bất động sản', 'doanh nghiệp', 'tài chính', 'đầu tư', 'lãi suất', 'cổ phiếu', 'thuế', 'lạm phát', 'thị trường'],
  },
  {
    id: 'quoc-phong',
    keywords: ['quốc phòng', 'an ninh', 'quân đội', 'quân sự', 'biển đảo', 'hải quân', 'không quân', 'bộ đội', 'tàu chiến', 'diễn tập'],
  },
  {
    id: 'doi-song',
    keywords: ['đời sống', 'gia đình', 'giới trẻ', 'việc làm', 'ẩm thực', 'tiêu dùng', 'tâm sự'],
  },
  {
    id: 'video',
    keywords: ['video', 'podcast'],
  },
  {
    id: 'tin-tuc',
    keywords: ['thời sự', 'thế giới', 'pháp luật', 'chính trị', 'quốc hội', 'chính phủ', 'thủ tướng', 'tòa án'],
  },
];

function categorizeNews(title) {
  const lowerTitle = title.toLowerCase();
  for (const { id, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((word) => lowerTitle.includes(word))) return id;
  }
  return 'tin-tuc';
}
