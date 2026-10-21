interface AnnouncementBarProps {
  dict: {
    text: string;
  };
}

export function AnnouncementBar({ dict }: AnnouncementBarProps) {
  return (
    <div className="h-[34px] bg-burgundy text-ivory px-[4vw] flex items-center justify-center relative text-[12px] tracking-wide font-tajawal">
      <p className="m-0 text-center">{dict.text}</p>
    </div>
  );
}
