import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PuffLoader } from "react-spinners";
import dayjs from "dayjs";
import useSearchRentalDateFilter from "@/hooks/useSearchRentalDateFilter";

const SearchRentalDateFilter = () => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    rentals,
    loading,
    error,
    handleSearch,
  } = useSearchRentalDateFilter();

  return (
    <Card className="p-8 rounded-2xl shadow-lg bg-white mb-8">
      <h2 className="text-2xl font-bold text-purple-600 text-start uppercase tracking-wide">
        Search Rental Booking 
      </h2>
      <form
        onSubmit={handleSearch}
        className="flex flex-row gap-4 items-center mb-6 flex-wrap"
      >
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="min-w-[150px]"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="min-w-[150px]"
          />
        </div>
        <Button
          type="submit"
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-2 mt-4 md:mt-6 cursor-pointer"
        >
          Search
        </Button>
      </form>

      {error && <div className="text-red-600 text-start mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <PuffLoader color="#7e22ce" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Rental ID</TableHead>
                <TableHead className="text-center">Customer</TableHead>
                <TableHead className="text-center">Phone</TableHead>
                <TableHead className="text-center">Car</TableHead>
                <TableHead className="text-center">Model</TableHead>
                <TableHead className="text-center">Booking Date</TableHead>
                <TableHead className="text-center">Return Date</TableHead>
                <TableHead className="text-center">Set Price</TableHead>
                <TableHead className="text-center">Advance</TableHead>
                <TableHead className="text-center">Bond</TableHead>
                <TableHead className="text-center">Remaining</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.length > 0 ? (
                rentals.map((rental) => (
                  <TableRow key={rental._id}>
                    <TableCell className="font-mono text-xs">
                      {rental._id}
                    </TableCell>
                    <TableCell>{rental.customer?.name || "N/A"}</TableCell>
                    <TableCell>{rental.customer?.phone || "N/A"}</TableCell>
                    <TableCell>{rental.fleet?.carName || "N/A"}</TableCell>
                    <TableCell>{rental.fleet?.model || "N/A"}</TableCell>
                    <TableCell>
                      {rental.bookingDate
                        ? dayjs(rental.bookingDate).format("DD MMM YYYY")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {rental.returnDate
                        ? dayjs(rental.returnDate).format("DD MMM YYYY")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      $ {rental.setPrice?.toLocaleString() || "N/A"}
                    </TableCell>
                    <TableCell>
                      $ {rental.advanceRent?.toLocaleString() || "N/A"}
                    </TableCell>
                    <TableCell>
                      $ {rental.bond?.toLocaleString() || "N/A"}
                    </TableCell>
                    <TableCell>
                      $ {rental.remainingAmount?.toLocaleString() || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${
                          rental.status === "reserved"
                            ? "bg-yellow-100 text-yellow-800"
                            : rental.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : rental.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : rental.status === "active"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {rental.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    className="text-center text-gray-500 py-8"
                  >
                    No rentals found for the selected date range.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default SearchRentalDateFilter;
