import * as HoverCard from "@radix-ui/react-hover-card";
import { ReceptionPackigMaterial } from "@/api/ReceptionPackingMaterialsAPI";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
    document: ReceptionPackigMaterial;
}

const HoverCardReceptionPM = ({ document }: Props) => (
    <HoverCard.Root>
        <HoverCard.Trigger asChild>
            <tr className="tbody-tr">
                <td className="tbody-td">{document.receipt_date}</td>
                <td className="tbody-td">{document.invoice_date}</td>
                <td className="tbody-td">{document.received_by}</td>
                <td className="tbody-td">{document.supervisor_name}</td>
                <td className="tbody-td">
                    <Link
                        to={`/recepciones-mp/${document.id}`}
                    >
                        <Eye className="hover:text-gray-500 cursor-pointer" />
                    </Link>
                </td>
            </tr>
        </HoverCard.Trigger>
        <HoverCard.Portal>
            <HoverCard.Content
                className="w-[800px] rounded-md bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
                sideOffset={5}
            >
                <div className="space-y-4 p-4 bg-white rounded-lg">
                    <table className="table">
                        <thead>
                            <tr className="thead-tr">
                                <th className="thead-tr">Codigo</th>
                                <th className="thead-tr">Descripción</th>
                                <th className="thead-tr">Proveedor</th>
                                <th className="thead-tr">Lote</th>
                                <th className="thead-tr">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {document.items.map((item) => (
                                <tr className="tbody-tr" key={item.id}>
                                    <td className="tbody-td">{item.code}</td>
                                    <td className="tbody-td">{item.description}</td>
                                    <td className="tbody-td">{item.supplier}</td>
                                    <td className="tbody-td">{item.lote}</td>
                                    <td className="tbody-td">{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <HoverCard.Arrow className="fill-white" />
            </HoverCard.Content>
        </HoverCard.Portal>
    </HoverCard.Root>
);

export default HoverCardReceptionPM;
