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
import { Button } from "@/components/ui/button";
import useGetAllContacts from "@/hooks/useGetAllContacts";
import DeleteDialog from "@/components/Common/DeleteDialog";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";

const Contact = () => {
  const { contact, loading, error, refetch } = useGetAllContacts();
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
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/contact/delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.status === true) {
        toast.success("Contact deleted successfully");
      }
      refetch();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete contact");
    }
  };

  return (
    <div className="py-10 lg:px-30 md:px-10 min-h-screen relative">
      <Card className="p-8 rounded-2xl shadow-lg bg-white">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-600 text-center lg:ml-14 uppercase tracking-wide flex-1 lg:mr-30">
            Contact Form Submissions
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
                  <TableHead className="text-center">First Name</TableHead>
                  <TableHead className="text-center">Last Name</TableHead>
                  <TableHead className="text-center">Email</TableHead>
                  <TableHead className="text-center">Phone</TableHead>
                  <TableHead className="text-center">
                    Service Interest
                  </TableHead>
                  <TableHead className="text-center">Message</TableHead>
                  <TableHead className="text-center">Time</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contact.length > 0 ? (
                  contact.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell className="px-4 py-3">
                        {entry.firstName || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {entry.lastName || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3 break-all">
                        {entry.email || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {entry.phoneNumber || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full">
                          {entry.serviceInterest || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 break-all">
                        {entry.message
                          ? entry.message.length > 40
                            ? entry.message
                                .match(/.{1,40}/g)
                                .map((line, idx) => (
                                  <span key={idx}>
                                    {line}
                                    <br />
                                  </span>
                                ))
                            : entry.message
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
                      colSpan={6}
                      className="text-center text-gray-500 px-4 py-6"
                    >
                      No contact submissions found.
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

export default Contact;
