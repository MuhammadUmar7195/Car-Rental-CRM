import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PuffLoader } from "react-spinners";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import useGetAllWorkshopEntry from "@/hooks/useGetAllWorkshopEntry";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/Common/DeleteDialog";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";

const WorkshopAppointmentHistory = () => {
  const { workshop, loading, error, refetch } = useGetAllWorkshopEntry();

  // Handle error toast
  if (error) {
    toast.error(error || "Something went wrong");
  }

  const handleRefresh = () => {
    refetch();
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/workshop/delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.status === true) {
        toast.success("Workshop deleted successfully");
      }
      refetch();
    } catch (error) {
      toast.error(
        error?.response?.data?.additionalNotes || "Failed to delete workshop"
      );
    }
  };

  return (
    <div className="py-10 lg:px-30 md:px-10 min-h-screen relative">
      <Card className="p-8 rounded-2xl shadow-lg bg-white">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-600 text-center lg:ml-14 uppercase tracking-wide flex-1 lg:mr-30">
            Workshop Appointment
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-purple-600 cursor-pointer"
          >
            refresh
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <PuffLoader color="#7e22ce" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Phone</TableHead>
                  <TableHead className="text-center">Email</TableHead>
                  <TableHead className="text-center">Vehicle</TableHead>
                  <TableHead className="text-center">Service</TableHead>
                  <TableHead className="text-center">Preferred Date</TableHead>
                  <TableHead className="text-center">Notes</TableHead>
                  <TableHead className="text-center">Created At</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workshop.length > 0 ? (
                  workshop.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell className="px-4 py-3">
                        {entry.fullName || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {entry.phoneNumber || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3 break-all">
                        {entry.email || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {entry.vehicle || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full">
                          {entry.service || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {entry.preferedDate
                          ? new Date(entry.preferedDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3 break-all">
                        {entry.additionalNotes
                          ? entry.additionalNotes.length > 40
                            ? entry.additionalNotes
                                .match(/.{1,40}/g)
                                .map((line, idx) => (
                                  <span key={idx}>
                                    {line}
                                    <br />
                                  </span>
                                ))
                            : entry.additionalNotes
                          : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {entry.createdAt
                          ? new Date(entry.createdAt).toLocaleString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <DeleteDialog
                          triggerButton={
                            <Button
                              variant="destructive"
                              className="text-white hover:opacity-80 px-3 py-1 rounded transition font-semibold text-xs cursor-pointer"
                            >
                              <MdDeleteOutline size={19} />
                            </Button>
                          }
                          onConfirm={() => handleDelete(entry._id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-gray-500 px-4 py-6"
                    >
                      No workshop appointments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WorkshopAppointmentHistory;
