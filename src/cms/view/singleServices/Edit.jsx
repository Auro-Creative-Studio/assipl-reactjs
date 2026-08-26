import { useParams } from "react-router-dom";
import SingleServiceForm from "./SingleServiceForm";

export default function SingleServiceEdit() {
  const { id } = useParams();

  return <SingleServiceForm serviceId={id} mode="edit" />;
}
