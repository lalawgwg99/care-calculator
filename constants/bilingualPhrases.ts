export interface BilingualPhrase {
  id: string;
  category: string;
  chinese: string;
  indonesian: string;
  vietnamese: string;
}

export const CARE_PHRASES: BilingualPhrase[] = [
  // 用藥
  { id: "med-time-morning", category: "用藥", chinese: "早餐後吃藥", indonesian: "Minum obat setelah sarapan", vietnamese: "Uống thuốc sau bữa sáng" },
  { id: "med-time-noon", category: "用藥", chinese: "午餐後吃藥", indonesian: "Minum obat setelah makan siang", vietnamese: "Uống thuốc sau bữa trưa" },
  { id: "med-time-night", category: "用藥", chinese: "睡前吃藥", indonesian: "Minum obat sebelum tidur", vietnamese: "Uống thuốc trước khi ngủ" },
  { id: "med-blood-sugar", category: "用藥", chinese: "飯前量血糖", indonesian: "Ukur gula darah sebelum makan", vietnamese: "Đo đường huyết trước bữa ăn" },
  { id: "med-blood-pressure", category: "用藥", chinese: "早上量血壓", indonesian: "Ukur tekanan darah pagi hari", vietnamese: "Đo huyết áp buổi sáng" },

  // 飲食
  { id: "food-no-sugar", category: "飲食", chinese: "不能吃甜的", indonesian: "Tidak boleh makan yang manis", vietnamese: "Không được ăn đồ ngọt" },
  { id: "food-no-salt", category: "飲食", chinese: "少鹽", indonesian: "Sedikit garam", vietnamese: "Ít muối" },
  { id: "food-no-seafood", category: "飲食", chinese: "今天不能吃海鮮", indonesian: "Hari ini tidak boleh makan seafood", vietnamese: "Hôm nay không được ăn hải sản" },
  { id: "food-soft", category: "飲食", chinese: "要煮軟一點", indonesian: "Masak yang lunak", vietnamese: "Nấu mềm hơn" },
  { id: "food-water", category: "飲食", chinese: "要多喝水", indonesian: "Harus banyak minum air", vietnamese: "Phải uống nhiều nước" },
  { id: "food-puree", category: "飲食", chinese: "打成泥狀", indonesian: "Dihaluskan/blender", vietnamese: "Xay nhuyễn" },

  // 照顧
  { id: "care-turn", category: "照顧", chinese: "每 2 小時翻身一次", indonesian: "Balik badan setiap 2 jam", vietnamese: "Lật người mỗi 2 giờ" },
  { id: "care-pat-back", category: "照顧", chinese: "飯後要拍背", indonesian: "Tepuk punggung setelah makan", vietnamese: "Vỗ lưng sau bữa ăn" },
  { id: "care-diaper", category: "照顧", chinese: "尿布濕了要換", indonesian: "Ganti popok kalau basah", vietnamese: "Thay tã khi ướt" },
  { id: "care-walk", category: "照顧", chinese: "扶他走一走", indonesian: "Bantu dia jalan-jalan", vietnamese: "Dìu đi bộ" },
  { id: "care-bath", category: "照顧", chinese: "今天要洗澡", indonesian: "Hari ini harus mandi", vietnamese: "Hôm nay phải tắm" },
  { id: "care-exercise", category: "照顧", chinese: "幫他做運動", indonesian: "Bantu dia olahraga/senam", vietnamese: "Giúp tập thể dục" },

  // 緊急
  { id: "emergency-fall", category: "緊急", chinese: "跌倒了！打電話給我", indonesian: "Jatuh! Telepon saya", vietnamese: "Bị ngã! Gọi điện cho tôi" },
  { id: "emergency-fever", category: "緊急", chinese: "發燒了！打電話給我", indonesian: "Demam! Telepon saya", vietnamese: "Bị sốt! Gọi điện cho tôi" },
  { id: "emergency-pain", category: "緊急", chinese: "很痛！打電話給我", indonesian: "Sakit sekali! Telepon saya", vietnamese: "Đau lắm! Gọi điện cho tôi" },
  { id: "emergency-ambulance", category: "緊急", chinese: "叫救護車 119", indonesian: "Panggil ambulans 119", vietnamese: "Gọi xe cấp cứu 119" },

  // 日常
  { id: "daily-rest", category: "日常", chinese: "讓他休息", indonesian: "Biarkan dia istirahat", vietnamese: "Để nghỉ ngơi" },
  { id: "daily-tv", category: "日常", chinese: "可以看電視", indonesian: "Boleh nonton TV", vietnamese: "Được xem TV" },
  { id: "daily-sleep", category: "日常", chinese: "該睡覺了", indonesian: "Waktunya tidur", vietnamese: "Đến giờ ngủ rồi" },
  { id: "daily-sun", category: "日常", chinese: "帶他曬太陽", indonesian: "Ajak dia berjemur", vietnamese: "Dẫn đi phơi nắng" },
];

export const PHRASE_CATEGORIES = [...new Set(CARE_PHRASES.map((p) => p.category))];
