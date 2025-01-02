import { ArrowLeftCircleIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";

type ReturnLinkProps = {
  url: string;
};
export default function ReturnLink({ url }: ReturnLinkProps) {
  return (
    <div className="flex justify-end">
      <Link
        to={url}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex items-center gap-2"
      >
        <ArrowLeftCircleIcon className="w-8" />
        <p>Regresar</p>
      </Link>
    </div>
  );
}
