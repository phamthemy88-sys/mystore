export const categories = ["Tất cả", "Giải trí", "Công cụ", "Trò chơi", "Âm nhạc"];

export interface AppData {
  id: string;
  name: string;
  developer: string;
  category: string;
  rating: number;
  downloads: string;
  size: string;
  icon: string;
  description: string;
  screenshots: string[];
  version: string;
  downloadUrl: string;
}

export const initialApps: AppData[] = [
  {
    id: "1",
    name: "SmartTube Next",
    developer: "Yuriy Lyskov",
    category: "Giải trí",
    rating: 4.9,
    downloads: "10M+",
    size: "25 MB",
    icon: "https://picsum.photos/seed/smarttube/128/128",
    description: "Ứng dụng xem YouTube không quảng cáo dành riêng cho Android TV. Hỗ trợ 4K, SponsorBlock và tự động điều chỉnh tốc độ khung hình.",
    screenshots: [
      "https://picsum.photos/seed/st1/640/360",
      "https://picsum.photos/seed/st2/640/360",
      "https://picsum.photos/seed/st3/640/360"
    ],
    version: "18.92",
    downloadUrl: "https://example.com/download/smarttube"
  },
  {
    id: "2",
    name: "Kodi",
    developer: "XBMC Foundation",
    category: "Giải trí",
    rating: 4.5,
    downloads: "50M+",
    size: "60 MB",
    icon: "https://picsum.photos/seed/kodi/128/128",
    description: "Trung tâm giải trí đa phương tiện mã nguồn mở. Hỗ trợ xem phim, nghe nhạc, xem ảnh và cài đặt vô số tiện ích mở rộng (add-ons).",
    screenshots: [
      "https://picsum.photos/seed/kodi1/640/360",
      "https://picsum.photos/seed/kodi2/640/360"
    ],
    version: "20.2",
    downloadUrl: "https://example.com/download/kodi"
  },
  {
    id: "3",
    name: "Send files to TV",
    developer: "Yablio",
    category: "Công cụ",
    rating: 4.7,
    downloads: "5M+",
    size: "5 MB",
    icon: "https://picsum.photos/seed/sftv/128/128",
    description: "Ứng dụng chia sẻ file nhanh chóng giữa điện thoại, máy tính và Android TV thông qua mạng Wi-Fi nội bộ mà không cần internet.",
    screenshots: [
      "https://picsum.photos/seed/sftv1/640/360",
      "https://picsum.photos/seed/sftv2/640/360"
    ],
    version: "1.2.2",
    downloadUrl: "https://example.com/download/sftv"
  },
  {
    id: "4",
    name: "VLC for Android",
    developer: "Videolabs",
    category: "Công cụ",
    rating: 4.4,
    downloads: "100M+",
    size: "30 MB",
    icon: "https://picsum.photos/seed/vlc/128/128",
    description: "Trình phát video đa năng, hỗ trợ hầu hết mọi định dạng video và âm thanh. Có thể phát qua mạng LAN, chia sẻ SMB, UPnP.",
    screenshots: [
      "https://picsum.photos/seed/vlc1/640/360"
    ],
    version: "3.5.4",
    downloadUrl: "https://example.com/download/vlc"
  },
  {
    id: "5",
    name: "Crossy Road",
    developer: "HIPSTER WHALE",
    category: "Trò chơi",
    rating: 4.6,
    downloads: "100M+",
    size: "85 MB",
    icon: "https://picsum.photos/seed/crossy/128/128",
    description: "Trò chơi arcade vui nhộn, điều khiển nhân vật qua đường tránh xe cộ. Hỗ trợ chơi bằng remote TV rất mượt mà.",
    screenshots: [
      "https://picsum.photos/seed/crossy1/640/360",
      "https://picsum.photos/seed/crossy2/640/360"
    ],
    version: "4.8.1",
    downloadUrl: "https://example.com/download/crossyroad"
  },
  {
    id: "6",
    name: "Spotify - Music and Podcasts",
    developer: "Spotify Ltd.",
    category: "Âm nhạc",
    rating: 4.8,
    downloads: "1B+",
    size: "35 MB",
    icon: "https://picsum.photos/seed/spotify/128/128",
    description: "Nghe nhạc và podcast trên màn hình lớn. Giao diện tối ưu cho TV, hỗ trợ điều khiển qua điện thoại bằng Spotify Connect.",
    screenshots: [
      "https://picsum.photos/seed/spotify1/640/360",
      "https://picsum.photos/seed/spotify2/640/360"
    ],
    version: "8.8.4",
    downloadUrl: "https://example.com/download/spotify"
  },
  {
    id: "7",
    name: "Stremio",
    developer: "Stremio",
    category: "Giải trí",
    rating: 4.5,
    downloads: "1M+",
    size: "40 MB",
    icon: "https://picsum.photos/seed/stremio/128/128",
    description: "Trung tâm tổng hợp phim và TV show. Hỗ trợ cài đặt add-on để xem nội dung từ nhiều nguồn khác nhau với chất lượng cao.",
    screenshots: [
      "https://picsum.photos/seed/stremio1/640/360"
    ],
    version: "1.5.7",
    downloadUrl: "https://example.com/download/stremio"
  },
  {
    id: "8",
    name: "X-plore File Manager",
    developer: "Lonely Cat Games",
    category: "Công cụ",
    rating: 4.6,
    downloads: "10M+",
    size: "8 MB",
    icon: "https://picsum.photos/seed/xplore/128/128",
    description: "Trình quản lý file hai cửa sổ mạnh mẽ. Hỗ trợ kết nối Cloud, FTP, SMB, quản lý ứng dụng và giải nén file.",
    screenshots: [
      "https://picsum.photos/seed/xplore1/640/360",
      "https://picsum.photos/seed/xplore2/640/360"
    ],
    version: "4.30.12",
    downloadUrl: "https://example.com/download/xplore"
  },
  {
    id: "9",
    name: "Asphalt 8: Airborne",
    developer: "Gameloft SE",
    category: "Trò chơi",
    rating: 4.5,
    downloads: "100M+",
    size: "120 MB",
    icon: "https://picsum.photos/seed/asphalt/128/128",
    description: "Game đua xe đồ họa đỉnh cao. Hỗ trợ chơi bằng tay cầm gamepad hoặc remote TV.",
    screenshots: [
      "https://picsum.photos/seed/asphalt1/640/360",
      "https://picsum.photos/seed/asphalt2/640/360"
    ],
    version: "7.0.0",
    downloadUrl: "https://example.com/download/asphalt8"
  },
  {
    id: "10",
    name: "TIDAL Music",
    developer: "TIDAL",
    category: "Âm nhạc",
    rating: 4.3,
    downloads: "10M+",
    size: "45 MB",
    icon: "https://picsum.photos/seed/tidal/128/128",
    description: "Dịch vụ stream nhạc chất lượng cao Hi-Fi và Master. Trải nghiệm âm thanh tuyệt đỉnh trên hệ thống loa TV của bạn.",
    screenshots: [
      "https://picsum.photos/seed/tidal1/640/360"
    ],
    version: "2.80.0",
    downloadUrl: "https://example.com/download/tidal"
  }
];
