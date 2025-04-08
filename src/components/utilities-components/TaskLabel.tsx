type TaskLabelProps = {
  label: string;
  text: string;
  text_classes?: string;
};

export default function TaskLabel({ label, text,text_classes = "text-black" }: TaskLabelProps) {
  return (
    <div className="flex gap-1">
      <span className="font-bold uppercase">{label}: </span>
      <p className={text_classes}>{text}</p>
    </div>
  );
}
