import ImageTask from "@/type/ImageTask";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ImageTaskTableProps {
  imageTasks: ImageTask[];
  setImageTasks: React.Dispatch<React.SetStateAction<ImageTask[]>>;
}

export default function ImageTaskTable({
  imageTasks,
  setImageTasks,
}: ImageTaskTableProps) {
  function handleDeleteTapped(index: number) {
    setImageTasks(imageTasks.filter((e, i) => i !== index));
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead className="w-50">Image</TableHead>
          <TableHead>Original name</TableHead>
          <TableHead>New name</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {imageTasks.map((image, index) => (
          <TableRow key={image.file.name}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <Image
                key={image.file.name}
                src={URL.createObjectURL(image.file)}
                alt={image.file.name}
                width={50}
                height={24}
                className="w-50 h-24 object-contain rounded-lg shadow"
              />
            </TableCell>
            <TableCell>{image.file.name}</TableCell>
            <TableCell>
              {image.isLoading ? <Spinner /> : <span>{image.newName}</span>}
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                onClick={() => handleDeleteTapped(index)}
              >
                Remove
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
