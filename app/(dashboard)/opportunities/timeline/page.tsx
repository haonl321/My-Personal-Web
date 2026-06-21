"use client";

import { OpportunityList } from "@/components/Opportunities/OpportunityList";
import { motion } from "framer-motion";

export default function OpportunitiesTimelinePage() {
  return (
    <div className="w-full flex flex-col items-center gap-8 pb-20">
      <div className="text-center space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-white drop-shadow-md uppercase tracking-wider text-pop"
        >
          Nhật ký Bài học & Khắc phục
        </motion.h1>
        <p className="text-white/60 text-sm max-w-md">
          Nơi lưu giữ các trải nghiệm chưa trọn vẹn, nhằm chuyển hóa tiếc nuối thành sự chuẩn bị sẵn sàng cho tương lai.
        </p>
      </div>

      <div className="w-full flex justify-center">
        <OpportunityList />
      </div>
    </div>
  );
}
