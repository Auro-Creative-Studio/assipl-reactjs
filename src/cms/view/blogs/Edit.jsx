import { useParams } from "react-router-dom";
import BlogForm from "./BlogForm";

export default function BlogEdit() {
  const { id } = useParams();

  return <BlogForm blogId={id} mode="edit" />;
}
