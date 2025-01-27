import { useEffect } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";

export default function TomarLibrasPersonal() {
  const {task_crop_id} = useParams();
  const getCropEmployees = useAppStore((state) => state.getCropEmployees);
  const loadingGetEmployees = useAppStore((state) => state.loadingGetEmployees);

  useEffect(()=>{
    if(task_crop_id){
      getCropEmployees(task_crop_id);
    }
  },[])
  return (
    <>
      {loadingGetEmployees && <Spinner />}
    </>
  )
}
