import Badge from "../Badge";

const NameWithBadge = ({
  name,
  badgeArray,
}: {
  name: string;
  badgeArray: string[];
}) => {
  return (
    <div className="w-1/2">
      <p className="text-text-primary">{name}</p>
      <div className="flex flex-wrap mt-2 gap-2">
        {badgeArray.map((env) => {
          return <Badge key={env}>{env}</Badge>;
        })}
      </div>
    </div>
  );
};

export default NameWithBadge;
