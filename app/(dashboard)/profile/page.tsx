"use client"

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { useCounterStore } from "@/lib/store/counterStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Volume2, VolumeX, LogOut } from "lucide-react";
// import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useUser();
  const { soundEnabled, toggleSound } = useSettingsStore();
  const { count } = useCounterStore();
  const { customName, customAvatar, setName, setAvatar } = useUserStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(customName || user?.fullName || "");

  const avatars = [
    "/avatars/avatar_hero_1768529882323.png",
    "/avatars/avatar_heroine_1768529898417.png",
    "/avatars/avatar_robot_1768529867827.png",
    "/avatars/avatar_sparkle_1768529852910.png",
    "/image1.png", "/image2.png", "/image3.png", "/image4.png", "/image6.png",
    "/profile.png", "/profile1.png", "/profile2.png", "/profile3.png", "/profile4.png",
    "/profile5.png", "/profile6.png", "/profile7.png", "/profile8.png"
  ];

  const handleSaveProfile = () => {
    setName(tempName, user?.id);
    setIsEditing(false);
  };

  const displayName = customName || user?.fullName || "User";
  const displayAvatar = customAvatar || user?.imageUrl;

  // Profile page - minimalist version
  return (
    <div className="w-full max-w-2xl flex flex-col gap-8 pb-10">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-4 right-4">
          <Button 
             variant="ghost" 
             size="sm" 
             onClick={() => setIsEditing(!isEditing)}
             className="text-white/40 hover:text-white transition-colors"
          >
            {isEditing ? "Hủy" : "Chỉnh sửa"}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <img 
              src={displayAvatar} 
              alt={displayName} 
              className={cn(
                "relative w-24 h-24 rounded-full border-4 border-primary/50 shadow-lg object-cover transition-transform",
                isEditing && "scale-105"
              )}
            />
          </div>

          <div className="space-y-1 flex-1 text-center md:text-left pt-2 md:pt-0">
            {isEditing ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Tên hiển thị</Label>
                  <Input 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white focus:border-primary/50"
                    placeholder="Nhập tên của bạn..."
                  />
                </div>
                <Button onClick={handleSaveProfile} size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold w-full md:w-auto">
                  Lưu thay đổi
                </Button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-black text-white drop-shadow-md tracking-tight uppercase">{displayName}</h1>
                <p className="text-white/60 font-medium text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
                <div className="mt-3 text-[10px] font-black bg-white/10 text-white/60 px-3 py-1 rounded-full inline-block border border-white/10 tracking-widest uppercase">
                  Tổng thất bại: {count}
                </div>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8 pt-6 border-t border-white/10"
          >
            <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 block">Chọn ảnh đại diện có sẵn</Label>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {avatars.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setAvatar(img, user?.id)}
                  className={cn(
                    "w-12 h-12 rounded-full overflow-hidden border-2 shrink-0 transition-all hover:scale-110",
                    displayAvatar === img ? "border-primary" : "border-white/10 hover:border-white/30"
                  )}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Preferences Section */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase tracking-widest text-white/80">Cài đặt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="space-y-0.5">
              <Label className="text-white font-bold">Âm thanh</Label>
              <p className="text-xs text-white/40 italic">Hiệu ứng khi tương tác</p>
            </div>
            <div className="flex items-center gap-3">
               {soundEnabled ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5 text-white/20" />}
               <Switch
                 checked={soundEnabled}
                 onCheckedChange={toggleSound}
               />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <SignOutButton>
          <Button variant="ghost" className="gap-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 font-bold">
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}
