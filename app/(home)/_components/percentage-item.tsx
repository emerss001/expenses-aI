interface PercentageItemProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

const PercentageItem = ({ icon, title, value }: PercentageItemProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-3">
        <div className="shrink-0 rounded-lg bg-white bg-opacity-[3%] p-2">
          {icon}
        </div>
        <p className="truncate text-base text-muted-foreground sm:text-lg">
          {title}
        </p>
      </div>
      <p className="shrink-0 text-base font-bold">{value}%</p>
    </div>
  );
};

export default PercentageItem;
