import { useParams } from "react-router-dom";
import CareerPositionForm from "./CareerPositionForm";

export default function CareerPositionEdit() {
  const { id } = useParams();

  return <CareerPositionForm positionId={id} mode="edit" />;
}
