interface PercentageItemProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

const PercentageItem = ({ icon, title, value }: PercentageItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-lg text-muted-foreground">{title}</p>
      </div>
      <p className="text-base font-bold">{value}%</p>
    </div>
  );
};

export default PercentageItem;
